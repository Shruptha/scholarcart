export default function ExperimentList({ experiments, selectedExperimentId, onSelectExperiment }) {
    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const statusLabel = (s) => {
        const map = { planned: 'Planned', running: 'Running', completed: 'Completed', failed: 'Failed' };
        return map[s] || s;
    };

    return (
        <div className="experiment-list-content">
            <div className="task-list__body">
                {experiments.length === 0 ? (
                    <div className="task-list__empty">
                        <div className="task-list__empty-icon">🧪</div>
                        <div>No experiments yet. Create one!</div>
                    </div>
                ) : (
                    experiments.map((e) => (
                        <div
                            key={e.id}
                            className={`task-card ${e.id === selectedExperimentId ? 'task-card--active' : ''}`}
                            onClick={() => onSelectExperiment(e.id)}
                        >
                            <div className="task-card__top">
                                <span className="task-card__title">{e.title}</span>
                            </div>
                            {e.hypothesis && (
                                <div className="experiment-card__hypothesis">{e.hypothesis}</div>
                            )}
                            <div className="task-card__bottom">
                                <span className={`task-card__badge experiment-badge--${e.status}`}>
                                    {statusLabel(e.status)}
                                </span>
                                {e.start_date && (
                                    <span className="task-card__date">{formatDate(e.start_date)}</span>
                                )}
                                {e.end_date && (
                                    <span className="task-card__date">→ {formatDate(e.end_date)}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
