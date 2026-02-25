export default function TaskList({ tasks, selectedTaskId, onSelectTask, statusFilter }) {
    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const statusLabel = (s) => {
        if (s === 'in_progress') return 'In Progress';
        if (s === 'done') return 'Done';
        return 'To Do';
    };

    return (
        <div className="task-list__body">
            {tasks.length === 0 ? (
                <div className="task-list__empty">
                    <div className="task-list__empty-icon">📝</div>
                    <div>{statusFilter === 'all' ? 'No tasks yet. Create one!' : 'No tasks match this filter.'}</div>
                </div>
            ) : (
                tasks.map((t) => (
                    <div
                        key={t.id}
                        className={`task-card ${t.id === selectedTaskId ? 'task-card--active' : ''}`}
                        onClick={() => onSelectTask(t.id)}
                    >
                        <div className="task-card__top">
                            <span className="task-card__title">{t.title}</span>
                        </div>
                        <div className="task-card__bottom">
                            <span className={`task-card__badge task-card__badge--${t.status}`}>
                                {statusLabel(t.status)}
                            </span>
                            <span className={`task-card__priority task-card__priority--${t.priority}`}>
                                {t.priority}
                            </span>
                            {t.due_date && (
                                <span className="task-card__date">{formatDate(t.due_date)}</span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

