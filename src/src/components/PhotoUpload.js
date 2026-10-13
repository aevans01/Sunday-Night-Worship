import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Notice, api, errorText } from './PortalUI';
export default function PhotoUpload() {
  const [files, setFiles] = useState([]),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const input = useRef(null);
  function choose(e) {
    setError('');
    const chosen = Array.from(e.target.files);
    if (chosen.length > 5 || chosen.some(f => f.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(f.type))) {
      setError('Choose up to 5 JPG, PNG, or WebP images, each no larger than 2 MB.');
      setFiles([]);
      e.target.value = '';
      return;
    }
    setFiles(chosen);
  }
  async function upload(e) {
    e.preventDefault();
    if (!files.length) return;
    setBusy(true);
    setError('');
    setMessage('');
    setProgress(0);
    const body = new FormData();
    files.forEach(f => body.append('photos', f));
    try {
      await api.post('/upload', body, {
        timeout: 60000,
        onUploadProgress: e => setProgress(e.total ? Math.round(e.loaded / e.total * 100) : 0)
      });
      setMessage('Your photos have been uploaded. Find them in the photo gallery.');
      setFiles([]);
      input.current.value = '';
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="OUR COMMUNITY" title="Share a memory." description="Add the moments that make our church family special." action={<Link className="portal-btn secondary" to="/PhotoAlbum">Explore photo albums ↗</Link>}><div className="portal-split"><Panel title="Upload your photos" description="Up to 5 images at a time · JPG, PNG, or WebP · 2 MB per image"><Notice>{message}</Notice><Notice error>{error}</Notice><form onSubmit={upload}><label className="portal-upload-zone" htmlFor="photo-files"><span aria-hidden="true">↑</span><strong>Choose photos to share</strong><small>Select images from your device.</small><input ref={input} id="photo-files" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={choose} disabled={busy} /></label>{files.length > 0 && <ul className="portal-file-list">{files.map((f, i) => <li key={`${f.name}-${i}`}><span>{f.name}</span><small>{(f.size / 1024).toFixed(0)} KB</small></li>)}</ul>}{busy && <div className="portal-upload-progress"><progress value={progress} max="100" aria-label="Upload progress" /><p role="status">{progress === 100 ? 'Processing photos…' : `Uploading… ${progress}%`}</p></div>}<button className="portal-btn wide" disabled={busy || !files.length}>{busy ? 'Uploading…' : `Upload ${files.length || ''} photo${files.length === 1 ? '' : 's'} →`}</button></form></Panel><aside className="portal-aside"><h2>A little thought before sharing.</h2><p>Choose photos that celebrate our community, and make sure the people pictured are comfortable with them being shared.</p><p>After uploading, your photos appear in the gallery and can be organized into albums.</p></aside></div></Page>;
}
