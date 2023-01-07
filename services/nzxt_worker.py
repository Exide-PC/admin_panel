import time

from repository.nzxt_config_repository import NzxtConfig
from services.nzxt_service import NzxtLedService


class NzxtWorkerSynchronizer:
    def __init__(self, config: NzxtConfig) -> None:
        self.config = config

class NzxtWorker:
    def __init__(self, led_service: NzxtLedService, initial_config: NzxtConfig) -> None:
        self._led_service = led_service
        self._config = initial_config
    
    def iteration(self, config: NzxtConfig):
        if (config.is_night_hours()):
            self._led_service.set_led('off')
        else:
            self._led_service.set_led(config.color_args)

    def loop(self):
        while (True):
            self.iteration(self._config)
            time.sleep(60)