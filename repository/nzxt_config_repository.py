from datetime import datetime
from sqlite3 import Connection

class NzxtConfig:
    def __init__(self, id: str, name: str, color_args: str, night_hours_start: int, night_hours_end: int, fan_speed: int) -> None:
        self.id = id
        self.name = name
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

        return list(map(lambda r: NzxtConfig(r['id'], r['name'], r['color_args'], r['night_hours_start'], r['night_hours_end'], r['fan_speed']), records))

    def create(self, settings: NzxtConfig):
        record = (settings.id, settings.name, settings.color_args, settings.night_hours_start, settings.night_hours_end, settings.fan_speed)

        self._con.cursor().execute('INSERT INTO nzxt_config (id, name, color_args, night_hours_start, night_hours_end, fan_speed) VALUES (?, ?, ?, ?, ?, ?)', record)
        self._con.commit()

    def update(self, settings: NzxtConfig):
        record = (settings.name, settings.color_args, settings.night_hours_start, settings.night_hours_end, settings.fan_speed, settings.id)

        self._con.cursor().execute('UPDATE nzxt_config SET name = ?, color_args = ?, night_hours_start = ?, night_hours_end = ?, fan_speed = ? WHERE id = ?', record)
        self._con.commit()

    def delete(self, id: str):
        self._con.cursor().execute('DELETE FROM nzxt_config WHERE id = ?', (id,))
        self._con.commit()