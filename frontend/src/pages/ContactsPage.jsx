import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import useDebounce from '../hooks/useDebounce';
import ContactList from '../components/ContactList';
import ContactDetail from '../components/ContactDetail';
import ContactForm from '../components/ContactForm';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import { Plus, LogOut, Menu, X } from 'lucide-react';

export default function ContactsPage() {
    const { logout } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const debouncedSearch = useDebounce(search, 300);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, id: Date.now() });
    };

    const fetchContacts = useCallback(async (query = '') => {
        setLoading(true);
        try {
            const res = await client.get(`/contacts/?search=${query}`);
            setContacts(res.data);
            if (selectedContact) {
                const stillExists = res.data.find(c => c.id === selectedContact.id);
                if (!stillExists) setSelectedContact(null);
            }
        } catch (err) {
            console.error("Error fetching contacts:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedContact]);

    useEffect(() => {
        fetchContacts(debouncedSearch);
    }, [debouncedSearch, fetchContacts]);

    const handleSelect = (contact) => {
        setSelectedContact(contact);
        setIsEditing(false);
        setSidebarOpen(false);
    };

    const handleCreateNew = () => {
        setSelectedContact(null);
        setIsEditing(true);
        setSidebarOpen(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await client.delete(`/contacts/${id}/`);
            setSelectedContact(null);
            fetchContacts(debouncedSearch);
            showToast('Contact deleted successfully');
        } catch (err) {
            console.error("Error deleting contact:", err);
            showToast('Failed to delete contact', 'error');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedContact) {
                const res = await client.patch(`/contacts/${selectedContact.id}/`, formData);
                setSelectedContact(res.data);
                showToast('Contact updated successfully');
            } else {
                const res = await client.post('/contacts/', formData);
                setSelectedContact(res.data);
                showToast('Contact created successfully');
            }
            setIsEditing(false);
            fetchContacts(debouncedSearch);
        } catch (err) {
            console.error("Error saving contact:", err);
            showToast('Failed to save contact. Please check your inputs.', 'error');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <>
            <div className="mobile-header">
                <button
                    className="btn btn-icon"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                    id="mobile-menu-btn"
                >
                    <Menu size={20} />
                </button>
                <span className="mobile-header-title">Contacts</span>
                <div style={{ width: 36 }} />
            </div>

            {sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="app-container">
                <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-top-row">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h2 className="sidebar-title">Contacts</h2>
                                {!loading && (
                                    <span className="sidebar-count">{contacts.length}</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                <button
                                    onClick={logout}
                                    className="btn btn-ghost btn-sm"
                                    title="Sign out"
                                    id="logout-btn"
                                >
                                    <LogOut size={16} />
                                </button>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="btn btn-icon sidebar-close"
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <SearchBar value={search} onChange={setSearch} />
                        <button
                            onClick={handleCreateNew}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            id="create-contact-btn"
                        >
                            <Plus size={16} />
                            Add Contact
                        </button>
                    </div>
                    <div className="sidebar-list">
                        <ContactList
                            contacts={contacts}
                            selectedId={selectedContact?.id}
                            onSelect={handleSelect}
                            loading={loading}
                            emptySearch={search.length > 0}
                        />
                    </div>
                </div>

                <div className="main-content">
                    {isEditing ? (
                        <ContactForm
                            initialData={selectedContact}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <ContactDetail
                            contact={selectedContact}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <Toast toast={toast} onClose={() => setToast(null)} />
        </>
    );
}
