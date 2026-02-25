/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

export default function TaskDetail({ task, onUpdate, onDelete }) {
    const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                due_date: task.due_date || '',
            });
        }
    }, [task]);

    if (!task) {
        return (
            <aside className="task-detail">
                <div className="task-detail__empty">
                    <div className="task-detail__empty-icon">📋</div>
                    <div>Select a task to view details</div>
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
                <span className="task-detail__header-title">Task Detail</span>
                <div className="task-detail__header-actions">
                    <button className="task-detail__icon-btn task-detail__icon-btn--delete" title="Delete task" onClick={onDelete}>
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
                    <label className="task-detail__label">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Add a description…"
                    />
                </div>

                <div className="task-detail__meta-row">
                    <div className="task-detail__field">
                        <label className="task-detail__label">Status</label>
                        <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="task-detail__field">
                        <label className="task-detail__label">Priority</label>
                        <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div className="task-detail__field">
                    <label className="task-detail__label">Due Date</label>
                    <input
                        type="date"
                        value={form.due_date}
                        onChange={(e) => handleChange('due_date', e.target.value)}
                    />
                </div>

                <button className="task-detail__save-btn" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </aside>
    );
}
