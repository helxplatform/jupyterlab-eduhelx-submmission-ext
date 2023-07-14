import subprocess

def execute(cmd, **kwargs):
    process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            **kwargs
        )
    output, error = process.communicate()
    output = output.decode("utf-8")
    error = error.decode("utf-8")
    
    return (output, error)