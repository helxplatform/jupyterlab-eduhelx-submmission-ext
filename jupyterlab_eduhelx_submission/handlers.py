import json
import os
import requests
import subprocess
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from .config import ExtensionConfig
from .api import Api
from .git import InvalidGitRepositoryException, get_remote
from .process import execute
from ._version import __version__

class BaseHandler(APIHandler):
    @property
    def config(self) -> ExtensionConfig:
        return ExtensionConfig(self.serverapp)

    @property
    def api(self) -> Api:
        return Api(self.config)


class StudentHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        student = self.api.get_student()
        self.finish(json.dumps(student))

class AssignmentsHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        student = self.api.get_student()
        assignments = self.api.get_assignments(student["student_onyen"])
        self.finish(json.dumps(assignments))

class CurrentAssignmentHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        current_path: str = self.get_argument("path")
        current_path_abs = os.path.abspath(current_path)

        student = self.api.get_student()
        assignments = self.api.get_assignments(student["student_onyen"])
        current_assignment = None
        try:
            remote = get_remote(current_path_abs)
            for assignment in assignments:
                if remote == assignment["git_remote_url"]:
                    current_assignment = assignment
                    break
        except InvalidGitRepositoryException:
            self.finish(json.dumps(None))
            return

        if current_assignment is not None:
            submissions = self.api.get_assignment_submissions(current_assignment["id"], student["student_onyen"], git_path=current_path_abs)
            current_assignment["submissions"] = submissions
            self.finish(json.dumps(current_assignment))
        else:
            self.finish(json.dumps(None))
            

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
        ("assignment", CurrentAssignmentHandler),
        ("student", StudentHandler),
        ("submission", SubmissionHandler),
        ("settings", SettingsHandler)
    ]
    handlers_with_path = [
        (
            url_path_join(base_url, "jupyterlab-eduhelx-submission", uri),
            handler
        ) for (uri, handler) in handlers
    ]
    web_app.add_handlers(host_pattern, handlers_with_path)
