from sqlite3 import Connection

class AppSettings:
    def __init__(self, nzxt_config_id: str) -> None:
        self.nzxt_config_id = nzxt_config_id

class AppSettingsRepository:
    def __init__(self, con: Connection) -> None:
        self._con = con

    def get(self) -> AppSettings:
        record = self._con.cursor().execute('SELECT * FROM app_settings').fetchone()

        return AppSettings(record['nzxt_config_id'])
    
    def update(self, settings: AppSettings):
        self._con.cursor().execute('UPDATE app_settings SET nzxt_config_id = ?', (settings.nzxt_config_id,))
        self._con.commit()