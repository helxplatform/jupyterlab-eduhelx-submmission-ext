from .process import execute

class InvalidGitRepositoryException(Exception):
    ...

def get_repo_root(path="./"):
    (root, err) = execute(["git", "rev-parse", "--show-toplevel"], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException(err)
    return root

def get_remote(name="origin", path="./"):
    (remote, err) = execute(["git", "remote", "get-url", name], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException(err)
    return remote
    
def get_commit_info(commit_id: str, path="./"):
    fmt = "%an%n%ae%n%cn%n%ce"
    (out, err) = execute(["git", "show", "-s", f"--format={ fmt }", commit_id], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException(err)
    
    [author_name, author_email, committer_name, committer_email] = out.split("\n")

    (message_out, err) = execute(["git", "show", "-s", f"--format=%B", commit_id], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException(err)

    return {
        "id": commit_id,
        "message": message_out,
        "author_name": author_name,
        "author_email": author_email,
        "committer_name": committer_name,
        "committer_email": committer_email
    }

def get_tail_commit_id(path="./"):
    (out, err) = execute(["git", "rev-list", "--max-parents=0", "HEAD"], cwd=path)
    if err != "":
        # Note: this will also error if ran on a repository with 0 commits,
        # although that should never be a use-case so it should be alright.
        raise InvalidGitRepositoryException()
    return out
    
def clone_repository(remote: str, path="./"):
    (out, err) = execute(["git", "clone", remote, path])
    # Git clone outputs human-useful information to stderr.
    last_line = err.split("\n")[-1]
    if last_line.startswith("fatal:"):
        raise Exception(last_line)
    # This will be an empty string
    return out

def get_repo_name(path="./"):
    (out, err) = execute(["git", "config", "--get", "remote.origin.url"], cwd=path)
    if out == "" or err != "":
        raise InvalidGitRepositoryException()
    # Technically, a git remote URL can contain quotes, so it could break out of the quotations around `out`.
    # However, since execute is not executing in shell mode, it can't perform command substitution so there isn't
    # any risk involved here.
    (out, err) = execute(["basename", "-s", ".git", out])
    if err != "":
        raise Exception(err)
    return out

def add_remote(remote_name: str, remote_url: str, path="./"):
    (out, err) = execute(["git", "remote", "add", remote_name, remote_url], cwd=path)
    if err != "":
        raise InvalidGitRepositoryException()
    # This will be an empty string
    return out