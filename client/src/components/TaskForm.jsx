import { useState } from 'react';

export default function TaskForm({ onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [due_date, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ title: title.trim(), description: description.trim(), priority, due_date: due_date || null });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 className="modal__title">New Task</h3>

                <div className="modal__field">
                    <label className="modal__label">Title</label>
                    <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Review literature on CRISPR" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details…" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="modal__field">
                    <label className="modal__label">Due Date</label>
                    <input type="date" value={due_date} onChange={(e) => setDueDate(e.target.value)} />
                </div>

                <div className="modal__actions">
                    <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="modal__btn modal__btn--primary">
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}
