import os
from pathlib import Path
from eduhelx_utils.git import InvalidGitRepositoryException
from eduhelx_utils import git

class NotStudentClassRepositoryException(Exception):
    pass

class StudentClassRepo:
    def __init__(self, course, assignments, current_path):
        self.course = course
        self.assignments = assignments
        self.current_path = os.path.realpath(current_path)
        
        self.repo_root = self._compute_repo_root(self.course, self.current_path)
        self.current_assignment = self._compute_current_assignment(self.assignments, self.repo_root, self.current_path)
    
    def get_assignment_path(self, assignment):
        return os.path.join(self.repo_root, assignment["directory_path"])

    @staticmethod
    def _compute_repo_root(course, current_path):
        try: 
            master_repo_remote = git.get_remote(name="upstream", path=current_path)
            repo_root = os.path.realpath(
                git.get_repo_root(path=current_path)
            )
            if master_repo_remote != course["master_remote_url"]:
                raise NotStudentClassRepositoryException()
            return repo_root
        except InvalidGitRepositoryException as e:
            raise e

    @staticmethod
    def _compute_current_assignment(assignments, repo_root, current_path):
        current_assignment = None
        for assignment in assignments:
            assignment_path = Path(os.path.join(
                repo_root,
                assignment["directory_path"]
            ))
            if assignment_path == Path(current_path) or assignment_path in Path(current_path).parents:
                current_assignment = assignment
                break

        return current_assignment
