import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (!toast) return;
        setExiting(false);

        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 200);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2;

    return (
        <div className="toast-container">
            <div className={`toast toast-${toast.type}${exiting ? ' toast-exit' : ''}`}>
                <Icon size={16} />
                {toast.message}
            </div>
        </div>
    );
}
