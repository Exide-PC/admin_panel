from dependency_injector import containers, providers
from repository.appsettings_repository import AppSettingsRepository

from repository.db import init_db
from repository.nzxt_config_repository import NzxtConfigRepository
from services.appsettings_service import AppSettingsService
from services.maintenance_service import MaintenanceService
from services.nzxt_config_service import NzxtConfigService
from services.nzxt_service import NzxtLedService
from services.nzxt_worker import NzxtWorkerSynchronizer


class Container(containers.DeclarativeContainer):

    database_client = providers.Singleton(
        init_db,
        db_name='database.db',
        migrations_dir='repository/migrations'
    )

    appsettings_repo = providers.Factory(
        AppSettingsRepository,
        con=database_client
    )

    appsettings_service = providers.Factory(
        AppSettingsService,
        repo=appsettings_repo
    )

    nzxt_config_repo = providers.Factory(
        NzxtConfigRepository,
        con=database_client
    )

    nzxt_config_service = providers.Factory(
        NzxtConfigService,
        repo=nzxt_config_repo,
        appsettings_service=appsettings_service
    )

    maintenance_service = providers.Singleton(
        MaintenanceService
    )

    nzxt_led_service = providers.Factory(
        NzxtLedService
    )

    nzxt_worker_synchronizer = providers.Singleton(
        NzxtWorkerSynchronizer,
        config=nzxt_config_service().get_current()
    )