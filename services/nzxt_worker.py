import logging
import time
from typing import Optional

from repository.nzxt_config_repository import NzxtConfig
from services.notification_service import NotificationService
from services.nzxt_controller import NzxtController
from services.nzxt_status_service import NzxtStatusService


class NzxtWorkerSynchronizer:
    def __init__(self, config: NzxtConfig) -> None:
        self.config = config

class NzxtWorker:
    def __init__(self, initial_config: NzxtConfig, controller: NzxtController, status_service: NzxtStatusService, notification_service: NotificationService) -> None:
        self._config = initial_config
        self._controller = controller
        self._status_service = status_service
        self._notification_service = notification_service
    
    def iteration(self, config: Optional[NzxtConfig] = None):
        self._config = config or self._config

        try:
            self._controller.set_fan_speed(self._config.fan_speed)

            if (self._config.is_night_hours()):
                self._controller.set_led('off')
            else:
                self._controller.set_led(self._config.color_args)
            
            status = self._status_service.get_status()

            if (status.cpu_temperature > 60):
                self._notification_service.send(f'CPU temperature: <b>{status.cpu_temperature}°C</b>')

        except Exception as e:
            logging.error(f'Unknown error in worker: {e}')

            self._controller.set_led("pulse 6b0000 --speed fastest")
            self._controller.set_fan_speed(50)

    def loop(self):
        while (True):
            self.iteration()
            time.sleep(60)