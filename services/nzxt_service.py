import os

from services.appsettings_service import AppSettingsService


class NzxtConfig:
    def __init__(self, color: str, night_hours_start: int, night_hours_end: int) -> None:
        self.color = color
        self.night_hours_start = night_hours_start
        self.night_hours_end = night_hours_end

class NzxtService:
    def __init__(self, appsettings_service: AppSettingsService) -> None:
        self._appsettings_service = appsettings_service

    def save_config(self, config: NzxtConfig):
        settings = self._appsettings_service.get()

        settings.nzxt_color = config.color
        settings.nzxt_night_hours_start = config.night_hours_start
        settings.nzxt_night_hours_end = config.night_hours_end

        self._appsettings_service.update(settings)
    
    def set_color(self, args: str):
        # TODO validation
        os.system(f"sudo liquidctl set led1 color {args}")