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
        
        MaintenanceCommand('04f43395-33da-443f-a9e5-ce7e1afce94c', 'Git Pull', 'Bot Exide [Prod]', 'git -C ~/repos/bot_exide pull'),
        MaintenanceCommand('8a23210f-0f25-4d5b-b6b1-daeffbbf8e49', 'Compose build', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide/compose.yaml --env-file /home/exide/repos/bot_exide/.env.docker.prod up --build -d'),
        MaintenanceCommand('731ecd2a-c23b-4874-aacf-468b7b345ac2', 'Compose stop', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide/compose.yaml --env-file /home/exide/repos/bot_exide/.env.docker.prod stop'),
        MaintenanceCommand('91d16268-7649-450e-bc8b-0ed8a0a63b86', 'Compose restart', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide/compose.yaml --env-file /home/exide/repos/bot_exide/.env.docker.prod restart'),
        MaintenanceCommand('dc45bbd3-1676-48da-9777-448232de7d41', 'Compose down', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide/compose.yaml --env-file /home/exide/repos/bot_exide/.env.docker.prod down'),
        MaintenanceCommand('81f3e03e-6b6e-4e9c-b5ef-c858f8991e38', 'Restart bot manager', 'Bot Exide [Prod]', 'docker compose -f /home/exide/repos/bot_exide/compose.yaml --env-file /home/exide/repos/bot_exide/.env.docker.prod restart telegram_bot_manager'),
        # MaintenanceCommand('036e8933-c4e4-4c1d-8d8e-1a085323bdbc', 'Restart hub', 'Bot Exide [Prod]', 'sudo service bot_exide_hub restart'),
        # MaintenanceCommand('3b1b5f29-0c1a-4693-a3c8-7dab911979f0', 'Re-deploy web', 'Bot Exide [Prod]', 'npm run build --prefix ~/repos/bot_exide/hub/client-app && cp -r ~/repos/bot_exide/hub/client-app/build/* /usr/share/nginx/www/bot.exideprod.com/admin_panel'),
        # MaintenanceCommand('80df3b9b-b099-4eb3-bd41-ddb63751319e', 'Restart Discord Bot', 'Bot Exide [Prod]', 'sudo service discord_bot restart'),
        # MaintenanceCommand('de20b147-ff58-4fa6-84bb-c34326cff776', 'Restart Telegram Bot', 'Bot Exide [Prod]', 'sudo service telegram_bot restart'),
        # MaintenanceCommand('b84322e9-b3eb-4446-86cf-352cb49300b0', 'Restart VK Bot', 'Bot Exide [Prod]', 'sudo service vk_bot restart'),
        # MaintenanceCommand('3748f6cb-328a-4c61-a21f-967b73db72a3', 'Re-deploy Mini App', 'Bot Exide [Prod]', 'npm run build --prefix ~/repos/bot_exide/telegram_bot/web-app && cp -r ~/repos/bot_exide/telegram_bot/web-app/build/* /usr/share/nginx/www/bot.exideprod.com/mini-app-prod'),

        MaintenanceCommand('a5e852ae-a1fd-450f-b15f-6c59226dffc7', 'Git Pull', 'Bot Exide [Staging]', 'git -C ~/repos/bot_exide_staging pull'),
        MaintenanceCommand('c5241166-f30d-41da-b782-0ac75837a3b1', 'Compose build', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_staging/compose.yaml --env-file /home/exide/repos/bot_exide_staging/.env.docker.staging up --build -d'),
        MaintenanceCommand('86854788-06ea-47cf-b20f-0fde185b689d', 'Compose stop', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_staging/compose.yaml --env-file /home/exide/repos/bot_exide_staging/.env.docker.staging stop'),
        MaintenanceCommand('aaf776e2-127d-4c95-9fce-5978572a4ac6', 'Compose restart', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_staging/compose.yaml --env-file /home/exide/repos/bot_exide_staging/.env.docker.staging restart'),
        MaintenanceCommand('83012220-828d-47f0-92b5-5a5914235323', 'Compose down', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_staging/compose.yaml --env-file /home/exide/repos/bot_exide_staging/.env.docker.staging down'),
        MaintenanceCommand('d927a3ae-dd5e-4079-9a3f-405a7b28131e', 'Restart bot manager', 'Bot Exide [Staging]', 'docker compose -f /home/exide/repos/bot_exide_staging/compose.yaml --env-file /home/exide/repos/bot_exide_staging/.env.docker.staging restart telegram_bot_manager'),
    ]
    
    def __init__(self) -> None:
        pass

    def get_commands(self) -> list[MaintenanceCommand]:
        return self.__commands
    
    def execute(self, id: str):
        command = next(c for c in self.__commands if c.id == id)
        os.system(command.command)