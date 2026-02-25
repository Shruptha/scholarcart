export function Notifications({ notifications, onDismiss }) {
    return (
        <div className="task-list__body">
            {notifications.length === 0 ? (
                <div className="task-list__empty">
                    <div className="task-list__empty-icon">🔔</div>
                    <div>No pending notifications.</div>
                </div>
            ) : (
                notifications.map(n => (
                    <div key={n.id} className="task-card">
                        <div className="task-card__top">
                            <span className="task-card__title">Reminder: {n.title}</span>
                        </div>
                        <div className="task-card__bottom">
                            <span className="task-card__badge task-card__badge--todo">{n.type}</span>
                            <button className="task-list__add-btn" style={{ padding: '4px 8px' }} onClick={() => onDismiss(n.id)}>Dismiss</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';

export function Settings({ settings, onSave }) {
    const [query, setQuery] = useState(settings?.paper_query || '');

    useEffect(() => {
        setQuery(settings?.paper_query || '');
    }, [settings]);

    return (
        <div className="task-list__body" style={{ overflowY: 'auto' }}>
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginTop: 0 }}>Scholar Cart Settings</h2>
                <div className="modal__field" style={{ marginBottom: '20px' }}>
                    <label className="modal__label">Default PubMed Paper Query</label>
                    <textarea
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ width: '100%', minHeight: '150px' }}
                    />
                </div>
                <button className="modal__btn modal__btn--primary" onClick={() => onSave({ paper_query: query })}>Save Settings</button>
            </div>
        </div>
    );
}
