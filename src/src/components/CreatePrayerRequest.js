import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Field, Notice, api, errorText } from './PortalUI';
export default function CreatePrayerRequest() {
  const [description, setDescription] = useState(''),
    [privacy, setPrivacy] = useState('public'),
    [name, setName] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [done, setDone] = useState(false),
    [contactRequested, setContactRequested] = useState(false),
    [contactPhone, setContactPhone] = useState(''),
    [submittedContact, setSubmittedContact] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/addPR', {
        description,
        user: privacy === 'anonymous' ? 'Anonymous' : name.trim() || 'Anonymous',
        private: false,
        ...(contactRequested ? {contactRequested:true, contactPhone} : {})
      });
      setSubmittedContact(contactRequested);
      setDone(true);
      setContactRequested(false);
      setContactPhone('');
      setDescription('');
      setName('');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="PRAYER & COMMUNITY" title="Let us pray with you." description="You don’t have to carry it alone. Share a request with your church family." action={<Link className="portal-btn secondary" to="/ViewPrayerRequests">View requests ↗</Link>}><div className="portal-split"><Panel title={done ? 'Your request has been shared.' : 'Share a prayer request'} description="Requests appear in the church community list. Please share only what you want others to see."><Notice error>{error}</Notice>{done ? <><Notice>Your prayer request was submitted successfully.{submittedContact && <p>Your phone contact request has been queued for church administrators. Your phone number is not shown on the public prayer board.</p>}</Notice><button className="portal-btn" onClick={() => setDone(false)}>Share another request</button></> : <form onSubmit={submit}><Field as="textarea" label="Your prayer request" id="prayer-description" required rows={6} maxLength={4000} value={description} onChange={e => setDescription(e.target.value)} placeholder="How can we pray for you?" /><fieldset className="portal-choices"><legend>How should your name appear?</legend>{[['public', 'With my name', 'Add your name to your request.'], ['anonymous', 'Anonymously', 'Share without displaying your name.']].map(([value, title, help]) => <label key={value} className={privacy === value ? 'selected' : ''}><input type="radio" name="privacy" value={value} checked={privacy === value} onChange={() => setPrivacy(value)} /><span><strong>{title}</strong><small>{help}</small></span></label>)}</fieldset>{privacy === 'public' && <Field label="Your name (optional)" id="prayer-name" maxLength={100} value={name} onChange={e => setName(e.target.value)} help="Leave blank to share anonymously." />}<fieldset className="portal-choices"><legend>Would you like someone to pray with you?</legend><label className={contactRequested ? 'selected' : ''}><input type="checkbox" checked={contactRequested} onChange={e => {setContactRequested(e.target.checked); if (!e.target.checked) setContactPhone('');}} /><span><strong>Yes, I’d like a church administrator to contact me.</strong><small>By choosing this option, you agree to share your phone number and prayer request by email with church administrators.</small></span></label></fieldset>{contactRequested && <Field label="Phone number" id="prayer-contact-phone" type="tel" autoComplete="tel" required maxLength={40} minLength={10} value={contactPhone} onChange={e => setContactPhone(e.target.value)} help="Your phone number is shared with administrators only. Please do not include it in the public prayer request above." />}<button className="portal-btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit prayer request →'}</button></form>}</Panel><aside className="portal-aside"><span className="portal-aside-mark" aria-hidden="true">✧</span><h2>We’re here for you.</h2><p>Our community is built on caring for one another through prayer and encouragement.</p><blockquote>“Pray without ceasing.”<cite>1 Thessalonians 5:17 · KJV</cite></blockquote></aside></div></Page>;
}
