import os
import time
from datetime import datetime

from services.nzxt_service import NzxtConfig


class NzxtWorkerSynchronizer:
    def __init__(self, config: NzxtConfig) -> None:
        self.config = config

def run_nzxt_worker(synchronizer: NzxtWorkerSynchronizer):

    prev_color: str = ''

    def set_led(color: str):
        nonlocal prev_color

        if (color == prev_color):
            return

        os.system(f"sudo liquidctl set led1 color {color}")
        prev_color = color

    while (True):
        current_config = synchronizer.config
        now = datetime.now()

        if (now.hour >= current_config.night_hours_start and now.hour < current_config.night_hours_end):
            set_led('off')
        else:
            set_led(current_config.color)

        time.sleep(60)