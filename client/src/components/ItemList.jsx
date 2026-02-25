export default function ItemList({ type, items, selectedItemId, onSelectItem, onRefresh, onNewManual }) {
    return (
        <div className="task-list__body">
            {items.length === 0 ? (
                <div className="task-list__empty">
                    <div className="task-list__empty-icon">📄</div>
                    <div>No {type} found.</div>
                </div>
            ) : (
                items.map((item) => (
                    <div
                        key={item.id}
                        className={`task-card ${item.id === selectedItemId ? 'task-card--active' : ''}`}
                        onClick={() => onSelectItem(item.id)}
                    >
                        <div className="task-card__top">
                            <span className="task-card__title">{item.title}</span>
                        </div>
                        <div className="task-card__bottom">
                            <span className={`task-card__badge task-card__badge--${item.state === 'saved' ? 'done' : 'todo'}`}>
                                {item.state || 'unread'}
                            </span>
                            <span className="task-card__date">
                                {new Date(item.created_at || item.published_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))
            )}

            <div style={{ padding: '10px', marginTop: 'auto' }}>
                <button className="modal__btn modal__btn--primary" onClick={onRefresh} style={{ width: '100%', marginBottom: '10px' }}>Refresh Data</button>
                {(type === 'jobs' || type === 'conferences') && (
                    <button className="modal__btn modal__btn--secondary" onClick={onNewManual} style={{ width: '100%' }}>Add Manual Entry</button>
                )}
            </div>
        </div>
    );
}
