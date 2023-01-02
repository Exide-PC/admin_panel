import time
from datetime import datetime

from repository.nzxt_config_repository import NzxtConfig
from services.nzxt_service import NzxtLedService


class NzxtWorkerSynchronizer:
    def __init__(self, config: NzxtConfig) -> None:
        self.config = config
        self.active_color = ''

def run_nzxt_worker(synchronizer: NzxtWorkerSynchronizer, led_service: NzxtLedService):

    def set_led(next_color: str):
        if (next_color == synchronizer.active_color):
            return

        led_service.set_led(next_color)
        synchronizer.active_color = next_color

    while (True):
        current_config = synchronizer.config
        now = datetime.now()

        if (now.hour >= current_config.night_hours_start and now.hour < current_config.night_hours_end):
            set_led('off')
        else:
            set_led(current_config.color_args)

        time.sleep(60)