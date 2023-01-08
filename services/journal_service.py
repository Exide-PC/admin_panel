import subprocess
from typing import List

from env import Environment


class Journal:
    def __init__(self, id: str, unit: str, name: str) -> None:
        self.id = id
        self.unit = unit
        self.name = name

class JournalService:
    __journals = [
        Journal('d73c92b6-ff16-41a7-b4ee-222b06f3f30f', 'discord_bot', 'BOT Exide [Discord]'),
        Journal('3d36183a-e31d-42c4-8216-039ff1a7f3a3', 'telegram_bot', 'BOT Exide [Telegram]'),
    ]

    def __init__(self, env: Environment) -> None:
        self._env = env

    def list(self):
        return self.__journals

    def logs(self, id: str) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        known_journal = next(j for j in self.__journals if j.id == id)

        if (not known_journal):
            raise Exception(f'Unknown journal: {id}')

        result = subprocess.run(['journalctl', '-u', known_journal.unit, '-n', '50'], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs