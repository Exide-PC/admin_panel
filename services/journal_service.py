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
        Journal('f8c0c569-c4c8-4b00-b07b-5ef186c1c132', 'bot_exide_hub', 'Bot Exide [Hub]'),
        Journal('d73c92b6-ff16-41a7-b4ee-222b06f3f30f', 'discord_bot', 'BOT Exide [Discord]'),
        Journal('3d36183a-e31d-42c4-8216-039ff1a7f3a3', 'telegram_bot', 'BOT Exide [Telegram]'),
        Journal('9f8e0927-3d48-4416-94ac-b87b1fa3aae2', 'vk_bot', 'BOT Exide [VK]'),
        Journal('6617542c-c320-4bbd-8c2f-08579ea663a5', 'bot_exide_chatgpt', 'BOT Exide [ChatGPT]'),
        Journal('29dadd8d-56b6-4544-b9f5-7c55b7abf6ca', 'admin_panel', 'Admin Panel API'),
        Journal('77d91bf1-8cdd-4856-9452-84addec36f14', 'minecraft-server', 'Minecraft Server'),
        Journal('1230d4e9-01da-45de-8b50-ac7227a2c3bf', 'configpro', 'ConfigMeta API'),
        Journal('bb90bc3b-0e11-4018-91c0-890b5ead5fbc', 'dollar_notifier', 'Dollar Notifier'),
        Journal('7bbf1c62-2023-483d-a2bc-482e89328457', 'rlt_server', 'RLT API'),
    ]

    def __init__(self, env: Environment) -> None:
        self._env = env

    def list(self):
        return self.__journals

    def logs(self, id: str, count: int, output: str) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        known_journal = next(j for j in self.__journals if j.id == id)

        if (not known_journal):
            raise Exception(f'Unknown journal: {id}')

        result = subprocess.run(['journalctl', '-u', known_journal.unit, '-n', str(count), '-o', output], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs