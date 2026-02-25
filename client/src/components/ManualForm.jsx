import { useState } from 'react';

export default function ManualForm({ type, onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [source, setSource] = useState('Manual');
    const [abstract, setAbstract] = useState('');
    const [date, setDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({
                title: title.trim(), url, source, abstract, date,
                start_date: startDate, abstract_deadline: deadline
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 className="modal__title">Add Manual {type === 'jobs' ? 'Job' : 'Conference'}</h3>
                <div className="modal__field">
                    <label className="modal__label">Title</label>
                    <input autoFocus value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="modal__field">
                    <label className="modal__label">URL</label>
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} />
                </div>
                {type === 'jobs' && (
                    <>
                        <div className="modal__field">
                            <label className="modal__label">Description</label>
                            <textarea value={abstract} onChange={e => setAbstract(e.target.value)} />
                        </div>
                        <div className="modal__field">
                            <label className="modal__label">Date Posted</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                    </>
                )}
                {type === 'conferences' && (
                    <>
                        <div className="modal__field">
                            <label className="modal__label">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div className="modal__field">
                            <label className="modal__label">Abstract Deadline</label>
                            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                        </div>
                    </>
                )}
                <div className="modal__actions">
                    <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="modal__btn modal__btn--primary">Add Entry</button>
                </div>
            </form>
        </div>
    );
}
