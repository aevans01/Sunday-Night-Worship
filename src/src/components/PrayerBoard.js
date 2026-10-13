import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Notice, Empty, Avatar, Confirm, useList, ListStatus, api, errorText } from './PortalUI';
export default function PrayerBoard({
  admin = false
}) {
  const list = useList('/getPR');
  const [search, setSearch] = useState(''),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const visible = list.items.filter(r => `${r.description} ${r.User}`.toLowerCase().includes(search.toLowerCase()));
  async function remove() {
    setBusy(true);
    try {
      await api.delete(`/deletePR/${selected.id}`);
      list.setItems(old => old.filter(x => x.id !== selected.id));
      setSelected(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow={admin ? 'CHURCH ADMINISTRATION' : 'PRAYER & COMMUNITY'} title={admin ? 'Care through prayer.' : 'Praying together.'} description={admin ? 'Review and care for the requests shared with your church.' : 'Pause, read, and lift up the needs of our church family.'} action={<Link className="portal-btn" to="/CreatePrayerRequest">+ Share a request</Link>}><div className="portal-toolbar"><span>{list.items.length} requests loaded</span><input aria-label="Search prayer requests" placeholder="Search requests or names…" value={search} onChange={e => setSearch(e.target.value)} /></div><Notice error>{error}</Notice><ListStatus list={list}>{!list.loading && !list.error && !visible.length ? <Empty title="A quiet moment">No prayer requests match this view.</Empty> : <div className="portal-prayer-grid">{visible.map(r => <Panel key={r.id} className="portal-prayer-card"><div className="portal-member"><Avatar name={r.User || 'Anonymous'} /><div><strong>{r.User || 'Anonymous'}</strong><small>{r.private ? 'Private request' : 'Prayer request'}</small></div></div><p className="portal-request-text">{r.description}</p><div className="portal-card-bottom"><span className="portal-tag">{r.private ? 'Leadership only' : 'Our church family'}</span>{admin && <button className="portal-link danger" onClick={() => setSelected(r)}>Delete request</button>}</div></Panel>)}</div>}</ListStatus><Confirm show={!!selected} title="Delete this prayer request?" onCancel={() => setSelected(null)} onConfirm={remove} busy={busy}>This will permanently remove the selected request.<Notice error>{error}</Notice></Confirm></Page>;
}
