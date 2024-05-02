import json
import os
import requests
import subprocess
import tempfile
import shutil
import tornado
import time
import asyncio
import traceback
from urllib.parse import urlparse
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from pathlib import Path
from collections.abc import Iterable
from .config import ExtensionConfig
from eduhelx_utils.git import (
    InvalidGitRepositoryException,
    clone_repository, fetch_repository, init_repository,
    get_tail_commit_id, get_repo_name, add_remote,
    stage_files, commit, push, get_commit_info,
    get_modified_paths, get_repo_root as get_git_repo_root,
    checkout
)
from eduhelx_utils.api import Api
from eduhelx_utils.process import execute
from .student_repo import StudentClassRepo, NotStudentClassRepositoryException
from ._version import __version__

FIXED_REPO_ROOT = "eduhelx/{}-student" # <class_name>
ORIGIN_REMOTE_NAME = "origin"
UPSTREAM_REMOTE_NAME = "upstream"
MAIN_BRANCH_NAME = "main"

class AppContext:
    def __init__(self, serverapp):
        self.serverapp = serverapp
        self.config = ExtensionConfig(self.serverapp)
        self.api = Api(
            api_url=self.config.GRADER_API_URL,
            user_onyen=self.config.USER_ONYEN,
            user_autogen_password=self.config.USER_AUTOGEN_PASSWORD,
            jwt_refresh_leeway_seconds=self.config.JWT_REFRESH_LEEWAY_SECONDS
        )

    async def get_repo_root(self):
        course = await self.api.get_course()
        return self._compute_repo_root(course["name"])

    @staticmethod
    def _compute_repo_root(course_name: str):
        # NOTE: the relative path for the server is the root path for the UI
        return Path(FIXED_REPO_ROOT.format(course_name.replace(" ", "_")))
        

class BaseHandler(APIHandler):
    context: AppContext = None

    @property
    def config(self) -> ExtensionConfig:
        return self.context.config

    @property
    def api(self) -> Api:
        return self.context.api


class CloneStudentRepositoryHandler(BaseHandler):
    @tornado.web.authenticated
    async def post(self):
        data = json.loads(self.request.body)
        repository_url: str = data["repository_url"]
        current_path: str = data["current_path"]
        current_path_abs = os.path.realpath(current_path)
        
        course = await self.api.get_course()
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

        cloned_repo_path = os.path.join(current_path_abs, cloned_repo_name)
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

class PollCourseStudentHandler(BaseHandler):
    @tornado.web.authenticated
    async def get(self):
        # If this is the first poll the client has made, the `current_value` argument will not be present.
        # Note: we are not deserializing `current_value`; it is a JSON-serialized string.
        current_value: str | None = None
        if "current_value" in self.request.arguments:
            current_value = self.get_argument("current_value")

        start = time.time()
        while (elapsed := time.time() - start) < self.config.LONG_POLLING_TIMEOUT_SECONDS:
            new_value = await CourseAndStudentHandler.get_value(self)
            if new_value != current_value:
                self.finish(new_value)
                return
            asyncio.sleep(self.config.LONG_POLLING_SLEEP_INTERVAL_SECONDS)
            
        self.finish(new_value)

class CourseAndStudentHandler(BaseHandler):
    async def get_value(self):
        student = await self.api.get_my_user()
        course = await self.api.get_course()
        return json.dumps({
            "student": student,
            "course": course
        })
    
    @tornado.web.authenticated
    async def get(self):
        self.finish(await self.get_value())

class PollAssignmentsHandler(BaseHandler):
    @tornado.web.authenticated
    async def get(self):
        current_path: str = self.get_argument("path")
        # If this is the first poll the client has made, the `current_value` argument will not be present.
        # Note: we are not deserializing `current_value`; it is a JSON-serialized string.
        current_value: str | None = None
        if "current_value" in self.request.arguments:
            current_value = self.get_argument("current_value")

        start = time.time()
        while (elapsed := time.time() - start) < self.config.LONG_POLLING_TIMEOUT_SECONDS:
            new_value = await AssignmentsHandler.get_value(self, current_path)
            if new_value != current_value:
                self.finish(new_value)
                return
            asyncio.sleep(self.config.LONG_POLLING_SLEEP_INTERVAL_SECONDS)
            
        self.finish(new_value)

class AssignmentsHandler(BaseHandler):
    async def get_value(self, current_path: str):
        current_path_abs = os.path.realpath(current_path)

        student = await self.api.get_my_user()
        assignments = await self.api.get_my_assignments()
        course = await self.api.get_course()

        value = {
            "current_assignment": None,
            "assignments": None,
        }

        try:
            student_repo = StudentClassRepo(course, assignments, current_path_abs)
        except Exception:
            return json.dumps(value)

        # Add absolute path to assignment so that the frontend
        # extension knows how to open the assignment without having
        # to know the repository root.
        for assignment in assignments:
            # The frontend can only access files under directory where the Jupyter server is running,
            # so we need to make sure the "absolute" path is actually relative to the Jupyter server
            cwd = os.getcwd()
            rel_assignment_path = os.path.relpath(
                student_repo.get_assignment_path(assignment),
                cwd
            )
            # The cwd is the root in the frontend, so treat the path as such.
            # NOTE: IMPORTANT: this field is NOT absolute on the server. It's only the absolute path for the webapp.
            assignment["absolute_directory_path"] = os.path.join("/", rel_assignment_path)
        value["assignments"] = assignments

        current_assignment = student_repo.current_assignment
        # The student is in their repo, but we still need to check if they're actually in an assignment directory.
        if current_assignment is None:
            # If user is not in an assignment, we're done. Just leave current_assignment as None.
            return json.dumps(value)
        
        submissions = await self.api.get_my_submissions(current_assignment["id"])
        for submission in submissions:
            submission["commit"] = get_commit_info(submission["commit_id"], path=student_repo.repo_root)
        current_assignment["submissions"] = submissions
        current_assignment["staged_changes"] = []
        for modified_path in get_modified_paths(path=student_repo.repo_root):
            full_modified_path = Path(student_repo.repo_root) / modified_path["path"]
            abs_assn_path = Path(student_repo.repo_root) / current_assignment["directory_path"]
            try:
                path_relative_to_assn = full_modified_path.relative_to(abs_assn_path)
                modified_path["path_from_repo"] = modified_path["path"]
                modified_path["path_from_assn"] = str(path_relative_to_assn)
                current_assignment["staged_changes"].append(modified_path)
            except ValueError:
                # This path is not part of the current assignment directory
                pass
        
        value["current_assignment"] = current_assignment
        return json.dumps(value)

    @tornado.web.authenticated
    async def get(self):
        current_path: str = self.get_argument("path")
        self.finish(await self.get_value(current_path))
            

class SubmissionHandler(BaseHandler):
    @tornado.web.authenticated
    async def post(self):
        data = json.loads(self.request.body)
        submission_summary: str = data["summary"]
        submission_description: str | None = data.get("description")
        current_path: str = data["current_path"]
        current_path_abs = os.path.realpath(current_path)

        student = await self.api.get_my_user()
        assignments = await self.api.get_my_assignments()
        course = await self.api.get_course()

        try:
            student_repo = StudentClassRepo(course, assignments, current_path_abs)
        except InvalidGitRepositoryException:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in a git repository"
            }))
            return
        except NotStudentClassRepositoryException:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in student's class repository"
            }))
            return
        
        if student_repo.current_assignment is None:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in an assignment directory"
            }))
            return

        current_assignment_path = student_repo.get_assignment_path(student_repo.current_assignment)
        stage_files(".", path=student_repo.repo_root)
        commit_id = commit(
            submission_summary,
            submission_description if submission_description else None,
            path=student_repo.repo_root
        )
        push(ORIGIN_REMOTE_NAME, MAIN_BRANCH_NAME, path=student_repo.repo_root)
        try:
            await self.api.create_submission(
                student_repo.current_assignment["id"],
                commit_id
            )
            self.finish()
        except requests.exceptions.HTTPError as e:
            self.set_status(e.response.status_code)
            self.finish(e.response.text)


class SettingsHandler(BaseHandler):
    @tornado.web.authenticated
    async def get(self):
        server_version = str(__version__)

        self.finish(json.dumps({
            "serverVersion": server_version
        }))


async def create_repo_root_if_not_exists(context: AppContext) -> None:
    repo_root = await context.get_repo_root()
    if not repo_root.exists():
        repo_root.mkdir(parents=True)

async def clone_repo_if_not_exists(context: AppContext) -> None:
    course = await context.api.get_course()
    student = await context.api.get_my_user()
    repo_root = context._compute_repo_root(course["name"])
    try:
        get_git_repo_root(path=repo_root)
    except InvalidGitRepositoryException:
        master_repository_url = course["master_remote_url"]
        student_repository_url = student["fork_remote_url"]
        init_repository(repo_root)
        await set_git_authentication(context)
        add_remote(UPSTREAM_REMOTE_NAME, master_repository_url, path=repo_root)
        add_remote(ORIGIN_REMOTE_NAME, student_repository_url, path=repo_root)
        fetch_repository(ORIGIN_REMOTE_NAME, path=repo_root)
        checkout(f"{ MAIN_BRANCH_NAME }", path=repo_root)
        fetch_repository(UPSTREAM_REMOTE_NAME, path=repo_root)
        

async def set_git_authentication(context: AppContext) -> None:
    repo_root = await context.get_repo_root()
    student = await context.api.get_my_user()
    student_repository_url = student["fork_remote_url"]

    try:
        get_git_repo_root(path=repo_root)
        execute(["git", "config", "--local", "--unset-all", "credential.helper"], cwd=repo_root)
        execute(["git", "config", "--local", "credential.helper", ""], cwd=repo_root)
        execute(["git", "config", "--local", "--add", "credential.helper", context.config.CREDENTIAL_HELPER], cwd=repo_root)
    except InvalidGitRepositoryException:
        config_path = repo_root / ".git" / "config"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(config_path, "w+") as f:
            credential_config = \
                "[user]\n" \
                f"    name = { context.config.USER_ONYEN }\n" \
                f"    email = { student['email'] }\n" \
                "[author]\n" \
                f"    name = { context.config.USER_ONYEN }\n" \
                f"    email = { student['email'] }\n" \
                "[committer]\n" \
                f"    name = { context.config.USER_ONYEN }\n" \
                f"    email = { student['email'] }\n" \
                f"[credential]" \
                f"    helper = ''" \
                f"    helper = { context.config.CREDENTIAL_HELPER }"
            f.write(credential_config)

    parsed = urlparse(student_repository_url)
    protocol, host = parsed.scheme, parsed.netloc
    credentials = \
        f"protocol={ protocol }\n" \
        f"host={ host }\n" \
        f"username={ context.config.USER_ONYEN }\n" \
        f"password={ context.config.USER_AUTOGEN_PASSWORD }"
    execute(["git", "credential", "approve"], stdin_input=credentials, cwd=repo_root)

async def set_root_folder_permissions(context: AppContext) -> None:
    # repo_root = await context.get_repo_root()
    # execute(["chown", "root", repo_root.parent])
    # execute(["chmod", "+t", repo_root.parent])
    # execute(["chmod", "a-w", repo_root.parent])
    ...

async def setup_backend(context: AppContext):
    try:
        await create_repo_root_if_not_exists(context)
        await set_git_authentication(context)
        await clone_repo_if_not_exists(context)
        await set_root_folder_permissions(context)
    except:
        print(traceback.format_exc())

def setup_handlers(server_app):
    web_app = server_app.web_app
    BaseHandler.context = AppContext(server_app)
    
    loop = asyncio.get_event_loop()
    asyncio.run_coroutine_threadsafe(setup_backend(BaseHandler.context), loop)

    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    handlers = [
        ("assignments", AssignmentsHandler),
        (("assignments", "poll"), PollAssignmentsHandler),
        ("course_student", CourseAndStudentHandler),
        (("course_student", "poll"), PollCourseStudentHandler),
        ("submit_assignment", SubmissionHandler),
        ("clone_student_repository", CloneStudentRepositoryHandler),
        ("settings", SettingsHandler)
    ]

    handlers_with_path = [
        (
            url_path_join(base_url, "eduhelx-jupyterlab-student", *(uri if not isinstance(uri, str) else [uri])),
            handler
        ) for (uri, handler) in handlers
    ]
    web_app.add_handlers(host_pattern, handlers_with_path)
