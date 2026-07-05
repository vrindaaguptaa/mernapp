import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LockRounded from '@mui/icons-material/LockRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import { buildApiUrl, buildHeaders, parseApiResponse } from '../utils/api';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(buildApiUrl('/api/loginuser'), {
        method: 'POST',
        headers: buildHeaders({ includeJson: true }),
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      const json = await parseApiResponse(response, 'Login failed');

      if (!json?.success) {
        const message = json?.message || 'Enter valid credentials';
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem('authToken', json.authToken);
      localStorage.setItem('isAdmin', json.isAdmin);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const message = 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="auth-page container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-card">
            <span className="section-kicker">Welcome back</span>
            <h1>Login to GoFood</h1>
            <p>Sign in to discover delicious food near you.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="email" value={credentials.email} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="password" value={credentials.password} onChange={onChange} required />
              </div>
              <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
                {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Signing in…</> : <><LoginRounded fontSize="small" /> Log in</>}
              </button>
            </form>
            <div className="mt-3 text-center">
              <Link to="/createuser" className="btn btn-outline-brand w-100">
                <LockRounded fontSize="small" /> Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
