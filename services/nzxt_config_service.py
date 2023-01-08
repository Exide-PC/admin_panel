from repository.nzxt_config_repository import NzxtConfig, NzxtConfigRepository
from services.appsettings_service import AppSettingsService


class NzxtConfigService:
    def __init__(self, repo: NzxtConfigRepository, appsettings_service: AppSettingsService) -> None:
        self._repo = repo
        self._appsettings_service = appsettings_service

    def list(self):
        return self._repo.list()

    def create(self, config: NzxtConfig):
        return self._repo.create(config)

    def update(self, config: NzxtConfig):
        return self._repo.update(config)

    def delete(self, id: str):
        return self._repo.delete(id)

    def get_current(self) -> NzxtConfig:
        appsettings = self._appsettings_service.get()
        configs = self.list()

        return next(c for c in configs if c.id == appsettings.nzxt_config_id)
