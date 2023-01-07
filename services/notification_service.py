import json
import requests

from env import Environment


class NotificationService:
    def __init__(self, env: Environment) -> None:
        self._env = env

    def send(self, message: str):
        if (not self._env.notification_url):
            return
        
        requests.post(url=self._env.notification_url, data=json.dumps(message), headers={
            'Content-Type': 'application/json'
        })