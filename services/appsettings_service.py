from repository.appsettings_repository import AppSettings, AppSettingsRepository


class AppSettingsService:
    def __init__(self, repo: AppSettingsRepository) -> None:
        self._repo = repo
    
    def get(self) -> AppSettings:
        return self._repo.get()

    def update(self, settings: AppSettings):
        return self._repo.update(settings)