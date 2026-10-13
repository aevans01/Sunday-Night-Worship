import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { api, errorText, Field, Notice } from './PortalUI';
import Camp from '../images/YouthCamp2025.jpg';
export default function Login() {
  const [form, setForm] = useState({
      email: '',
      password: ''
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const {
    login
  } = useUser();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const {
        data
      } = await api.post('/login', form);
      if (!data.success) throw new Error('Sign in failed');
      login(data.user);
      navigate('/');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <section className="portal-auth"><aside><img src={Camp} alt="Haven Heights youth community" /><div><p className="portal-eyebrow">A PLACE TO BELONG</p><h2>Faith grows<br />in community.</h2><p>Stay connected with the people and moments that make Haven Heights home.</p></div></aside><div className="portal-auth-form"><Link className="portal-breadcrumb" to="/">← Back to home</Link><p className="portal-eyebrow">YOUR ACCOUNT</p><h1>Welcome back.</h1><p>Sign in to your Haven Heights account.</p><Notice error>{error}</Notice><form onSubmit={submit}><Field id="login-email" label="Username" autoComplete="username" required value={form.email} onChange={e => setForm({
          ...form,
          email: e.target.value
        })} /><Field id="login-password" label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({
          ...form,
          password: e.target.value
        })} /><button className="portal-btn wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button></form><p className="portal-auth-bottom">New here? <Link to="/Register">Create an account</Link></p></div></section>;
}
