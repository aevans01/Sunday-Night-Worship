import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorText, Field, Notice, Panel } from './PortalUI';
export default function Register() {
  const initial = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  };
  const [form, setForm] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [done, setDone] = useState(false);
  const field = key => ({
    value: form[key],
    onChange: e => setForm({
      ...form,
      [key]: e.target.value
    })
  });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const {
        data
      } = await api.post('/register', form);
      if (!data.success) throw new Error('Registration failed');
      setDone(true);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <section className="portal-register"><aside><Link className="portal-breadcrumb" to="/">← Back to home</Link><p className="portal-eyebrow">OUR CHURCH FAMILY</p><h1>There’s a place<br />for you here.</h1><p>Connect with Haven Heights and take part in the life of our community.</p><ul><li>Share and follow prayer requests</li><li>Register for church gatherings</li><li>Share photos and favorite songs</li></ul></aside><Panel title={done ? 'You’re all set.' : 'Create your account'} description={done ? 'Your account is ready. Sign in to get started.' : 'Fields marked with * are required.'}>{done ? <Link className="portal-btn" to="/Login">Continue to sign in →</Link> : <><Notice error>{error}</Notice><form onSubmit={submit}><div className="portal-form-grid"><Field label="First name" id="reg-first" required maxLength={100} autoComplete="given-name" {...field('firstName')} /><Field label="Last name" id="reg-last" required maxLength={100} autoComplete="family-name" {...field('lastName')} /></div><Field label="Email address" id="reg-email" type="email" required autoComplete="email" {...field('email')} /><Field label="Username" id="reg-user" required maxLength={100} autoComplete="username" {...field('username')} /><Field label="Password" id="reg-password" type="password" required minLength={12} maxLength={72} autoComplete="new-password" help="Use at least 12 characters." {...field('password')} /><Field label="Phone number" id="reg-phone" type="tel" autoComplete="tel" {...field('phone')} /><button className="portal-btn wide" disabled={busy}>{busy ? 'Creating account…' : 'Create account →'}</button></form><p className="portal-auth-bottom">Already a member? <Link to="/Login">Sign in</Link></p></>}</Panel></section>;
}
