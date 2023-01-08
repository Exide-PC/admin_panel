import os
from typing import Optional

from dotenv import load_dotenv # type: ignore

class Environment:
    def __init__(self):
        self.token = os.getenv('TOKEN')
        self.listener = os.getenv('LISTENER')
        self.notification_url: Optional[str] = os.getenv('NOTIFICATION_URL')

load_dotenv()
env = Environment()