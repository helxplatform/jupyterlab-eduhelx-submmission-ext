import json
import os
import tempfile
import shutil
import tornado
import time
import asyncio
import httpx
import traceback
from urllib.parse import urlparse
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from pathlib import Path
from collections.abc import Iterable
from .config import ExtensionConfig
from eduhelx_utils.git import (
    InvalidGitRepositoryException,
    clone_repository, init_repository, fetch_repository,
    get_tail_commit_id, get_repo_name, add_remote,
    stage_files, commit, push, get_commit_info,
    get_modified_paths, checkout, get_repo_root as get_git_repo_root
)
from eduhelx_utils.api import Api
from eduhelx_utils.process import execute
from .instructor_repo import InstructorClassRepo, NotInstructorClassRepositoryException
from ._version import __version__

FIXED_REPO_ROOT = "eduhelx/{}-prof" # <class_name>
ORIGIN_REMOTE_NAME = "origin"
MAIN_BRANCH_NAME = "main"

def set_datetime_tz(datetime: str):
    if datetime is None: return None
    # NOTE: Postgres is DST aware and will automatically adjust the timezone offset for daylight savings
    # NOTE: Since time.timezone is *not* DST aware, we will let Postgres handle everything.
    # e.g. 2024-03-02T19:03 -> 2024-03-02T23:03-05:00
    utc_offset = -time.timezone / 60
    if utc_offset == 0: return datetime + "Z"
    utc_offset_sign = "-" if utc_offset < 0 else "+"
    utc_offset_hr = str(int(abs(utc_offset) // 60)).zfill(2)
    utc_offset_min = str(int(abs(utc_offset) % 60)).zfill(2)
    return datetime + f"{ utc_offset_sign }{utc_offset_hr}:{utc_offset_min}"

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
        self.api.client.timeout = httpx.Timeout(15.0, read=15.0)

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

class CourseAndInstructorAndStudentsHandler(BaseHandler):
    async def get_value(self):
        instructor = await self.api.get_my_user()
        students = await self.api.list_students()
        course = await self.api.get_course()
        return json.dumps({
            "instructor": instructor,
            "students": students,
            "course": course
        })
    
    @tornado.web.authenticated
    async def get(self):
        self.finish(await self.get_value())

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
            student_repo = InstructorClassRepo(course, assignments, current_path_abs)
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

            assignment["staged_changes"] = []
            for modified_path in get_modified_paths(path=student_repo.repo_root):
                full_modified_path = Path(student_repo.repo_root) / modified_path["path"]
                abs_assn_path = Path(student_repo.repo_root) / assignment["directory_path"]
                try:
                    path_relative_to_assn = full_modified_path.relative_to(abs_assn_path)
                    modified_path["path_from_repo"] = modified_path["path"]
                    modified_path["path_from_assn"] = str(path_relative_to_assn)
                    assignment["staged_changes"].append(modified_path)
                except ValueError:
                    # This path is not part of the assignment directory
                    pass

        value["assignments"] = assignments
        
        current_assignment = student_repo.current_assignment
        if current_assignment:
            current_assignment["student_submissions"] = await self.api.get_submissions(current_assignment["id"])
            for student in current_assignment["student_submissions"]:
                for submission in current_assignment["student_submissions"][student]:
                    submission["commit"] = {
                        "id": submission["commit_id"],
                        "message": "",
                        "author_name": "",
                        "author_email": "",
                        "committer_name": "",
                        "committer_email": ""
                    }

        value["current_assignment"] = current_assignment
        return json.dumps(value)

    @tornado.web.authenticated
    async def get(self):
        current_path: str = self.get_argument("path")
        self.finish(await self.get_value(current_path))

    @tornado.web.authenticated
    async def patch(self):
        name = self.get_argument("name")
        data = self.get_json_body()
        if "available_date" in data: data["available_date"] = set_datetime_tz(data["available_date"])
        if "due_date" in data: data["due_date"] = set_datetime_tz(data["due_date"])
        await self.api.update_assignment(name, **data)

class SubmissionHandler(BaseHandler):
    @tornado.web.authenticated
    async def post(self):
        data = json.loads(self.request.body)
        submission_summary: str = data["summary"]
        current_path: str = data["current_path"]
        current_path_abs = os.path.realpath(current_path)

        instructor = await self.api.get_my_user()
        assignments = await self.api.get_my_assignments()
        course = await self.api.get_course()

        try:
            instructor_repo = InstructorClassRepo(course, assignments, current_path_abs)
        except InvalidGitRepositoryException:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in a git repository"
            }))
            return
        except NotInstructorClassRepositoryException:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in your class repository"
            }))
            return
        
        if instructor_repo.current_assignment is None:
            self.set_status(400)
            self.finish(json.dumps({
                "message": "Not in an assignment directory"
            }))
            return

        current_assignment_path = instructor_repo.get_assignment_path(instructor_repo.current_assignment)
        stage_files(".", path=instructor_repo.repo_root)
        commit_id = commit(
            submission_summary,
            None,
            path=instructor_repo.repo_root
        )
        push(ORIGIN_REMOTE_NAME, MAIN_BRANCH_NAME, path=instructor_repo.repo_root)
        self.finish()

class SyncToLMSHandler(BaseHandler):
    @tornado.web.authenticated
    async def post(self):
        await self.api.sync_to_lms()
        self.finish()

class SettingsHandler(BaseHandler):
    @tornado.web.authenticated
    async def get(self):
        server_version = str(__version__)
        # await asyncio.sleep(5)
        course_name = (await self.api.get_course())["name"]
        repo_root = FIXED_REPO_ROOT.format(course_name) # note: the relative path for the server is the root path for the UI

        self.finish(json.dumps({
            "serverVersion": server_version,
            "repoRoot": repo_root
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
        """ This could just be an outright clone, but to stay consistent with how JLS fetches,
        we will also fetch here.
        """
        master_repository_url = course["master_remote_url"]
        init_repository(repo_root)
        await set_git_authentication(context)
        add_remote(ORIGIN_REMOTE_NAME, master_repository_url, path=repo_root)
        fetch_repository(ORIGIN_REMOTE_NAME, path=repo_root)
        checkout(f"{ MAIN_BRANCH_NAME }", path=repo_root)
        

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
        ("course_instructor_students", CourseAndInstructorAndStudentsHandler),
        ("clone_student_repository", CloneStudentRepositoryHandler),
        ("submit_assignment", SubmissionHandler),
        ("sync_to_lms", SyncToLMSHandler),
        ("settings", SettingsHandler)
    ]

    handlers_with_path = [
        (
            url_path_join(base_url, "eduhelx-jupyterlab-prof", *(uri if not isinstance(uri, str) else [uri])),
            handler
        ) for (uri, handler) in handlers
    ]
    web_app.add_handlers(host_pattern, handlers_with_path)
