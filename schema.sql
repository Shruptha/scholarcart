-- Scholar Cart — Schema
-- SQLite 3

CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    color       TEXT    DEFAULT '#6366f1',
    created_at  DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'todo'
                        CHECK (status IN ('todo', 'in_progress', 'done')),
    priority    TEXT    NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low', 'medium', 'high')),
    due_date    TEXT,
    created_at  DATETIME DEFAULT (datetime('now')),
    updated_at  DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experiments (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id     TEXT,
    project_id        INTEGER NOT NULL,
    date              TEXT,
    objective         TEXT    DEFAULT '',
    samples           TEXT    DEFAULT '',
    reagents          TEXT    DEFAULT '',
    protocol_version  TEXT    DEFAULT '',
    observations      TEXT    DEFAULT '',
    result            TEXT    DEFAULT '',
    conclusion        TEXT    DEFAULT '',
    next_step         TEXT    DEFAULT '',
    raw_data_path     TEXT    DEFAULT '',
    title           TEXT    DEFAULT '',
    hypothesis      TEXT    DEFAULT '',
    methodology     TEXT    DEFAULT '',
    status          TEXT    DEFAULT 'planned',
    result_summary  TEXT    DEFAULT '',
    start_date      TEXT,
    end_date        TEXT,
    created_at        DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    url TEXT,
    source TEXT,
    published_at TEXT,
    relevance_score REAL DEFAULT 0,
    tags TEXT DEFAULT '',
    metrics TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS item_state (
    item_id TEXT PRIMARY KEY,
    state TEXT NOT NULL DEFAULT 'unread',
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT NOT NULL,
    type TEXT NOT NULL,
    remind_at DATETIME NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS refresh_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target TEXT NOT NULL,
    status TEXT NOT NULL,
    items_added INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('paper_query', '("cervical cancer" OR CIN OR "cervical intraepithelial") AND (microbiome OR microbiota OR cervicovaginal) AND (metagenomic OR shotgun OR 16S OR resistome OR "antimicrobial resistance" OR virome OR "HPV persistence" OR diagnostics OR microfluidics OR "lateral flow" OR "point-of-care")');
