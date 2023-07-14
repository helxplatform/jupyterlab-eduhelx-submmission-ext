from .process import execute

class InvalidGitRepositoryException(Exception):
    ...

def get_remote(path):
    (remote, err) = execute(["git", "remote", "get-url", "origin"], cwd=path)
    remote = remote.strip()
    if err != "":
        raise InvalidGitRepositoryException()
    return remote
    
def get_commit_info(commit_id: str):

    return {
        "id": "",
        "message": "",
        "author_name": "",
        "author_email": "",
        "committer_name": "",
        "committer_email": ""
    }