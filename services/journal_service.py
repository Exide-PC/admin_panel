from dataclasses import dataclass
import subprocess
from typing import List

from env import Environment


@dataclass
class Loggable:
    id: str
    name: str

class Journal:
    def __init__(self, id: str, unit: str, name: str) -> None:
        self.id = id
        self.unit = unit
        self.name = name

@dataclass
class DockerContainer:
    id: str
    name: str
    display_name: str

@dataclass
class DockerCompose:
    id: str
    name: str
    compose_file: str
    env_file: str
    containers: list[DockerContainer]


class JournalService:
    __dockers = [
        DockerCompose(
            id='816c6de1-161b-4546-b4f8-e69d4d17dc7d',
            name='Bot Exide [Compose] | Staging',
            compose_file='/home/exide/repos/bot_exide_staging/compose.yaml',
            env_file='/home/exide/repos/bot_exide_staging/.env.docker.staging',
            containers=[
                DockerContainer('b573503f-7de9-4092-8eb1-1c0a41fb9138', 'bot-exide-staging_hub', 'BOT Exide [Hub] | Staging'),
                DockerContainer('98efe8fe-3c8f-4958-b47e-aefc83a841e5', 'bot-exide-staging_telegram-bot', 'BOT Exide [Telegram] | Staging'),
            ]
        ),
    ]

    __journals = [
        Journal('f8c0c569-c4c8-4b00-b07b-5ef186c1c132', 'bot_exide_hub', 'Bot Exide [Hub] | Prod'),
        Journal('d73c92b6-ff16-41a7-b4ee-222b06f3f30f', 'discord_bot', 'BOT Exide [Discord] | Prod'),
        Journal('3d36183a-e31d-42c4-8216-039ff1a7f3a3', 'telegram_bot', 'BOT Exide [Telegram] | Prod'),
        Journal('9f8e0927-3d48-4416-94ac-b87b1fa3aae2', 'vk_bot', 'BOT Exide [VK] | Prod'),
        Journal('29dadd8d-56b6-4544-b9f5-7c55b7abf6ca', 'admin_panel', 'Admin Panel API'),
        Journal('77d91bf1-8cdd-4856-9452-84addec36f14', 'minecraft-server', 'Minecraft Server'),
        Journal('1230d4e9-01da-45de-8b50-ac7227a2c3bf', 'configpro', 'ConfigMeta API'),
        Journal('bb90bc3b-0e11-4018-91c0-890b5ead5fbc', 'dollar_notifier', 'Dollar Notifier'),
        Journal('7bbf1c62-2023-483d-a2bc-482e89328457', 'rlt_server', 'RLT API'),
        Journal('f48c8f84-b4a2-4ae3-bc0c-7459e08eabca', 'bot_exide_hub_staging', 'Bot Exide [Hub] | Staging'),
        Journal('1bc6539e-7d82-436a-8778-89b7b7d70606', 'telegram_bot_staging', 'BOT Exide [Telegram] | Staging'),
    ]

    def __init__(self, env: Environment) -> None:
        self._env = env

    def list(self):
        result: list[Loggable] = []

        for compose in self.__dockers:
            result.append(Loggable(id=compose.id, name=compose.name))

            for c in compose.containers:
                result.append(Loggable(id=c.id, name=c.display_name))
        
        result += (Loggable(id=j.id, name=j.name) for j in self.__journals)

        return result

    def logs(self, id: str, count: int, output: str) -> List[str]:
        for compose in self.__dockers:
            if (compose.id == id):
                return self.__docker_compose_logs(compose, count)

            for container in compose.containers:
                if (container.id == id):
                    return self.__docker_container_logs(container, count)

        for journal in self.__journals:
            if (journal.id == id):
                return self.__journal_logs(journal, count, output)

        raise Exception(f'Unknown logger id: {id}')

    def __docker_compose_logs(self, compose: DockerCompose, count: int) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        result = subprocess.run(['docker', 'compose', '-f', compose.compose_file, '--env-file', compose.env_file, 'logs', '-n', str(count)], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs

    def __docker_container_logs(self, container: DockerContainer, count: int) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        result = subprocess.run(['docker', 'logs', container.name, '-t', '-n', str(count)], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs

    def __journal_logs(self, journal: Journal, count: int, output: str) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        result = subprocess.run(['journalctl', '-u', journal.unit, '-n', str(count), '-o', output], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs