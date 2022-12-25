import os


class NzxtService:
    def __init__(self) -> None:
        pass
    
    def set_color(self, args: str):
        # TODO validation
        os.system(f"sudo liquidctl set led1 color {args}")