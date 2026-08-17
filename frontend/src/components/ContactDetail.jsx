import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, UserCircle, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const avatarColors = ['#e11d48', '#db2777', '#9333ea', '#6366f1', '#2563eb', '#0891b2', '#059669', '#ca8a04'];

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export default function ContactDetail({ contact, onEdit, onDelete }) {
    if (!contact) {
        return (
            <div className="detail-empty">
                <div className="empty-state-icon">
                    <UserCircle size={32} />
                </div>
                <div className="empty-state-title">Select a contact</div>
                <div className="empty-state-text">
                    Choose someone from the list to view their details.
                </div>
            </div>
        );
    }

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = () => {
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        setIsConfirmOpen(false);
        onDelete(contact.id);
    };

    const fields = [
        { label: 'Email', value: contact.email, icon: Mail },
        { label: 'Phone', value: contact.phone, icon: Phone },
        { label: 'Company', value: contact.company, icon: Building2 },
        {
            label: 'Added',
            value: new Date(contact.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            icon: Calendar,
        },
    ].filter(f => f.value);

    return (
        <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="detail-header">
                <div className="detail-header-info">
                    <div
                        className="detail-avatar"
                        style={{ backgroundColor: getAvatarColor(contact.name) }}
                    >
                        {getInitials(contact.name)}
                    </div>
                    <div>
                        <h1 className="detail-name">{contact.name}</h1>
                        {contact.company && (
                            <div className="detail-company">{contact.company}</div>
                        )}
                    </div>
                </div>
                <div className="detail-actions">
                    <button onClick={onEdit} className="btn" id="edit-contact-btn">
                        <Pencil size={15} />
                        Edit
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger" id="delete-contact-btn">
                        <Trash2 size={15} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="detail-body">
                <div className="detail-section-title">Contact Information</div>
                <div className="detail-grid">
                    {fields.map((field, i) => (
                        <div key={i} className="detail-field">
                            <div className="detail-field-label">
                                <field.icon size={14} />
                                {field.label}
                            </div>
                            <div className="detail-field-value">{field.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Delete Contact"
                message={`Are you sure you want to delete ${contact.name}? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
}
