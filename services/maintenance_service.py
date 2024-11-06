import os


class MaintenanceCommand:
    def __init__(self, id: str, name: str, group: str, command: str) -> None:
        self.id = id
        self.name = name
        self.group = group
        self.command = command

class MaintenanceService:
    __commands = [
        MaintenanceCommand('b5dc0b6a-3478-44ac-abf1-6c3377832b24', 'Git Pull', 'Admin panel', 'git pull'),
        MaintenanceCommand('b3f7b4ce-887a-4cae-a500-961292ff0a75', 'Restart API', 'Admin panel', 'sudo service admin_panel restart'),
        MaintenanceCommand('5f9c7048-52bd-4c94-b189-b0240642a6b3', 'Re-deploy web', 'Admin panel', 'npm run build --prefix ~/repos/admin_panel/client-app && cp -r ~/repos/admin_panel/client-app/build/* /usr/share/nginx/www/admin.exideprod.com'),
        
        MaintenanceCommand('04f43395-33da-443f-a9e5-ce7e1afce94c', 'Git Pull', 'Bot Exide [Prod]', 'git -C ~/repos/bot_exide_bare/production pull'),
        MaintenanceCommand('8a23210f-0f25-4d5b-b6b1-daeffbbf8e49', 'Compose build', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod up --build -d'),
        MaintenanceCommand('731ecd2a-c23b-4874-aacf-468b7b345ac2', 'Compose stop', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod stop'),
        MaintenanceCommand('91d16268-7649-450e-bc8b-0ed8a0a63b86', 'Compose restart', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod restart'),
        MaintenanceCommand('dc45bbd3-1676-48da-9777-448232de7d41', 'Compose down', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod down'),
        MaintenanceCommand('81f3e03e-6b6e-4e9c-b5ef-c858f8991e38', 'Restart bot manager', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod restart telegram_bot_manager'),
        MaintenanceCommand('0b1b5fe0-7f06-4327-864c-9025c8f36570', 'Restart proxy', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide_bare/production/compose.yaml --env-file /home/exide/repos/bot_exide_bare/production/.env.docker.prod restart nginx'),

        MaintenanceCommand('a5e852ae-a1fd-450f-b15f-6c59226dffc7', 'Git Pull', 'Bot Exide [Staging]', 'git -C ~/repos/bot_exide_bare/staging pull'),
        MaintenanceCommand('c5241166-f30d-41da-b782-0ac75837a3b1', 'Compose build', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging up --build -d'),
        MaintenanceCommand('86854788-06ea-47cf-b20f-0fde185b689d', 'Compose stop', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging stop'),
        MaintenanceCommand('aaf776e2-127d-4c95-9fce-5978572a4ac6', 'Compose restart', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging restart'),
        MaintenanceCommand('83012220-828d-47f0-92b5-5a5914235323', 'Compose down', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging down'),
        MaintenanceCommand('d927a3ae-dd5e-4079-9a3f-405a7b28131e', 'Restart bot manager', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging restart telegram_bot_manager'),
        MaintenanceCommand('14ff2a66-388f-411f-81af-09e6f457f2e4', 'Restart proxy', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_bare/staging/compose.yaml --env-file /home/exide/repos/bot_exide_bare/staging/.env.docker.staging restart nginx'),
    ]
    
    def __init__(self) -> None:
        pass

    def get_commands(self) -> list[MaintenanceCommand]:
        return self.__commands
    
    def execute(self, id: str):
        command = next(c for c in self.__commands if c.id == id)
        os.system(command.command)