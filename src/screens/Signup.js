import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PersonAddAltRounded from '@mui/icons-material/PersonAddAltRounded';
import { buildApiUrl, buildHeaders, parseApiResponse } from '../utils/api';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '', geolocation: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(buildApiUrl('/api/createuser'), {
        method: 'POST',
        headers: buildHeaders({ includeJson: true }),
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation
        })
      });
      const json = await parseApiResponse(response, 'Registration failed');

      if (!json?.success) {
        const message = json?.message || 'Enter valid credentials';
        setError(message);
        toast.error(message);
        return;
      }

      toast.success('Account created. Please log in.');
      navigate('/login');
    } catch (err) {
      const message = 'Registration failed. Please try again.';
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
            <span className="section-kicker">Join GoFood</span>
            <h1>Create your account</h1>
            <p>Your next favourite meal is just a few taps away.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" name="name" id="name" value={credentials.name} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="email" value={credentials.email} onChange={onChange} required />
                <div id="emailHelp" className="form-text">We’ll never share your email with anyone else.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="password" value={credentials.password} onChange={onChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="geolocation" className="form-label">Address</label>
                <input type="text" className="form-control" name="geolocation" id="geolocation" value={credentials.geolocation} onChange={onChange} />
              </div>
              <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
                {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Creating account…</> : <><PersonAddAltRounded fontSize="small" /> Create account</>}
              </button>
            </form>
            <div className="mt-3 text-center">
              <Link to="/login" className="btn btn-outline-brand w-100">I already have an account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
