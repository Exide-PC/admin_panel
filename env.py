import os
from typing import Optional

from dotenv import load_dotenv # type: ignore

class Environment:
    def __init__(self):
        self.is_windows = os.name == 'nt'
        self.token = os.getenv('TOKEN')
        self.listener = os.getenv('LISTENER')
        self.notification_url: Optional[str] = os.getenv('NOTIFICATION_URL')
        self.note_key: str = os.getenv('NOTE_KEY') or ''
        self.note_password_hash: str = os.getenv('NOTE_PASSWORD_HASH') or ''

        if (not self.note_key):
            raise Exception('Note key is required')
        if (not self.note_password_hash):
            raise Exception('Note password hash is required')

load_dotenv()
env = Environment()