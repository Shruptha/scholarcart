export default function ItemDetail({ item, onAction }) {
    if (!item) {
        return (
            <aside className="task-detail">
                <div className="task-detail__empty">
                    <div className="task-detail__empty-icon">📄</div>
                    <div>Select an item to view details</div>
                </div>
            </aside>
        );
    }

    let metrics = {};
    try {
        metrics = JSON.parse(item.metrics || '{}');
    } catch (e) { }

    return (
        <aside className="task-detail">
            <div className="task-detail__header">
                <span className="task-detail__header-title">{item.type.toUpperCase()} DETAIL</span>
            </div>
            <div className="task-detail__body" style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{item.title}</h3>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span className={`task-card__badge task-card__badge--${item.state === 'saved' ? 'done' : 'todo'}`}>{item.state || 'unread'}</span>
                    <span className="task-card__date" style={{ padding: '4px 8px', background: 'var(--bg-card)', borderRadius: '4px' }}>Source: {item.source}</span>
                    {item.published_at && <span className="task-card__date" style={{ padding: '4px 8px', background: 'var(--bg-card)', borderRadius: '4px' }}>Date: {new Date(item.published_at).toLocaleDateString()}</span>}
                </div>

                {metrics.start_date && <div><strong>Start Date:</strong> {new Date(metrics.start_date).toLocaleDateString()}</div>}
                {metrics.abstract_deadline && <div><strong>Abstract Deadline:</strong> {new Date(metrics.abstract_deadline).toLocaleDateString()}</div>}

                {item.abstract && (
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', lineHeight: '1.5' }}>
                        {item.abstract}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="modal__btn modal__btn--primary" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
                            Open Link
                        </a>
                    )}
                    <button className="modal__btn modal__btn--secondary" style={{ flex: 1 }} onClick={() => onAction(item.id, item.state === 'saved' ? 'unsave' : 'save')}>
                        {item.state === 'saved' ? 'Unsave' : 'Save'}
                    </button>
                    {item.state !== 'read' && (
                        <button className="modal__btn modal__btn--secondary" style={{ flex: 1 }} onClick={() => onAction(item.id, 'read')}>
                            Mark Read
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
