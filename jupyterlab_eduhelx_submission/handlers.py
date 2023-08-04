import json
import os
import requests
import subprocess
import tempfile
import shutil
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from pathlib import Path
from .config import ExtensionConfig
from .api import Api
from .git import (
    InvalidGitRepositoryException,
    get_remote, get_repo_root, clone_repository,
    get_tail_commit_id, get_repo_name, add_remote
)
from .process import execute
from ._version import __version__

class BaseHandler(APIHandler):
    @property
    def config(self) -> ExtensionConfig:
        return ExtensionConfig(self.serverapp)

    @property
    def api(self) -> Api:
        return Api(self.config)


class CloneStudentRepositoryHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        data = json.loads(self.request.body)
        repository_url: str = data["repository_url"]
        current_path: str = data["current_path"]
        
        course = self.api.get_course()
        master_repository_url = course["master_remote_url"]

        # Get the name of the master repo and the first commit id 
        with tempfile.TemporaryDirectory() as tmp_master_repo:
            clone_repository(master_repository_url, tmp_master_repo)
            master_repo_name = get_repo_name(path=tmp_master_repo)
            master_tail_id = get_tail_commit_id(path=tmp_master_repo)

        # This needs to get cleaned up!
        tmp_repo = tempfile.TemporaryDirectory()
        # Check that the student repo is actually a repo, and get it's first commit id
        try:
            clone_repository(repository_url, tmp_repo.name)
            cloned_repo_name = get_repo_name(path=tmp_repo.name)
            cloned_tail_id = get_tail_commit_id(path=tmp_repo.name)
        except Exception as e:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "URL is not a valid git repository. Please make sure you have the correct URL."
            }))
            tmp_repo.cleanup()
            return
        
        # Confirm that the repository that the student has provided
        # is actually a fork of the master repository.
        # There's no actual, functional feature of "forks" in git, so we'll
        # just check that:
        #   1. The initial commit (tail) of the repositories are the same
        #   2. The student repo isn't named the same as the master repo.

        if master_tail_id != cloned_tail_id:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "The repository is not a fork of the master class repository. You may have the wrong URL."
            }))
            tmp_repo.cleanup()
            return
            
        if master_repo_name == cloned_repo_name:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "The repository appears to be the master class repository. You should only try to clone the student version created for you."
            }))
            tmp_repo.cleanup()
            return

        cloned_repo_path = os.path.join(current_path, cloned_repo_name)
        # Check to make sure that cloned_repo_name either doesn't exist or exists but is an empty directory.
        if os.path.exists(cloned_repo_path) and any(os.scandir(cloned_repo_path)):
            self.set_status(409)
            self.finish(json.dumps({
                "message": f'The repository folder "{cloned_repo_name}" exists and is not empty. Please move or rename it and try again.'
            }))
            tmp_repo.cleanup()
            return
        
        shutil.move(tmp_repo.name, cloned_repo_path)
        tmp_repo.cleanup()

        # Now we're working with cloned_repo_path
        add_remote("upstream", master_repository_url, path=cloned_repo_path)

        # Return the path to the cloned repo.
        cwd = os.getcwd()
        frontend_cloned_path = os.path.relpath(
            cloned_repo_path,
            cwd
        )
        
        self.finish(json.dumps(os.path.join("/", frontend_cloned_path)))


class CourseAndStudentHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        student = self.api.get_student()
        course = self.api.get_course()
        self.finish(json.dumps({
            "student": student,
            "course": course
        }))

class AssignmentsHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        current_path: str = self.get_argument("path")
        current_path_abs = os.path.realpath(current_path)

        student = self.api.get_student()
        assignments = self.api.get_assignments(student["student_onyen"])
        course = self.api.get_course()

        value = {
            "current_assignment": None,
            "assignments": None
        }

        try:
            master_repo_remote = get_remote(
                name="upstream",
                path=current_path_abs
            )
            repo_root = get_repo_root(current_path_abs)
            repo_root_abs = os.path.realpath(repo_root)
        except InvalidGitRepositoryException:
            # Not in the student's class repo, so not in an assignment.
            self.finish(json.dumps(value))
            return

        # Confirm that the student's current repo is a fork of the class's master repo.
        if master_repo_remote != course["master_remote_url"]:
            self.finish(json.dumps(value))
            return

        # Add absolute path to assignment so that the frontend
        # extension knows how to open the assignment without having
        # to know the repository root.
        for assignment in assignments:
            # The frontend can only access files under directory where the Jupyter server is running,
            # so we need to make sure the "absolute" path is actually relative to the Jupyter server
            cwd = os.getcwd()
            rel_assignment_path = os.path.relpath(
                os.path.join(repo_root_abs, assignment["directory_path"]),
                cwd
            )
            # The cwd is the root in the frontend, so treat the path as such.
            assignment["absolute_directory_path"] = os.path.join("/", rel_assignment_path)
        value["assignments"] = assignments

        # The student is in their repo, but we still need to check if they're actually in an assignment directory.
        current_assignment = None
        for assignment in assignments:
            assignment_path = Path(os.path.join(
                repo_root_abs,
                assignment["directory_path"]
            ))
            if assignment_path == Path(current_path_abs) or assignment_path in Path(current_path_abs).parents:
                current_assignment = assignment
                break

        if current_assignment is not None:
            submissions = self.api.get_assignment_submissions(current_assignment["id"], student["student_onyen"], git_path=current_path_abs)
            current_assignment["submissions"] = submissions

            value["current_assignment"] = current_assignment
            self.finish(json.dumps(value))
        else:
            self.finish(json.dumps(value))
            

class SubmissionHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        res = requests.post(f"{ self.config.GRADER_API_URL }api/v1/submission", params={
            "student_id": None,
            "commit_id": None
        })
        self.set_status(res.status_code)
        self.finish(res.text)

class SettingsHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        server_version = str(__version__)

        self.finish(json.dumps({
            "serverVersion": server_version
        }))


def setup_handlers(server_app):
    web_app = server_app.web_app
    
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    handlers = [
        ("assignments", AssignmentsHandler),
        ("course_student", CourseAndStudentHandler),
        ("submission", SubmissionHandler),
        ("clone_student_repository", CloneStudentRepositoryHandler),
        ("settings", SettingsHandler)
    ]
    handlers_with_path = [
        (
            url_path_join(base_url, "jupyterlab-eduhelx-submission", uri),
            handler
        ) for (uri, handler) in handlers
    ]
    web_app.add_handlers(host_pattern, handlers_with_path)
