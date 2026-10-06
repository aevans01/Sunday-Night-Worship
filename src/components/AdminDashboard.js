import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Notice, Confirm, api, errorText } from './PortalUI';
const sections = [['01', 'Songs', 'Review the music shared by your community.', '/ViewSongsAdmin', 'Manage songs'], ['02', 'Prayer requests', 'Care for community prayer requests.', '/ViewPRAdmin', 'Review requests'], ['03', 'Members', 'Keep account details and roles up to date.', '/ViewUsersAdmin', 'Manage members'], ['04', 'Events', 'Plan gatherings and review registrations.', '/ViewEventsAdmin', 'Manage events']];
export default function AdminDashboard() {
  const [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  async function clear() {
    setBusy(true);
    try {
      const {
        data
      } = await api.post('/deleteSongs');
      setMessage(`${data.deletedCount || 0} songs cleared.`);
      setShow(false);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="CHURCH ADMINISTRATION" title="Care for your community." description="A single place to manage the everyday life of Haven Heights." action={<Link className="portal-btn" to="/CreateEvent">+ Create an event</Link>}><Notice>{message}</Notice><div className="portal-admin-grid">{sections.map(([number, title, description, path, label]) => <Panel key={path} className="portal-admin-card"><span className="portal-card-number">{number}</span><h2>{title}</h2><p>{description}</p><Link className="portal-link" to={path}>{label} ↗</Link></Panel>)}</div><div className="portal-admin-bottom"><Panel title="Worship together" description="Ready to choose the next song?"><Link className="portal-btn secondary" to="/SongSelector">Open the song wheel ↗</Link></Panel><Panel title="Start a new song list" description="Clear all current song submissions. This action cannot be undone."><button className="portal-btn danger-outline" onClick={() => {
          setError('');
          setShow(true);
        }}>Clear all songs</button></Panel></div><Confirm show={show} title="Clear all song submissions?" onCancel={() => setShow(false)} onConfirm={clear} busy={busy}>Every song in the current list will be permanently deleted.<Notice error>{error}</Notice></Confirm></Page>;
}
