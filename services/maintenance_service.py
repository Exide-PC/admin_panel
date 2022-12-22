import os


class MaintenanceCommand:
    def __init__(self, name: str, group: str, command: str) -> None:
        self.name = name
        self.group = group
        self.command = command

class MaintenanceService:
    __commands = [
        MaintenanceCommand('Git Pull', 'Admin panel', 'git pull'),
        MaintenanceCommand('Restart API', 'Admin panel', 'sudo service admin_panel restart'),
        MaintenanceCommand('Re-deploy web', 'Admin panel', 'npm run build --prefix ~/repos/admin_panel/client-app && cp -r ~/repos/admin_panel/client-app/build/* /usr/share/nginx/www/admin.exideprod.com'),
        MaintenanceCommand('Restart hub', 'Bot Exide', 'sudo service bot_exide_hub restart'),
        MaintenanceCommand('Re-deploy web', 'Bot Exide', 'npm run build --prefix ~/repos/bot_exide/hub/client-app && cp -r ~/repos/bot_exide/hub/client-app/build/* /usr/share/nginx/www/bot.exideprod.com'),
        MaintenanceCommand('Restart Discord Bot', 'Bot Exide', 'sudo service discord_bot restart'),
        MaintenanceCommand('Restart Telegram Bot', 'Bot Exide', 'sudo service telegram_bot restart'),
        MaintenanceCommand('Restart VK Bot', 'Bot Exide', 'sudo service vk_bot restart'),
        MaintenanceCommand('Restart currency notifier', 'Bot Exide', 'sudo service dollar_notifier restart'),
    ]
    
    def __init__(self) -> None:
        pass

    def get_commands(self) -> list[MaintenanceCommand]:
        return self.__commands
    
    def execute(self, index: int):
        os.system(self.__commands[index].command)