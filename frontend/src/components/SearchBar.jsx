import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
    return (
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search 
                size={20} 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
                type="text"
                placeholder="Search contacts..."
                className="input-field"
                style={{ paddingLeft: '2.75rem', backgroundColor: 'rgba(2, 6, 23, 0.5)' }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
