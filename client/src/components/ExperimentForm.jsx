import { useState } from 'react';

export default function ExperimentForm({ onSave, onClose }) {
    const [title, setTitle] = useState('');
    const [hypothesis, setHypothesis] = useState('');
    const [methodology, setMethodology] = useState('');
    const [start_date, setStartDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
            title: title.trim(),
            hypothesis: hypothesis.trim(),
            methodology: methodology.trim(),
            start_date: start_date || null,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 className="modal__title">New Experiment</h3>

                <div className="modal__field">
                    <label className="modal__label">Title</label>
                    <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CRISPR Cas9 Efficiency Test" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Hypothesis</label>
                    <textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="What do you expect to find?" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Methodology</label>
                    <textarea value={methodology} onChange={(e) => setMethodology(e.target.value)} placeholder="Describe the experimental approach…" />
                </div>

                <div className="modal__field">
                    <label className="modal__label">Start Date</label>
                    <input type="date" value={start_date} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="modal__actions">
                    <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="modal__btn modal__btn--primary">Create Experiment</button>
                </div>
            </form>
        </div>
    );
}
