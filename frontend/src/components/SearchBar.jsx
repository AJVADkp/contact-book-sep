import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
    return (
        <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input
                type="text"
                placeholder="Search contacts..."
                className="input-field"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                id="search-contacts"
            />
            {value && (
                <button
                    className="search-clear"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
