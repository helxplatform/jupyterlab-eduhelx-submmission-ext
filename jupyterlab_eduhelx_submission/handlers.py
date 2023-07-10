import json
import os
import requests
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from .config import ExtensionConfig
from ._version import __version__

class BaseHandler(APIHandler):
    @property
    def config(self) -> ExtensionConfig:
        return ExtensionConfig(self.serverapp)

class AssignmentHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        current_path: str = self.get_argument("path")
        self.finish(json.dumps({
            "name": current_path.split("/")[-1]
        }))

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
        ("assignment", AssignmentHandler),
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
