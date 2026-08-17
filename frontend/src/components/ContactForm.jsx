import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Save, X } from 'lucide-react';

export default function ContactForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                company: initialData.company || '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="form-header">
                <h1 className="form-title">
                    {initialData ? 'Edit Contact' : 'New Contact'}
                </h1>
            </div>

            <div className="form-body">
                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-group">
                        <label className="form-label" htmlFor="contact-name">
                            <User size={14} />
                            Full Name <span className="form-required">*</span>
                        </label>
                        <input
                            id="contact-name"
                            className="input-field"
                            required
                            placeholder="e.g. John Smith"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="contact-email">
                                <Mail size={14} />
                                Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                className="input-field"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="contact-phone">
                                <Phone size={14} />
                                Phone
                            </label>
                            <input
                                id="contact-phone"
                                className="input-field"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="contact-company">
                            <Building2 size={14} />
                            Company
                        </label>
                        <input
                            id="contact-company"
                            className="input-field"
                            placeholder="e.g. Acme Corp"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} id="save-contact-btn">
                            <Save size={15} />
                            {initialData ? 'Save Changes' : 'Create Contact'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn" style={{ flex: 1 }} id="cancel-btn">
                            <X size={15} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
