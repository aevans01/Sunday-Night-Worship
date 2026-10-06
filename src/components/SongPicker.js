import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import youtube from '../youtube';
import { Page, Panel, Notice, Empty, api, errorText } from './PortalUI';
export default function SongPicker() {
  const {
    user
  } = useUser();
  const [q, setQ] = useState(''),
    [videos, setVideos] = useState([]),
    [loading, setLoading] = useState(false),
    [searched, setSearched] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [adding, setAdding] = useState(null),
    [added, setAdded] = useState([]);
  async function search(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const {
        data
      } = await youtube.get('/search', {
        params: {
          q: q.trim(),
          type: 'video'
        }
      });
      setVideos(data.items || []);
      setSearched(true);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }
  async function add(v) {
    setAdding(v.id.videoId);
    setError('');
    try {
      await api.post('/addSongs', {
        VideoSource: v.id.videoId,
        VideoTitle: v.snippet.title,
        VideoTitleShortened: v.snippet.title.slice(0, 200),
        VideoDescription: v.snippet.description,
        VideoImage: v.snippet.thumbnails.medium.url
      });
      setAdded(old => [...old, v.id.videoId]);
      setMessage('Song added to the church song list.');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setAdding(null);
    }
  }
  return <Page eyebrow="WORSHIP TOGETHER" title="Music that brings us together." description="Find a favorite worship song and share it with your church family."><Panel className="portal-search-panel"><form className="portal-song-search" onSubmit={search}><div><label htmlFor="song-query">Search songs or artists</label><input id="song-query" value={q} onChange={e => setQ(e.target.value)} placeholder="Try a song title or artist…" required maxLength={200} /></div><button className="portal-btn" disabled={loading}>{loading ? 'Searching…' : 'Search songs →'}</button></form></Panel><Notice>{message}</Notice><Notice error>{error}</Notice>{loading ? <p className="portal-loading" role="status">Finding your music…</p> : videos.length ? <div className="portal-video-grid">{videos.filter(v => v.id?.videoId).map(v => <Panel className="portal-video-card" key={v.id.videoId}><a href={`https://www.youtube.com/watch?v=${encodeURIComponent(v.id.videoId)}`} target="_blank" rel="noopener noreferrer"><img src={v.snippet.thumbnails.medium.url} alt="" loading="lazy" /></a><div><small>{v.snippet.channelTitle}</small><h2>{v.snippet.title}</h2>{user ? <button className="portal-btn secondary wide" disabled={adding === v.id.videoId || added.includes(v.id.videoId)} onClick={() => add(v)}>{added.includes(v.id.videoId) ? '✓ Added' : adding === v.id.videoId ? 'Adding…' : '+ Add to song list'}</button> : <Link className="portal-btn secondary wide" to="/Login">Sign in to add this song</Link>}</div></Panel>)}</div> : <Empty title={searched ? 'No songs found.' : 'What will we sing next?'}>{searched ? 'Try another song title or artist.' : 'Search above to find music for our next time together.'}</Empty>}</Page>;
}
