import os


class MaintenanceCommand:
    def __init__(self, name: str, command: str) -> None:
        self.name = name
        self.command = command

class MaintenanceService:
    __commands = [
        MaintenanceCommand('Git Pull', 'git pull'),
        MaintenanceCommand('Restart hub', 'sudo service bot_exide_hub restart'),
        MaintenanceCommand('Re-deploy hub web', 'npm run build --prefix client-app && cp -r client-app/build/* /usr/share/nginx/www/bot.exideprod.com'),
        MaintenanceCommand('Restart Discord Bot', 'sudo service discord_bot restart'),
        MaintenanceCommand('Restart Telegram Bot', 'sudo service telegram_bot restart'),
        MaintenanceCommand('Restart VK Bot', 'sudo service vk_bot restart'),
        MaintenanceCommand('Restart currency notifier', 'sudo service dollar_notifier restart'),
    ]
    
    def __init__(self) -> None:
        pass

    def get_commands(self) -> list[MaintenanceCommand]:
        return self.__commands
    
    def execute(self, index: int):
        os.system(self.__commands[index].command)