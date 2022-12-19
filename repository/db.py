import os
import sqlite3
from typing import List

def __migrate_db(con: sqlite3.Connection, migrations_dir: str):
    cur = con.cursor()

    schema_version: int = cur.execute('PRAGMA user_version').fetchone()[0]

    files = os.listdir(migrations_dir)

    migrations = list(map(lambda f: (int(f.split('_')[0]), os.path.join(migrations_dir, f)), files))
    pending_mirations: List[tuple[int,str]] = list(filter(lambda m: m[0] > schema_version, migrations))
    ordered_migrations = sorted(pending_mirations, key = lambda m: m[0])

    for i in range(len(ordered_migrations)):
        migration_number, migration_path = ordered_migrations[i]

        if (schema_version + 1 != migration_number):
            raise Exception(f'Expected migration number: {schema_version + 1}, but got: {migration_number}')

        with open(migration_path, 'r') as f:
            lines = f.readlines()
            sql = '\n'.join(lines)
            cur.executescript(sql)

        schema_version = migration_number
        cur.execute(f'PRAGMA user_version = {migration_number}')
        con.commit()

def init_db(db_name: str, migrations_dir: str):
    con = sqlite3.connect(db_name, check_same_thread=False)

    con.row_factory = sqlite3.Row
    con.execute('PRAGMA foreign_keys = ON;')

    __migrate_db(con, migrations_dir)
    return con