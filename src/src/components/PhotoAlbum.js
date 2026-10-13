import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useUser } from '../UserContext';
import { fetchAllPhotos } from '../photosApi';
import { Page, Panel, Field, Notice, Empty, api, errorText } from './PortalUI';
export default function PhotoAlbum() {
  const {
    user
  } = useUser();
  const admin = String(user?.role) === '1';
  const [photos, setPhotos] = useState([]),
    [albums, setAlbums] = useState([]),
    [activeAlbum, setActiveAlbum] = useState('all'),
    [q, setQ] = useState(''),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [name, setName] = useState(''),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [all, {
        data
      }] = await Promise.all([fetchAllPhotos(), api.get('/getPhotoAlbum', {
        params: {
          limit: 200
        }
      })]);
      setPhotos(all);
      setAlbums(data);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const visible = photos.filter(p => (activeAlbum === 'all' || activeAlbum === 'unassigned' ? !p.album || activeAlbum === 'all' : String(p.album) === activeAlbum) && p.filename.toLowerCase().includes(q.toLowerCase()));
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/addPhotoAlbum', {
        AlbumName: name
      });
      setName('');
      setMessage('Album created.');
      await load();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function move(photo, albumId) {
    if (!albumId) return;
    setBusy(true);
    try {
      await api.put('/updatePhotoAlbum', {
        photoId: photo.id,
        albumId: Number(albumId)
      });
      setPhotos(old => old.map(p => p.id === photo.id ? {
        ...p,
        album: Number(albumId)
      } : p));
      setMessage('Photo moved to its new album.');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="OUR COMMUNITY" title="Memories worth keeping." description="Fellowship, worship, and the moments in between." action={user && <Link className="portal-btn" to="/UploadPhotos">+ Upload photos</Link>}><Notice>{message}</Notice><Notice error>{error} {error && <button className="portal-link" onClick={load}>Try again</button>}</Notice><div className="portal-gallery-layout"><aside className="portal-album-sidebar"><h2>Your albums</h2>{[['all', 'All photos'], ['unassigned', 'Uncategorized'], ...albums.map(a => [String(a.id), a.AlbumName])].map(([id, label]) => <button key={id} className={activeAlbum === id ? 'active' : ''} aria-pressed={activeAlbum === id} onClick={() => setActiveAlbum(id)}><span>{label}</span><small>{id === 'all' ? photos.length : photos.filter(p => id === 'unassigned' ? !p.album : String(p.album) === id).length}</small></button>)}{admin && <form onSubmit={create}><Field id="album-name" label="New album" required maxLength={150} placeholder="Album name" value={name} onChange={e => setName(e.target.value)} /><button className="portal-btn secondary wide" disabled={busy}>Create album</button></form>}</aside><div><div className="portal-toolbar"><span>{visible.length} photos</span><input aria-label="Search photos" placeholder="Search photos…" value={q} onChange={e => setQ(e.target.value)} /></div>{loading ? <p className="portal-loading" role="status">Loading your memories…</p> : visible.length ? <div className="portal-photo-grid">{visible.map(p => <Panel className="portal-photo-card" key={p.id}><button className="portal-photo-open" onClick={() => setSelected(p)} aria-label={`View ${p.filename}`}><img src={`data:image/jpeg;base64,${p.image_data}`} alt={p.filename} loading="lazy" /></button><div className="portal-photo-info"><p>{p.filename}</p>{admin && <select aria-label={`Move ${p.filename} to album`} value="" onChange={e => move(p, e.target.value)} disabled={busy}><option value="">Move to album…</option>{albums.filter(a => Number(a.id) !== Number(p.album)).map(a => <option key={a.id} value={a.id}>{a.AlbumName}</option>)}</select>}</div></Panel>)}</div> : !error && <Empty title="A fresh page in our story.">No photos match this album or search.</Empty>}</div></div><Modal show={!!selected} onHide={() => setSelected(null)} size="xl" centered><Modal.Header closeButton><Modal.Title>{selected?.filename}</Modal.Title></Modal.Header><Modal.Body>{selected && <img className="portal-lightbox" src={`data:image/jpeg;base64,${selected.image_data}`} alt={selected.filename} />}</Modal.Body><Modal.Footer><button className="portal-btn secondary" disabled={visible.length < 2} onClick={() => {
          const i = visible.findIndex(p => p.id === selected?.id);
          setSelected(visible[(i - 1 + visible.length) % visible.length]);
        }}>← Previous photo</button><button className="portal-btn secondary" disabled={visible.length < 2} onClick={() => {
          const i = visible.findIndex(p => p.id === selected?.id);
          setSelected(visible[(i + 1) % visible.length]);
        }}>Next photo →</button></Modal.Footer></Modal></Page>;
}
