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
class DockerComposeService:
    id: str
    name: str
    display_name: str

@dataclass
class DockerCompose:
    id: str
    name: str
    compose_file: str
    env_file: str
    containers: list[DockerComposeService]


class JournalService:
    __dockers = [
        DockerCompose(
            id='13ceb764-46cc-435e-a4f9-5bc830f0958e',
            name='[Prod] BOT Exide | Compose',
            compose_file='/home/exide/repos/bot_exide/compose.yaml',
            env_file='/home/exide/repos/bot_exide/.env.docker.prod',
            containers=[
                DockerComposeService('fbdd5548-f22b-457b-9216-f41a480e7745', 'hub', '[Prod] BOT Exide | Hub'),
                DockerComposeService('58de9573-1a85-4dbb-b530-89d2eac0101c', 'telegram_bot_manager', '[Prod] BOT Exide | Telegram'),
                DockerComposeService('0c6c74b5-451f-4cbb-b914-1a1257f77c02', 'discord_bot', '[Prod] BOT Exide | Discord'),
                DockerComposeService('706103b0-6d2a-440f-80e9-391f785f10ac', 'vk_bot', '[Prod] BOT Exide | VK'),
            ],
        ),
        DockerCompose(
            id='816c6de1-161b-4546-b4f8-e69d4d17dc7d',
            name='[Staging] BOT Exide | Compose',
            compose_file='/home/exide/repos/bot_exide_bare/staging/compose.yaml',
            env_file='/home/exide/repos/bot_exide_bare/staging/.env.docker.staging',
            containers=[
                DockerComposeService('b573503f-7de9-4092-8eb1-1c0a41fb9138', 'hub', '[Staging] BOT Exide | Hub'),
                DockerComposeService('98efe8fe-3c8f-4958-b47e-aefc83a841e5', 'telegram_bot_manager', '[Staging] BOT Exide | Telegram'),
            ],
        ),
    ]

    __journals = [
        # Journal('f8c0c569-c4c8-4b00-b07b-5ef186c1c132', 'bot_exide_hub', 'BOT Exide [Hub] | Prod'),
        # Journal('d73c92b6-ff16-41a7-b4ee-222b06f3f30f', 'discord_bot', 'BOT Exide [Discord] | Prod'),
        # Journal('3d36183a-e31d-42c4-8216-039ff1a7f3a3', 'telegram_bot', 'BOT Exide [Telegram] | Prod'),
        # Journal('9f8e0927-3d48-4416-94ac-b87b1fa3aae2', 'vk_bot', 'BOT Exide [VK] | Prod'),
        Journal('29dadd8d-56b6-4544-b9f5-7c55b7abf6ca', 'admin_panel', 'Admin Panel API'),
        Journal('77d91bf1-8cdd-4856-9452-84addec36f14', 'minecraft-server', 'Minecraft Server'),
        Journal('1230d4e9-01da-45de-8b50-ac7227a2c3bf', 'configpro', 'ConfigMeta API'),
        # Journal('bb90bc3b-0e11-4018-91c0-890b5ead5fbc', 'dollar_notifier', 'Dollar Notifier'),
        # Journal('7bbf1c62-2023-483d-a2bc-482e89328457', 'rlt_server', 'RLT API'),
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
                    return self.__docker_container_logs(compose, container, count)

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

    def __docker_container_logs(self, compose: DockerCompose, service: DockerComposeService, count: int) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        result = subprocess.run(['docker', 'compose', '-f', compose.compose_file, '--env-file', compose.env_file, 'logs', service.name, '--no-log-prefix', '-t', '-n', str(count)], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs

    def __journal_logs(self, journal: Journal, count: int, output: str) -> List[str]:
        if (self._env.is_windows):
            return ['Windows', 'dev', 'stub']

        result = subprocess.run(['journalctl', '-u', journal.unit, '-n', str(count), '-o', output], stdout=subprocess.PIPE)
        logs = result.stdout.decode('utf-8').split('\n')

        return logs