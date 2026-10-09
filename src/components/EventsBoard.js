import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useUser } from '../UserContext';
import { Page, Panel, Notice, Empty, useList, ListStatus, Confirm, api, errorText } from './PortalUI';
function EventPhoto({
  filename
}) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let live = true;
    if (filename) api.get(`/getEventPhoto/${encodeURIComponent(filename)}`).then(({
      data
    }) => {
      if (live && data[0]?.image_data) setSrc(`data:image/jpeg;base64,${data[0].image_data}`);
    }).catch(() => {});
    return () => {
      live = false;
    };
  }, [filename]);
  return src ? <img className="portal-event-image" src={src} alt="" loading="lazy" /> : <div className="portal-event-placeholder" aria-hidden="true">HAVEN HEIGHTS<span>Gather together.</span></div>;
}
export default function EventsBoard({
  admin = false
}) {
  const list = useList('/getEvents');
  const {
    user
  } = useUser();
  const [tab, setTab] = useState('upcoming'),
    [q, setQ] = useState(''),
    [registered, setRegistered] = useState([]),
    [busy, setBusy] = useState(null),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [event, setEvent] = useState(null),
    [attendees, setAttendees] = useState([]),
    [loadingAttendees, setLoadingAttendees] = useState(false),
    [attendeeError, setAttendeeError] = useState(''),
    [selected, setSelected] = useState(null),
    [deleting, setDeleting] = useState(false),
    [deleteError, setDeleteError] = useState('');
  async function remove() {
    if (!selected || deleting) return;
    setDeleting(true); setDeleteError('');
    try {
      await api.delete(`/deleteEvent/${selected.id}`);
      list.setItems(old => old.filter(e => e.id !== selected.id));
      setRegistered(old => old.filter(id => id !== Number(selected.id)));
      if (event?.id === selected.id) setEvent(null);
      setSelected(null); setMessage('Event and its registrations deleted.');
    } catch (e) { setDeleteError(errorText(e)); }
    finally { setDeleting(false); }
  }
  useEffect(() => {
    setRegistered([]);
    if (user) api.post('/getUserRegistrations', {}).then(({
      data
    }) => setRegistered(data.map(r => Number(r.eventId)))).catch(() => {});
  }, [user]);
  const visible = list.items.filter(e => {
    const upcoming = new Date(e.Date) >= new Date(new Date().setHours(0, 0, 0, 0));
    return (tab === 'upcoming' ? upcoming : !upcoming) && `${e.Title} ${e.Location}`.toLowerCase().includes(q.toLowerCase());
  }).sort((a, b) => tab === 'upcoming' ? new Date(a.Date) - new Date(b.Date) : new Date(b.Date) - new Date(a.Date));
  async function register(id) {
    setBusy(id);
    setError('');
    try {
      await api.post('/registerForEvent', {
        eventId: id
      });
      setRegistered(old => [...old, Number(id)]);
      setMessage('You’re registered. We look forward to seeing you!');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(null);
    }
  }
  async function showAttendees(e) {
    setEvent(e);
    setAttendees([]);
    setAttendeeError('');
    setLoadingAttendees(true);
    try {
      const {
        data
      } = await api.post('/getAttendees', {
        eventId: e.id
      });
      setAttendees(data);
    } catch (e) {
      setAttendeeError(errorText(e));
    } finally {
      setLoadingAttendees(false);
    }
  }
  return <Page eyebrow={admin ? 'CHURCH ADMINISTRATION' : 'LIFE AT HAVEN HEIGHTS'} title={admin ? 'Bring people together.' : 'Gather. Connect. Grow.'} description="Make time for fellowship, worship, and life together." action={admin && <Link className="portal-btn" to="/CreateEvent">+ Create an event</Link>}><Notice>{message}</Notice><Notice error>{error}</Notice><div className="portal-toolbar"><div className="portal-tabs">{['upcoming', 'past'].map(t => <button key={t} aria-pressed={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t === 'upcoming' ? 'Upcoming events' : 'Past gatherings'}</button>)}</div><input aria-label="Search events" placeholder="Search events or locations…" value={q} onChange={e => setQ(e.target.value)} /></div><ListStatus list={list}>{visible.length ? <div className="portal-event-grid">{visible.map(e => <Panel className="portal-event-card" key={e.id}><EventPhoto filename={e.Image} /><div className="portal-event-body"><p className="portal-eyebrow">{new Date(e.Date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</p><h2>{e.Title}</h2><p className="portal-event-location">{e.Location}</p><p>{e.Details}</p><div className="portal-card-bottom">{admin ? <><button className="portal-btn secondary" onClick={() => showAttendees(e)}>View attendees</button><button className="portal-link danger" onClick={() => {setDeleteError(''); setSelected(e);}}>Delete event</button></> : tab === 'upcoming' ? user ? <button className="portal-btn" disabled={busy === e.id || registered.includes(Number(e.id))} onClick={() => register(e.id)}>{registered.includes(Number(e.id)) ? '✓ Registered' : busy === e.id ? 'Registering…' : 'Register for event →'}</button> : <Link className="portal-btn secondary" to="/Login">Sign in to register</Link> : <span className="portal-tag">Past gathering</span>}</div></div></Panel>)}</div> : !list.loading && !list.error && <Empty title={tab === 'upcoming' ? 'More moments are on the way.' : 'No past gatherings in this view.'}>Check back for church events or try another search.</Empty>}</ListStatus><Modal show={!!event} onHide={() => setEvent(null)} size="lg" centered><Modal.Header closeButton><Modal.Title>{event?.Title} · Attendees</Modal.Title></Modal.Header><Modal.Body><Notice error>{attendeeError}</Notice>{loadingAttendees ? <p role="status">Loading registrations…</p> : attendees.length ? <div className="portal-table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead><tbody>{attendees.map(a => <tr key={a.id}><td>{a.firstName} {a.lastName}</td><td>{a.emailAddr}</td><td>{a.phoneNum || '—'}</td></tr>)}</tbody></table></div> : !attendeeError && <Empty title="No registrations yet">Registered members will appear here.</Empty>}</Modal.Body></Modal><Confirm show={!!selected} title="Delete this event?" busy={deleting} onCancel={() => {if (!deleting) setSelected(null);}} onConfirm={remove}>Delete “{selected?.Title}” and all of its registrations? This cannot be undone. Uploaded photos will remain in the photo library.<Notice error>{deleteError}</Notice></Confirm></Page>;
}
