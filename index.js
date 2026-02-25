import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { refreshPapers, refreshSignals } from './ingest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'data.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

// ── Database ────────────────────────────────────────────────────────
const SQL = await initSqlJs();

let db;
if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
} else {
    db = new SQL.Database();
}

// Run schema
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
db.run(schema);
db.run('PRAGMA foreign_keys = ON');

function persist() {
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
}

// Helper: run SELECT and return array of objects
function queryAll(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
}

function queryOne(sql, params = []) {
    const rows = queryAll(sql, params);
    return rows[0] || null;
}

function runSql(sql, params = []) {
    db.run(sql, params);
    persist();
    return db.getRowsModified();
}

function lastInsertId() {
    return queryOne('SELECT last_insert_rowid() as id').id;
}

// ── Express ─────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ── Projects CRUD ───────────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
    const rows = queryAll(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count
    FROM projects p
    ORDER BY p.created_at DESC
  `);
    res.json(rows);
});

app.post('/api/projects', (req, res) => {
    const { name, description = '', color = '#6366f1' } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    runSql('INSERT INTO projects (name, description, color) VALUES (?, ?, ?)', [name, description, color]);
    const project = queryOne('SELECT * FROM projects WHERE id = ?', [lastInsertId()]);
    res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
    const { name, description, color } = req.body;
    const existing = queryOne('SELECT * FROM projects WHERE id = ?', [Number(req.params.id)]);
    if (!existing) return res.status(404).json({ error: 'not found' });
    runSql('UPDATE projects SET name = ?, description = ?, color = ? WHERE id = ?', [
        name ?? existing.name,
        description ?? existing.description,
        color ?? existing.color,
        Number(req.params.id)
    ]);
    const updated = queryOne('SELECT * FROM projects WHERE id = ?', [Number(req.params.id)]);
    res.json(updated);
});

app.delete('/api/projects/:id', (req, res) => {
    runSql('DELETE FROM experiments WHERE project_id = ?', [Number(req.params.id)]);
    runSql('DELETE FROM tasks WHERE project_id = ?', [Number(req.params.id)]);
    runSql('DELETE FROM projects WHERE id = ?', [Number(req.params.id)]);
    res.status(204).end();
});

// ── Tasks CRUD ──────────────────────────────────────────────────────
app.get('/api/projects/:id/tasks', (req, res) => {
    const rows = queryAll('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC', [Number(req.params.id)]);
    res.json(rows);
});

app.post('/api/tasks', (req, res) => {
    const { project_id, title, description = '', status = 'todo', priority = 'medium', due_date = null } = req.body;
    if (!project_id || !title) return res.status(400).json({ error: 'project_id and title are required' });
    runSql(
        'INSERT INTO tasks (project_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
        [project_id, title, description, status, priority, due_date]
    );
    const task = queryOne('SELECT * FROM tasks WHERE id = ?', [lastInsertId()]);
    res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
    const existing = queryOne('SELECT * FROM tasks WHERE id = ?', [Number(req.params.id)]);
    if (!existing) return res.status(404).json({ error: 'not found' });
    const { title, description, status, priority, due_date, project_id } = req.body;
    runSql(`UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, project_id = ?, updated_at = datetime('now') WHERE id = ?`, [
        title ?? existing.title,
        description ?? existing.description,
        status ?? existing.status,
        priority ?? existing.priority,
        due_date !== undefined ? due_date : existing.due_date,
        project_id ?? existing.project_id,
        Number(req.params.id)
    ]);
    const updated = queryOne('SELECT * FROM tasks WHERE id = ?', [Number(req.params.id)]);
    res.json(updated);
});

app.delete('/api/tasks/:id', (req, res) => {
    runSql('DELETE FROM tasks WHERE id = ?', [Number(req.params.id)]);
    res.status(204).end();
});

// ── Experiments CRUD ────────────────────────────────────────────────
app.get('/api/projects/:id/experiments', (req, res) => {
    const rows = queryAll('SELECT * FROM experiments WHERE project_id = ? ORDER BY created_at DESC', [Number(req.params.id)]);
    res.json(rows);
});

app.get('/api/experiments', (_req, res) => {
    const rows = queryAll('SELECT * FROM experiments ORDER BY created_at DESC');
    res.json(rows);
});

app.get('/api/experiments/:id', (req, res) => {
    const experiment = queryOne('SELECT * FROM experiments WHERE id = ?', [Number(req.params.id)]);
    if (!experiment) return res.status(404).json({ error: 'not found' });
    res.json(experiment);
});

app.post('/api/experiments', (req, res) => {
    const exp = req.body;
    if (!exp.project_id) return res.status(400).json({ error: 'project_id is required' });
    runSql(
        `INSERT INTO experiments (title, hypothesis, methodology, status, result_summary, start_date, end_date, experiment_id, project_id, date, objective, samples, reagents, protocol_version, observations, result, conclusion, next_step, raw_data_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            exp.title || '',
            exp.hypothesis || '',
            exp.methodology || '',
            exp.status || 'planned',
            exp.result_summary || '',
            exp.start_date || null,
            exp.end_date || null,
            exp.experiment_id || '',
            exp.project_id,
            exp.date || null,
            exp.objective || '',
            exp.samples || '',
            exp.reagents || '',
            exp.protocol_version || '',
            exp.observations || '',
            exp.result || '',
            exp.conclusion || '',
            exp.next_step || '',
            exp.raw_data_path || ''
        ]
    );
    const experiment = queryOne('SELECT * FROM experiments WHERE id = ?', [lastInsertId()]);
    res.status(201).json(experiment);
});

app.put('/api/experiments/:id', (req, res) => {
    const existing = queryOne('SELECT * FROM experiments WHERE id = ?', [Number(req.params.id)]);
    if (!existing) return res.status(404).json({ error: 'not found' });
    const {
        experiment_id, project_id, date, objective, samples,
        reagents, protocol_version, observations, result,
        conclusion, next_step, raw_data_path
    } = req.body;
    runSql(
        `UPDATE experiments SET experiment_id = ?, project_id = ?, date = ?, objective = ?, samples = ?, reagents = ?, protocol_version = ?, observations = ?, result = ?, conclusion = ?, next_step = ?, raw_data_path = ? WHERE id = ?`,
        [
            experiment_id ?? existing.experiment_id,
            project_id ?? existing.project_id,
            date !== undefined ? date : existing.date,
            objective ?? existing.objective,
            samples ?? existing.samples,
            reagents ?? existing.reagents,
            protocol_version ?? existing.protocol_version,
            observations ?? existing.observations,
            result ?? existing.result,
            conclusion ?? existing.conclusion,
            next_step ?? existing.next_step,
            raw_data_path ?? existing.raw_data_path,
            Number(req.params.id)
        ]
    );
    const updated = queryOne('SELECT * FROM experiments WHERE id = ?', [Number(req.params.id)]);
    res.json(updated);
});

app.delete('/api/experiments/:id', (req, res) => {
    runSql('DELETE FROM experiments WHERE id = ?', [Number(req.params.id)]);
    res.status(204).end();
});

// ── Scholar Cart Endpoints ──────────────────────────────────────────
['papers', 'jobs', 'conferences', 'signals'].forEach(type => {
    app.get(`/api/${type}`, (req, res) => {
        const itemType = type.slice(0, -1);
        const rows = queryAll(`
            SELECT i.*, COALESCE(s.state, 'unread') as state 
            FROM items i 
            LEFT JOIN item_state s ON i.id = s.item_id 
            WHERE i.type = ? 
            ORDER BY i.created_at DESC
        `, [itemType]);
        res.json(rows);
    });
});

app.post('/api/jobs/manual', (req, res) => {
    const { title, url, source, abstract, date } = req.body;
    const id = `manual:${Date.now()}`;
    runSql('INSERT INTO items (id, type, title, abstract, url, source, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        id, 'job', title, abstract || '', url || '', source || 'Manual', date || new Date().toISOString()
    ]);
    res.json({ id });
});

app.post('/api/conferences/manual', (req, res) => {
    const { title, url, source, start_date, abstract_deadline } = req.body;
    const id = `manual:${Date.now()}`;
    const metrics = JSON.stringify({ start_date, abstract_deadline });
    runSql('INSERT INTO items (id, type, title, url, source, metrics) VALUES (?, ?, ?, ?, ?, ?)', [
        id, 'conference', title, url || '', source || 'Manual', metrics
    ]);

    if (start_date) {
        const startDate = new Date(start_date);
        const d7 = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        runSql('INSERT INTO reminders (item_id, type, remind_at) VALUES (?, ?, ?)', [id, 'start_date_7d', d7.toISOString()]);
    }
    if (abstract_deadline) {
        const deadline = new Date(abstract_deadline);
        [30, 14, 7].forEach(days => {
            const d = new Date(deadline.getTime() - days * 24 * 60 * 60 * 1000);
            runSql('INSERT INTO reminders (item_id, type, remind_at) VALUES (?, ?, ?)', [id, `abstract_${days}d`, d.toISOString()]);
        });
    }
    res.json({ id });
});

['save', 'unsave', 'read'].forEach(action => {
    app.post(`/api/items/:id/${action}`, (req, res) => {
        const stateMapping = { save: 'saved', unsave: 'unread', read: 'read' };
        const state = stateMapping[action];
        runSql(`
            INSERT INTO item_state (item_id, state, updated_at) VALUES (?, ?, datetime('now')) 
            ON CONFLICT(item_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
        `, [req.params.id, state]);
        res.json({ success: true, state });
    });
});

app.get('/api/notifications', (req, res) => {
    const rows = queryAll(`
        SELECT r.*, i.title, i.type as item_type 
        FROM reminders r 
        JOIN items i ON r.item_id = i.id 
        WHERE r.remind_at <= datetime('now') AND r.status = 'pending'
    `);
    res.json(rows);
});

app.post('/api/notifications/:id/dismiss', (req, res) => {
    runSql(`UPDATE reminders SET status = 'sent' WHERE id = ?`, [Number(req.params.id)]);
    res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
    const rows = queryAll('SELECT * FROM settings');
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
});

app.post('/api/settings', (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        runSql(`
            INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) 
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `, [key, value]);
    }
    res.json({ success: true });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/refresh', async (req, res) => {
    const settingsRows = queryAll('SELECT key, value FROM settings');
    const settings = settingsRows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});

    try {
        const papersAdded = await refreshPapers(settings.paper_query, runSql, queryOne);
        const signalsAdded = await refreshSignals(runSql, queryOne);

        runSql('INSERT INTO refresh_logs (target, status, items_added) VALUES (?, ?, ?)', ['papers', 'success', papersAdded]);
        runSql('INSERT INTO refresh_logs (target, status, items_added) VALUES (?, ?, ?)', ['signals', 'success', signalsAdded]);

        res.json({ success: true, papersAdded, signalsAdded });
    } catch (e) {
        console.error(e);
        runSql('INSERT INTO refresh_logs (target, status, items_added) VALUES (?, ?, ?)', ['all', 'error', 0]);
        res.status(500).json({ error: e.message });
    }
});

// ── Start ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✔ Scholar Cart API running on http://localhost:${PORT}`);
});
