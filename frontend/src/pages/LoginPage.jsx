import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookUser, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password.');
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
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to your contact book</p>

                <form onSubmit={handleSubmit} className="auth-form" id="login-form">
                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    <div className="auth-form-group">
                        <label className="form-label" htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="login-submit-btn">
                        Sign In
                        <ArrowRight size={16} />
                    </button>
                </form>

                <div className="auth-footer">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
}
