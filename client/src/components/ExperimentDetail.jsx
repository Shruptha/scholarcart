/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

export default function ExperimentDetail({ experiment, onUpdate, onDelete }) {
    const [form, setForm] = useState({
        title: '', hypothesis: '', methodology: '', status: 'planned',
        result_summary: '', start_date: '', end_date: '',
    });

    useEffect(() => {
        if (experiment) {
            setForm({
                title: experiment.title || '',
                hypothesis: experiment.hypothesis || '',
                methodology: experiment.methodology || '',
                status: experiment.status || 'planned',
                result_summary: experiment.result_summary || '',
                start_date: experiment.start_date || '',
                end_date: experiment.end_date || '',
            });
        }
    }, [experiment]);

    if (!experiment) {
        return (
            <aside className="task-detail">
                <div className="task-detail__empty">
                    <div className="task-detail__empty-icon">🔬</div>
                    <div>Select an experiment to view details</div>
                </div>
            </aside>
        );
    }

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onUpdate(form);
    };

    return (
        <aside className="task-detail">
            <div className="task-detail__header">
                <span className="task-detail__header-title">Experiment Detail</span>
                <div className="task-detail__header-actions">
                    <button className="task-detail__icon-btn task-detail__icon-btn--delete" title="Delete experiment" onClick={onDelete}>
                        🗑
                    </button>
                </div>
            </div>

            <div className="task-detail__body">
                <div className="task-detail__field">
                    <label className="task-detail__label">Title</label>
                    <input
                        className="task-detail__title-input"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div className="task-detail__field">
                    <label className="task-detail__label">Hypothesis</label>
                    <textarea
                        value={form.hypothesis}
                        onChange={(e) => handleChange('hypothesis', e.target.value)}
                        placeholder="What do you expect to find?"
                    />
                </div>

                <div className="task-detail__field">
                    <label className="task-detail__label">Methodology</label>
                    <textarea
                        value={form.methodology}
                        onChange={(e) => handleChange('methodology', e.target.value)}
                        placeholder="Describe the experimental approach…"
                    />
                </div>

                <div className="task-detail__field">
                    <label className="task-detail__label">Status</label>
                    <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                        <option value="planned">Planned</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                <div className="task-detail__field">
                    <label className="task-detail__label">Result Summary</label>
                    <textarea
                        value={form.result_summary}
                        onChange={(e) => handleChange('result_summary', e.target.value)}
                        placeholder="Summarize findings…"
                    />
                </div>

                <div className="task-detail__meta-row">
                    <div className="task-detail__field">
                        <label className="task-detail__label">Start Date</label>
                        <input type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
                    </div>
                    <div className="task-detail__field">
                        <label className="task-detail__label">End Date</label>
                        <input type="date" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
                    </div>
                </div>

                <button className="task-detail__save-btn" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </aside>
    );
}
