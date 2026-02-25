import { useState } from 'react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#64748b'];

export default function ProjectForm({ project, onSave, onClose }) {
    const [name, setName] = useState(project?.name || '');
    const [description, setDescription] = useState(project?.description || '');
    const [color, setColor] = useState(project?.color || COLORS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name: name.trim(), description: description.trim(), color });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 className="modal__title">{project ? 'Edit Project' : 'New Project'}</h3>

                <div className="modal__field">
                    <label className="modal__label">Name</label>
                    <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gene Expression Study" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional project description…" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Color</label>
                    <div className="color-picker-row">
                        {COLORS.map((c) => (
                            <div
                                key={c}
                                className={`color-swatch ${c === color ? 'color-swatch--active' : ''}`}
                                style={{ background: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className="modal__actions">
                    <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="modal__btn modal__btn--primary">
                        {project ? 'Save Changes' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}
