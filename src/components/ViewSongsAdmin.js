import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Empty, useList, ListStatus, Confirm, Notice, api, errorText } from './PortalUI';
export default function ViewSongsAdmin() {
  const list = useList('/getSongs'),
    [q, setQ] = useState(''),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  async function remove() {
    if (!selected || busy) return;
    setBusy(true); setError('');
    try {
      await api.delete(`/deleteSong/${selected.id}`);
      list.setItems(old => old.filter(s => s.id !== selected.id));
      setSelected(null); setMessage('Song deleted.');
    } catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }
  const visible = list.items.filter(s => String(s.VideoTitle || s.VideoTitleShortened || '').toLowerCase().includes(q.toLowerCase()));
  return <Page eyebrow="CHURCH ADMINISTRATION" title="The songs we share." description="Browse your community’s current worship song submissions." action={<Link className="portal-btn" to="/SongSelector">Open song wheel ↗</Link>}><div className="portal-toolbar"><span>{list.items.length} songs loaded</span><input aria-label="Search songs" placeholder="Search song titles…" value={q} onChange={e => setQ(e.target.value)} /></div><Notice>{message}</Notice><ListStatus list={list}><Panel className="portal-table-panel">{visible.length ? <div className="portal-table-scroll"><table><thead><tr><th>Song</th><th>Watch</th><th>Actions</th></tr></thead><tbody>{visible.map(s => <tr key={s.id}><td><div className="portal-song-row">{s.VideoImage && <img src={s.VideoImage} alt="" loading="lazy" />}<strong>{s.VideoTitle || s.VideoTitleShortened}</strong></div></td><td><a className="portal-link" href={`https://www.youtube.com/watch?v=${encodeURIComponent(s.VideoSource)}`} target="_blank" rel="noopener noreferrer">Watch ↗</a></td><td><button className="portal-link danger" onClick={() => {setError(''); setSelected(s);}}>Delete</button></td></tr>)}</tbody></table></div> : !list.loading && <Empty title="No songs in this view">Search for a different title or invite members to submit a song.</Empty>}</Panel></ListStatus><Confirm show={!!selected} title="Delete this song?" busy={busy} onCancel={() => {if (!busy) setSelected(null);}} onConfirm={remove}>Remove “{selected?.VideoTitle || selected?.VideoTitleShortened}” from the song list? This cannot be undone.<Notice error>{error}</Notice></Confirm></Page>;
}
