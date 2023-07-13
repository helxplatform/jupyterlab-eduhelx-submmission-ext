import requests
from .config import Config

class Api:
    def __init__(self, config: Config):
        self.config = config

    @property
    def api_url(self) -> str:
        return self.config.GRADER_API_URL

    def get_assignments(self):
        res = requests.get(f"{ self.api_url }api/v1/assignments")
        return res.json()

    def get_student(self):
        res = requests.get(f"{ self.api_url }api/v1/student", params={
            "onyen": "bsmith"
        })
        return res.json()