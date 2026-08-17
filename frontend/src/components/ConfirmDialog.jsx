import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fade-in">
            <div className="modal-content slide-down">
                <div className="modal-header">
                    <div className="modal-icon warning">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="modal-title">{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={onCancel} id="modal-cancel-btn">
                        {cancelText}
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} id="modal-confirm-btn">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
