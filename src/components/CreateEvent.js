import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllPhotos } from '../photosApi';
import { Page, Panel, Field, Notice, Empty, api, errorText } from './PortalUI';
export default function CreateEvent() {
  const initial = {
    eventTitle: '',
    eventDate: '',
    eventLocation: '',
    eventDetails: '',
    eventImage: ''
  };
  const [form, setForm] = useState(initial),
    [photos, setPhotos] = useState([]),
    [loading, setLoading] = useState(true),
    [photoError, setPhotoError] = useState(''),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetchAllPhotos().then(p => active && setPhotos(p)).catch(() => active && setPhotoError('Could not load photos. Reload this page to try again.')).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const field = key => ({
    value: form[key],
    onChange: e => setForm({
      ...form,
      [key]: e.target.value
    })
  });
  async function submit(e) {
    e.preventDefault();
    if (!form.eventImage) {
      setError('Choose a cover photo before creating the event.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api.post('/addEvent', form);
      setForm(initial);
      setMessage('Event created successfully. It is now listed in church events.');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="CHURCH ADMINISTRATION" title="Make room for connection." description="Create a gathering your church family can look forward to." action={<Link className="portal-btn secondary" to="/ViewEventsAdmin">Back to events</Link>}><form onSubmit={submit} className="portal-split"><Panel title="Event details" description="Tell your community what, when, and where."><Notice>{message}</Notice><Notice error>{error}</Notice><Field label="Event title" id="event-title" required maxLength={200} {...field('eventTitle')} /><div className="portal-form-grid"><Field label="Date & time" id="event-date" type="datetime-local" required {...field('eventDate')} /><Field label="Location" id="event-location" required maxLength={255} {...field('eventLocation')} /></div><Field as="textarea" label="What to expect" id="event-details" required rows={6} maxLength={4000} {...field('eventDetails')} /><button className="portal-btn" disabled={busy}>{busy ? 'Creating event…' : 'Publish event →'}</button></Panel><Panel title="Choose a cover photo" description="Select an existing photo from your church gallery."><Notice error>{photoError}</Notice>{loading ? <p role="status">Loading photos…</p> : photos.length ? <div className="portal-cover-grid">{photos.map(p => <button key={p.id} type="button" aria-pressed={form.eventImage === p.filename} className={form.eventImage === p.filename ? 'selected' : ''} onClick={() => setForm({
            ...form,
            eventImage: p.filename
          })}><img src={`data:image/jpeg;base64,${p.image_data}`} alt={p.filename} loading="lazy" />{form.eventImage === p.filename && <span>✓ Selected</span>}</button>)}</div> : !photoError && <Empty title="Add a photo first"><Link to="/UploadPhotos">Upload a cover photo</Link> before creating your event.</Empty>}</Panel></form></Page>;
}
