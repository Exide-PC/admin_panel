CREATE TABLE nzxt_config (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color_args TEXT NOT NULL,
    night_hours_start INTEGER NOT NULL,
    night_hours_end INTEGER NOT NULL,
    fan_speed INTEGER NOT NULL
);

INSERT INTO nzxt_config (id, name, color_args, night_hours_start, night_hours_end, fan_speed) VALUES (
    'de6eee1f-6e57-40ae-8277-60303a42cd83',
    'Default',
    'super-rainbow --speed slowest --direction forward',
    0,
    0,
    50
);

CREATE TABLE app_settings (
    nzxt_config_id TEXT NOT NULL,
    FOREIGN KEY (nzxt_config_id) REFERENCES nzxt_config(id)
);

INSERT INTO app_settings (nzxt_config_id) VALUES ('de6eee1f-6e57-40ae-8277-60303a42cd83');