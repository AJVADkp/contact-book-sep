import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookUser, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password);
            navigate('/');
        } catch (err) {
            if (err.response?.data?.email) {
                setError(err.response.data.email[0]);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <BookUser size={20} />
                    </div>
                </div>
                <h2 className="auth-title">Create an account</h2>
                <p className="auth-subtitle">Start organizing your contacts</p>

                <form onSubmit={handleSubmit} className="auth-form" id="register-form">
                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    <div className="auth-form-group">
                        <label className="form-label" htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label className="form-label" htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="register-submit-btn">
                        Create Account
                        <ArrowRight size={16} />
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
