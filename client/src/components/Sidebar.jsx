export default function Sidebar({ projects, selectedId, onSelect, onNew, onEdit, onDelete }) {
    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <div className="sidebar__brand">
                    <div className="sidebar__logo-container">
                        <img src="/assets/logo.svg" alt="Scholar Cart" className="sidebar__logo-img" />
                    </div>
                    <div className="sidebar__brand-text">
                        <div className="sidebar__title">Scholar Cart</div>
                        <div className="sidebar__tagline">Track What Matters</div>
                    </div>
                </div>
                <button className="sidebar__new-btn" onClick={onNew}>
                    <span>＋</span> New Project
                </button>
            </div>

            <div className="sidebar__list">
                {projects.length === 0 ? (
                    <div className="sidebar__empty">
                        No projects yet.<br />Create one to start tracking tasks.
                    </div>
                ) : (
                    projects.map((p) => (
                        <div
                            key={p.id}
                            className={`sidebar__item ${p.id === selectedId ? 'sidebar__item--active' : ''}`}
                            onClick={() => onSelect(p.id)}
                        >
                            <span className="sidebar__item-dot" style={{ background: p.color }} />
                            <span className="sidebar__item-name">{p.name}</span>
                            <span className="sidebar__item-count">{p.task_count ?? 0}</span>
                            <span className="sidebar__item-actions">
                                <button
                                    className="sidebar__action-btn"
                                    title="Edit"
                                    onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                                >✎</button>
                                <button
                                    className="sidebar__action-btn sidebar__action-btn--delete"
                                    title="Delete"
                                    onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                                >✕</button>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}
