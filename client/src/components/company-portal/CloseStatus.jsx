import { useEffect, useState } from "react";
import Modal from "../common/Modal.jsx";

export default function CloseStatus({ postingToClose, onClose, onClosePosting }) {
    const [closeReason, setCloseReason] = useState(null);

    useEffect(() => {
        if (postingToClose) setCloseReason(null);
    }, [postingToClose]);

    const handleClose = () => {
        setCloseReason(null);
        onClose?.();
    };

    const handleClosePosting = async () => {
        if (!postingToClose || !closeReason || !onClosePosting) return;
        await onClosePosting(postingToClose._id, closeReason);
        handleClose();
    };

    return (
        <Modal isOpen={!!postingToClose} onClose={handleClose} title="Close Job Posting" size="small">
            {postingToClose && (
                <div className="delete-modal-content">
                    <p className="close-modal-question">Why are you closing <strong>{postingToClose.title}</strong>?</p>
                    <div className="close-reason-options">
                        <label>
                            <input type="radio" name="closureReason" value="FILLED" checked={closeReason === 'FILLED'} onChange={(e) => setCloseReason(e.target.value)} />
                            Position was filled
                        </label>
                        <label>
                            <input type="radio" name="closureReason" value="UNFILLED" checked={closeReason === 'UNFILLED'} onChange={(e) => setCloseReason(e.target.value)} />
                            Position is no longer needed
                        </label>
                        <label>
                            <input type="radio" name="closureReason" value="CANCELLED" checked={closeReason === 'CANCELLED'} onChange={(e) => setCloseReason(e.target.value)} />
                            Duplicate or accidental post
                        </label>
                        <label>
                            <input type="radio" name="closureReason" value="OTHER" checked={closeReason === 'OTHER'} onChange={(e) => setCloseReason(e.target.value)} />
                            Other
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button className="form-action-btn" type="button" onClick={handleClose}>Cancel</button>
                        <button className="form-action-btn" type="button" onClick={handleClosePosting} disabled={!closeReason}>Close Posting</button>
                    </div>
                </div>
            )}
        </Modal>
    );
}