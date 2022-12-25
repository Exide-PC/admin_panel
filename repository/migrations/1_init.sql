CREATE TABLE app_settings (
    nzxt_color TEXT NOT NULL,
    nzxt_night_hours_start INTEGER NOT NULL,
    nzxt_night_hours_end INTEGER NOT NULL
);

INSERT INTO app_settings (nzxt_color, nzxt_night_hours_start, nzxt_night_hours_end) VALUES (
    'super-rainbow --speed slowest --direction forward',
    1,
    9
);