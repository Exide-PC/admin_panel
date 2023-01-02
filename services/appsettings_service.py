from repository.appsettings_repository import AppSettings, AppSettingsRepository


class AppSettingsService:
    def __init__(self, repo: AppSettingsRepository) -> None:
        self._repo = repo
    
    def get(self) -> AppSettings:
        return self._repo.get()
    
    def update_nzxt_config_id(self, id: str):
        settings = self._repo.get()
        settings.nzxt_config_id = id
        self._repo.update(settings)