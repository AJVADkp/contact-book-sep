import React from 'react';
import { User } from 'lucide-react';

export default function ContactList({ contacts, selectedId, onSelect, loading, emptySearch }) {
    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
    }

    if (contacts.length === 0) {
        return (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {emptySearch ? "No contacts match your search." : "No contacts yet. Create one to get started!"}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {contacts.map(contact => (
                <div 
                    key={contact.id} 
                    onClick={() => onSelect(contact)}
                    style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: selectedId === contact.id ? 'var(--bg-card-hover)' : 'transparent',
                        border: '1px solid',
                        borderColor: selectedId === contact.id ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--bg-darker)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                    }}>
                        <User size={20} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {contact.name}
                        </div>
                        {contact.company && (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {contact.company}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
