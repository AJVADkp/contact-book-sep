import { Users, SearchX } from 'lucide-react';

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

export default function ContactList({ contacts, selectedId, onSelect, loading, emptySearch }) {
    if (loading) {
        return (
            <div className="loading-skeleton">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton-item">
                        <div className="skeleton-circle" />
                        <div className="skeleton-lines">
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    {emptySearch ? <SearchX size={28} /> : <Users size={28} />}
                </div>
                <div className="empty-state-title">
                    {emptySearch ? 'No matches found' : 'No contacts yet'}
                </div>
                <div className="empty-state-text">
                    {emptySearch
                        ? 'Try a different search term.'
                        : 'Click "Add Contact" to create your first entry.'}
                </div>
            </div>
        );
    }

    return (
        <div className="contact-list">
            {contacts.map(contact => (
                <div
                    key={contact.id}
                    className={`contact-item${selectedId === contact.id ? ' active' : ''}`}
                    onClick={() => onSelect(contact)}
                >
                    <div
                        className="contact-avatar"
                        style={{ backgroundColor: getAvatarColor(contact.name) }}
                    >
                        {getInitials(contact.name)}
                    </div>
                    <div className="contact-info">
                        <div className="contact-name">{contact.name}</div>
                        {contact.company && (
                            <div className="contact-company">{contact.company}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
