import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-background">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <h2>{title}</h2>
                    </div>
                    <button onClick={onClose}>╳</button>
                </div>

                <hr/>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}