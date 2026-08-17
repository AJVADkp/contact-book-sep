import React from 'react';
import { Mail, Phone, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function ContactDetail({ contact, onEdit, onDelete }) {
    if (!contact) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Select a contact to view details
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            onDelete(contact.id);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{contact.name}</h1>
                    {contact.company && <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{contact.company}</div>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onEdit} className="btn" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-main)' }}>
                        <Edit2 size={18} /> Edit
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {contact.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Mail style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '1.1rem' }}>{contact.email}</span>
                    </div>
                )}
                {contact.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Phone style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '1.1rem' }}>{contact.phone}</span>
                    </div>
                )}
                {contact.company && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Briefcase style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '1.1rem' }}>{contact.company}</span>
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                    <Calendar size={18} />
                    <span style={{ fontSize: '0.9rem' }}>Added {new Date(contact.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
