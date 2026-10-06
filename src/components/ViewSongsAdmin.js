import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Empty, useList, ListStatus } from './PortalUI';
export default function ViewSongsAdmin() {
  const list = useList('/getSongs'),
    [q, setQ] = useState('');
  const visible = list.items.filter(s => String(s.VideoTitle || s.VideoTitleShortened || '').toLowerCase().includes(q.toLowerCase()));
  return <Page eyebrow="CHURCH ADMINISTRATION" title="The songs we share." description="Browse your community’s current worship song submissions." action={<Link className="portal-btn" to="/SongSelector">Open song wheel ↗</Link>}><div className="portal-toolbar"><span>{list.items.length} songs loaded</span><input aria-label="Search songs" placeholder="Search song titles…" value={q} onChange={e => setQ(e.target.value)} /></div><ListStatus list={list}><Panel className="portal-table-panel">{visible.length ? <div className="portal-table-scroll"><table><thead><tr><th>Song</th><th>Watch</th></tr></thead><tbody>{visible.map(s => <tr key={s.id}><td><div className="portal-song-row">{s.VideoImage && <img src={s.VideoImage} alt="" loading="lazy" />}<strong>{s.VideoTitle || s.VideoTitleShortened}</strong></div></td><td><a className="portal-link" href={`https://www.youtube.com/watch?v=${encodeURIComponent(s.VideoSource)}`} target="_blank" rel="noopener noreferrer">Watch ↗</a></td></tr>)}</tbody></table></div> : !list.loading && <Empty title="No songs in this view">Search for a different title or invite members to submit a song.</Empty>}</Panel></ListStatus></Page>;
}
