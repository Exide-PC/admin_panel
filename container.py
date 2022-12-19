from dependency_injector import containers, providers

from repository.db import init_db


class Container(containers.DeclarativeContainer):

    database_client = providers.Singleton(
        init_db,
        db_name='database.db',
        migrations_dir='repository/migrations'
    )

    # user_repo = providers.Factory(
    #     UserRepository,
    #     con=database_client
    # )

    # user_service = providers.Factory(
    #     UserService,
    #     user_repo=user_repo
    # )