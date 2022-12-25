from sqlite3 import Connection

class AppSettings:
    def __init__(self, nzxt_color: str, nzxt_night_hours_start: int, nzxt_night_hours_end: int) -> None:
        self.nzxt_color = nzxt_color
        self.nzxt_night_hours_start = nzxt_night_hours_start
        self.nzxt_night_hours_end = nzxt_night_hours_end

class AppSettingsRepository:
    def __init__(self, con: Connection) -> None:
        self._con = con

    def get(self) -> AppSettings:
        record = self._con.cursor().execute('SELECT * FROM app_settings').fetchone()

        return AppSettings(
            record['nzxt_color'],
            record['nzxt_night_hours_start'],
            record['nzxt_night_hours_end']
        )
    
    def update(self, settings: AppSettings):
        record = (settings.nzxt_color, settings.nzxt_night_hours_start, settings.nzxt_night_hours_end)

        self._con.cursor().execute('UPDATE app_settings SET nzxt_color = ?, nzxt_night_hours_start =? , nzxt_night_hours_end = ?', record)
        self._con.commit()