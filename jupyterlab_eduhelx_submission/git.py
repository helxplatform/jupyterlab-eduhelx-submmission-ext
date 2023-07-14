from .process import execute

class InvalidGitRepositoryException(Exception):
    ...

def get_remote(path="./"):
    (remote, err) = execute(["git", "remote", "get-url", "origin"], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException()
    return remote
    
def get_commit_info(commit_id: str, path="./"):
    fmt = "%an%n%ae%n%cn%n%ce"
    (out, err) = execute(["git", "show", "-s", f"--format={ fmt }", commit_id], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException()
    
    [author_name, author_email, committer_name, committer_email] = out.split("\n")

    (message_out, err) = execute(["git", "show", "-s", f"--format=%B", commit_id], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException()

    return {
        "id": commit_id,
        "message": message_out,
        "author_name": author_name,
        "author_email": author_email,
        "committer_name": committer_name,
        "committer_email": committer_email
    }