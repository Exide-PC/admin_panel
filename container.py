from dependency_injector import containers, providers
from repository.appsettings_repository import AppSettingsRepository

from repository.db import init_db
from services.appsettings_service import AppSettingsService
from services.maintenance_service import MaintenanceService
from services.nzxt_service import NzxtService


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

    maintenance_service = providers.Singleton(
        MaintenanceService
    )

    nzxt_service = providers.Factory(
        NzxtService,
        appsettings_service = appsettings_service
    )