import subprocess

def remove_trailing_newline(string: str) -> str:
    if string.endswith("\n"):
        return string[:-1]
    return string

def execute(cmd, stdin_input=None, **kwargs):
    process = subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE if stdin_input is not None else None
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        **kwargs
    )
    if stdin_input is not None:
        process.stdin.write(stdin_input.encode("utf-8"))
        process.stdin.close()
        
    output, error = process.communicate()
    output = output.decode("utf-8")
    error = error.decode("utf-8")
    exit_code = process.returncode

    output = remove_trailing_newline(output)
    error = remove_trailing_newline(error)

    return (output, error, exit_code)