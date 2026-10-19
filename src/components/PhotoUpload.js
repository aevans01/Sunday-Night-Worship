import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Notice, api, errorText } from './PortalUI';
import { preparePhoto, isPhoto, MAX_SOURCE_BYTES } from './preparePhoto';
export default function PhotoUpload() {
  const [files, setFiles] = useState([]),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [stage, setStage] = useState('');
  const input = useRef(null);
  function choose(e) {
    setError('');
    const chosen = Array.from(e.target.files);
    if (chosen.length > 5 || chosen.some(f => f.size > MAX_SOURCE_BYTES || !isPhoto(f))) {
      setError('Choose up to 5 JPG, PNG, WebP, HEIC, or HEIF photos, each no larger than 25 MB.');
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
    let completed = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        setStage(`Preparing photo ${i + 1} of ${files.length}…`);
        const photo = await preparePhoto(files[i]);
        const body = new FormData();
        body.append('photos', photo);
        setStage(`Uploading photo ${i + 1} of ${files.length}…`);
        await api.post('/upload', body, {
          timeout: 120000,
          onUploadProgress: event => setProgress(Math.round((i + (event.total ? Math.min(event.loaded / event.total, 1) : 0)) / files.length * 100))
        });
        completed++;
        setProgress(Math.round(completed / files.length * 100));
        setFiles(files.slice(completed));
      }
      setMessage('Your photos have been uploaded. Find them in the photo gallery.');
      input.current.value = '';
    } catch (e) {
      const status = e.response?.status;
      const detail = status === 401 ? 'Your session has expired. Sign in again, then retry the remaining photos.' : status === 413 ? 'The server rejected the photo size. Try a smaller photo.' : e.message && !e.response && !e.isAxiosError ? e.message : errorText(e);
      setError(`${completed ? `${completed} photo${completed === 1 ? '' : 's'} uploaded successfully. ` : ''}${detail} Remaining photos are still selected.`);
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="OUR COMMUNITY" title="Share a memory." description="Add the moments that make our church family special." action={<Link className="portal-btn secondary" to="/PhotoAlbum">Explore photo albums ↗</Link>}><div className="portal-split"><Panel title="Upload your photos" description="Up to 5 photos · JPG, PNG, WebP, HEIC & HEIF · 25 MB per original"><Notice>{message}</Notice><Notice error>{error}</Notice><form onSubmit={upload}><label className="portal-upload-zone" htmlFor="photo-files"><span aria-hidden="true">↑</span><strong>Choose photos to share</strong><small>Choose from your photo library. iPhone HEIC photos are converted automatically.</small><input ref={input} id="photo-files" type="file" accept="image/*,.heic,.heif" multiple onChange={choose} disabled={busy} /></label>{files.length > 0 && <ul className="portal-file-list">{files.map((f, i) => <li key={`${f.name}-${i}`}><span>{f.name}</span><small>{(f.size / 1024).toFixed(0)} KB</small></li>)}</ul>}{busy && <div className="portal-upload-progress"><progress value={progress} max="100" aria-label="Upload progress" /><p role="status">{stage} {progress}%</p></div>}<button className="portal-btn wide" disabled={busy || !files.length}>{busy ? 'Please wait…' : `Upload ${files.length || ''} photo${files.length === 1 ? '' : 's'} →`}</button></form></Panel><aside className="portal-aside"><h2>A little thought before sharing.</h2><p>Choose photos that celebrate our community, and make sure the people pictured are comfortable with them being shared.</p><p>iPhone HEIC and HEIF photos are converted on your device before upload. Large photos may take a little longer to prepare.</p><p>After uploading, your photos appear in the gallery and can be organized into albums.</p></aside></div></Page>;
}
