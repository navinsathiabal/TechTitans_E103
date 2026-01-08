
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, User, Lock } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (isSignUp) {
            // "Sign Up" process
            setMessage('Account created successfully! Please login now.');
            setIsSignUp(false);
            setPassword(''); // Clear password for security feel
        } else {
            // "Login" process
            localStorage.setItem('growth_assist_session', JSON.stringify({ name }));
            window.location.href = '/';
        }
    };

    return (
        <div className="login-container">
            <div className="vibe-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="login-card glass-panel">
                <div className="login-header">
                    <div className="logo-icon">
                        <Sparkles size={32} color="var(--primary)" />
                    </div>
                    <h1>{isSignUp ? 'Join Growth Assistant' : 'Welcome Back'}</h1>
                    <p>{isSignUp ? 'Create an account to start your journey.' : 'Propel your business to new heights.'}</p>
                </div>

                {message && <div className="success-banner">{message}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-input-group">
                        <label><User size={16} /> Business Username</label>
                        <input
                            type="text"
                            placeholder="Enter any name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label><Lock size={16} /> {isSignUp ? 'Choose Password' : 'Secure Password'}</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn btn-primary">
                        {isSignUp ? 'Create Account' : 'Login Now'} <LogIn size={18} />
                    </button>
                </form>

                <div className="login-footer">
                    <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
                    <button className="text-btn" onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}>
                        {isSignUp ? 'Login here' : 'Sign up now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
