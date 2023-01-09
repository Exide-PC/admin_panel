import os
import re

# https://github.com/liquidctl/liquidctl/blob/main/docs/nzxt-hue2-guide.md

class NzxtController:
    prev_color = ''
    prev_speed = -1

    def set_led(self, color_args: str):
        if (self.prev_color == color_args):
            return

        if (not re.match(r'^[a-z0-9\- ]+$', color_args)):
            raise Exception(f'Invalid color args: {color_args}')

        self.prev_color = color_args

        os.system(f"sudo liquidctl set led1 color {color_args}")

    def set_fan_speed(self, speed: int):
        if (self.prev_speed == speed):
            return

        if (speed < 20 or speed > 100):
            raise Exception(f'Invalid fan speed: {speed}')

        self.prev_speed = speed

        os.system(f"sudo liquidctl set sync speed {speed}")