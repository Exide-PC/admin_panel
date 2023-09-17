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
        MaintenanceCommand('04f43395-33da-443f-a9e5-ce7e1afce94c', 'Git Pull', 'Bot Exide', 'git -C ~/repos/bot_exide pull'),
        MaintenanceCommand('036e8933-c4e4-4c1d-8d8e-1a085323bdbc', 'Restart hub', 'Bot Exide', 'sudo service bot_exide_hub restart'),
        MaintenanceCommand('3b1b5f29-0c1a-4693-a3c8-7dab911979f0', 'Re-deploy web', 'Bot Exide', 'npm run build --prefix ~/repos/bot_exide/hub/client-app && cp -r ~/repos/bot_exide/hub/client-app/build/* /usr/share/nginx/www/bot.exideprod.com/admin_panel'),
        MaintenanceCommand('80df3b9b-b099-4eb3-bd41-ddb63751319e', 'Restart Discord Bot', 'Bot Exide', 'sudo service discord_bot restart'),
        MaintenanceCommand('de20b147-ff58-4fa6-84bb-c34326cff776', 'Restart Telegram Bot', 'Bot Exide', 'sudo service telegram_bot restart'),
        MaintenanceCommand('b84322e9-b3eb-4446-86cf-352cb49300b0', 'Restart VK Bot', 'Bot Exide', 'sudo service vk_bot restart'),
        MaintenanceCommand('3748f6cb-328a-4c61-a21f-967b73db72a3', 'Re-deploy Mini App', 'Bot Exide', 'npm run build --prefix ~/repos/bot_exide/telegram_bot/web-app && cp -r ~/repos/bot_exide/telegram_bot/web-app/build/* /usr/share/nginx/www/bot.exideprod.com/mini-app-prod'),
    ]
    
    def __init__(self) -> None:
        pass

    def get_commands(self) -> list[MaintenanceCommand]:
        return self.__commands
    
    def execute(self, id: str):
        command = next(c for c in self.__commands if c.id == id)
        os.system(command.command)