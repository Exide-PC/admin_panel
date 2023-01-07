import time

from repository.nzxt_config_repository import NzxtConfig
from services.notification_service import NotificationService
from services.nzxt_service import NzxtLedService
from services.nzxt_status_service import NzxtStatusService


class NzxtWorkerSynchronizer:
    def __init__(self, config: NzxtConfig) -> None:
        self.config = config

class NzxtWorker:
    def __init__(self, initial_config: NzxtConfig, led_service: NzxtLedService, status_service: NzxtStatusService, notification_service: NotificationService) -> None:
        self._config = initial_config
        self._led_service = led_service
        self._status_service = status_service
        self._notification_service = notification_service
    
    def iteration(self, config: NzxtConfig):
        if (config.is_night_hours()):
            self._led_service.set_led('off')
        else:
            self._led_service.set_led(config.color_args)

    def loop(self):
        while (True):
            self.iteration(self._config)

            status = self._status_service.get_status()
            self._notification_service.send(f'CPU temperature: ${status.cpu_temperature}°C')
            
            time.sleep(60)