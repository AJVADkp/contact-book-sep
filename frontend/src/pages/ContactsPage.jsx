import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import useDebounce from '../hooks/useDebounce';
import ContactList from '../components/ContactList';
import ContactDetail from '../components/ContactDetail';
import ContactForm from '../components/ContactForm';
import SearchBar from '../components/SearchBar';
import { LogOut, Plus } from 'lucide-react';

export default function ContactsPage() {
    const { logout } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useDebounce(search, 300);

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
    };

    const handleCreateNew = () => {
        setSelectedContact(null);
        setIsEditing(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await client.delete(`/contacts/${id}/`);
            setSelectedContact(null);
            fetchContacts(debouncedSearch);
        } catch (err) {
            console.error("Error deleting contact:", err);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedContact) {
                const res = await client.patch(`/contacts/${selectedContact.id}/`, formData);
                setSelectedContact(res.data);
            } else {
                const res = await client.post('/contacts/', formData);
                setSelectedContact(res.data);
            }
            setIsEditing(false);
            fetchContacts(debouncedSearch);
        } catch (err) {
            console.error("Error saving contact:", err);
            alert("Error saving contact. Please check your inputs.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>My Contacts</h2>
                        <button onClick={logout} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent' }} title="Log out">
                            <LogOut size={20} color="var(--text-muted)" />
                        </button>
                    </div>
                    <SearchBar value={search} onChange={setSearch} />
                    <button onClick={handleCreateNew} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        <Plus size={18} /> New Contact
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
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
    );
}
