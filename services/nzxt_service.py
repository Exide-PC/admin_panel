import os


class NzxtLedService:
    def set_led(self, color_args: str):
        # TODO validation
        os.system(f"sudo liquidctl set led1 color {color_args}")