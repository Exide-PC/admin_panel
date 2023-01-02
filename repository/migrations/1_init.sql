CREATE TABLE nzxt_config (
    id TEXT PRIMARY KEY,
    color_args TEXT NOT NULL,
    night_hours_start INTEGER NOT NULL,
    night_hours_end INTEGER NOT NULL
);

INSERT INTO nzxt_config (id, color_args, night_hours_start, night_hours_end) VALUES (
    'de6eee1f-6e57-40ae-8277-60303a42cd83',
    'super-rainbow --speed slowest --direction forward',
    0,
    0
);

CREATE TABLE app_settings (
    nzxt_config_id TEXT NOT NULL,
    FOREIGN KEY (nzxt_config_id) REFERENCES nzxt_config(id)
);

INSERT INTO app_settings (nzxt_config_id) VALUES ('de6eee1f-6e57-40ae-8277-60303a42cd83');