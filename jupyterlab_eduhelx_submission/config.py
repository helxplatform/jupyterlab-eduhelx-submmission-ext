import os
from typing import get_type_hints, Union
from jupyter_server.serverapp import ServerApp

def _parse_bool(value: Union[str, bool]) -> bool:
    if type(value) == bool: return value
    return True if value.lower() in ["true", "yes", "1"] else False

""" Adapted boilerplate from https://www.doppler.com/blog/environment-variables-in-python
- Specify default values in config, and it will override them if present in env.
- If a value does not have default value (only a type hint) and is not specified in env, it will raise an exception.
- Methods names of the template `process_{CONFIG_FIELD}` are reserved and may be used to post-process the value of the variable.
"""
class Config:
    GRADER_API_URL: str

    """
    Map environment variables to class fields according to these rules:
      - Field won't be parsed unless it has a type annotation
      - Field will be skipped if not in all caps
      - Class field and environment variable name are the same
    """
    def __init__(self, env):
        for field in self.__annotations__:
            if not field.isupper():
                continue

            # Raise AppConfigError if required field not supplied
            default_value = getattr(self, field, None)
            if default_value is None and env.get(field) is None:
                raise ValueError('The {} field is required'.format(field))

            # Cast env var value to expected type and raise AppConfigError on failure
            try:
                var_type = get_type_hints(self.__class__)[field]
                if var_type == bool:
                    value = _parse_bool(env.get(field, default_value))
                else:
                    value = var_type(env.get(field, default_value))

                postprocessing_method = getattr(self, f"process_{field}", None)
                if postprocessing_method is not None:
                    value = postprocessing_method(value)

                self.__setattr__(field, value)
            except ValueError:
                raise ValueError('Unable to cast value of "{}" to type "{}" for "{}" field'.format(
                    env[field],
                    var_type,
                    field
                )
            )

    """ Add a trailing slash to the URL if not present """
    def process_GRADER_API_URL(self, value: str):
        if not value.endswith("/"):
            value += "/"
        return value

    def __repr__(self):
        return str(self.__dict__)

"""
By default, use environment variables to instantiate the config.
Override with any values specified in the extension's config.
E.g.
    export GRADER_API_URL="url_A"
    jupyter lab --EduhelxSubmission.GRADER_API_URL="url_B"
    # Then we'll use "url_B" for GRADER_API_URL, since it's specified directly inside the config.
"""
class ExtensionConfig(Config):
    def __init__(
        self,
        server_app: ServerApp = None
    ):
        data_source = os.environ.copy()
        if server_app is not None:
            for key in server_app.config["EduhelxSubmission"].keys():
                data_source[key] = server_app.config["EduhelxSubmission"][key].get_value()

        super().__init__(data_source)