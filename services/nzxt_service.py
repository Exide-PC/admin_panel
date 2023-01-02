import os


class NzxtLedService:
    prev_color = ''
    
    def set_led(self, color_args: str):
        if (self.prev_color == color_args):
            return

        # TODO validation
        self.prev_color = color_args

        os.system(f"sudo liquidctl set led1 color {color_args}")