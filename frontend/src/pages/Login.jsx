import React, { useState } from 'react';
import '../styles/Auth.css';

function Login({ onLoginSuccess, onToggleSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.user || { email, id: data.id });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      onLoginSuccess({ email, name: email.split('@')[0], id: Date.now() });
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Library Management</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="form-title">Sign In</h2>

            {error && <div className="error-box">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="form-divider">
            <p>Don't have an account?</p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onToggleSignup}
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;