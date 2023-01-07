from datetime import datetime
from sqlite3 import Connection

class NzxtConfig:
    def __init__(self, id: str, color_args: str, night_hours_start: int, night_hours_end: int, fan_speed: int) -> None:
        self.id = id
        self.color_args = color_args
        self.night_hours_start = night_hours_start
        self.night_hours_end = night_hours_end
        self.fan_speed = fan_speed
    
    def is_night_hours(self):
        now = datetime.now()
        return now.hour >= self.night_hours_start and now.hour < self.night_hours_end

class NzxtConfigRepository:
    def __init__(self, con: Connection) -> None:
        self._con = con

    def list(self) -> list[NzxtConfig]:
        records = self._con.cursor().execute('SELECT * FROM nzxt_config').fetchall()

        return list(map(lambda r: NzxtConfig(r['id'], r['color_args'], r['night_hours_start'], r['night_hours_end'], r['fan_speed']), records))

    def update(self, settings: NzxtConfig):
        record = (settings.color_args, settings.night_hours_start, settings.night_hours_end, settings.fan_speed, settings.id)

        self._con.cursor().execute('UPDATE nzxt_config SET color_args = ?, night_hours_start = ?, night_hours_end = ?, fan_speed = ? WHERE id = ?', record)
        self._con.commit()