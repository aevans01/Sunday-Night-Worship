import { useEffect, useState } from 'react';

const ENDPOINT = 'https://beta.ourmanna.com/api/v1/get?format=json&order=daily';
const CACHE_KEY = 'hh-daily-verse-v1';
const fallbackVerses = [
  { text: 'The LORD is my shepherd; I shall not want.', reference: 'Psalm 23:1', version: 'KJV' },
  { text: 'We love him, because he first loved us.', reference: '1 John 4:19', version: 'KJV' },
  { text: 'Let all your things be done with charity.', reference: '1 Corinthians 16:14', version: 'KJV' },
];
function dayKey() { return new Date().toLocaleDateString('en-CA'); }
function validVerse(v) { return v && ['text', 'reference', 'version'].every(key => typeof v[key] === 'string' && v[key].trim() && v[key].length < 5000); }
function readCache(day) {
  try { const saved = JSON.parse(localStorage.getItem(CACHE_KEY)); return saved?.day === day && validVerse(saved.verse) ? saved.verse : null; } catch { return null; }
}

export default function DailyBibleVerse() {
  const [day, setDay] = useState(dayKey);
  const [verse, setVerse] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkDate = () => setDay(dayKey());
    const timer = setInterval(checkDate, 60000);
    window.addEventListener('focus', checkDate);
    return () => { clearInterval(timer); window.removeEventListener('focus', checkDate); };
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const cached = readCache(day);
    setMessage('');
    setVerse(cached);
    setStatus(cached ? 'ready' : 'loading');
    async function load() {
      try {
        const response = await fetch(ENDPOINT, { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Verse unavailable');
        const data = await response.json();
        const details = data?.verse?.details;
        if (!validVerse(details)) throw new Error('Invalid verse');
        const next = { text: details.text.trim(), reference: details.reference.trim(), version: details.version.trim() };
        if (!active) return;
        setVerse(next); setStatus('ready');
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ day, verse: next })); } catch { /* Private browsing can disable storage. */ }
      } catch {
        if (!active) return;
        if (cached) { setVerse(cached); setStatus('cached'); }
        else { setVerse(fallbackVerses[Math.floor(Date.now() / 86400000) % fallbackVerses.length]); setStatus('fallback'); }
      } finally { clearTimeout(timeout); }
    }
    load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [day, attempt]);

  async function share() {
    const text = `${verse.text}\n${verse.reference} (${verse.version})`;
    try {
      if (navigator.share) await navigator.share({ title: 'Today’s scripture', text });
      else { await navigator.clipboard.writeText(text); setMessage('Verse copied to clipboard.'); }
    } catch (error) { if (error.name !== 'AbortError') setMessage('Sharing is unavailable. You can select and copy the verse text.'); }
  }

  return (
    <section className="hh-verse" aria-labelledby="hh-verse-title" aria-busy={status === 'loading'}>
      <div className="hh-verse-header"><div><p className="hh-eyebrow">A MOMENT IN THE WORD</p><h2 id="hh-verse-title">Verse of the Day</h2></div><p className="hh-verse-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
      {status === 'loading' ? <p className="hh-verse-loading" role="status">Loading today’s scripture…</p> : <>
        <blockquote><p>{verse.text}</p><cite>{verse.reference} <span>({verse.version})</span></cite></blockquote>
        <div className="hh-verse-actions"><a className="hh-button hh-primary" href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(verse.reference)}&version=${encodeURIComponent(verse.version)}`} target="_blank" rel="noopener noreferrer">Read in context <span aria-hidden="true">↗</span></a><button className="hh-button hh-secondary" onClick={share}>Share verse</button></div>
        <p className="hh-verse-source">{status === 'fallback' ? 'Today’s verse could not load. Showing a selected KJV scripture.' : status === 'cached' ? 'Showing today’s saved verse from Our Manna.' : 'Daily scripture provided by '} {status === 'ready' && <a href="https://www.ourmanna.com/" target="_blank" rel="noopener noreferrer">Our Manna</a>}{['cached', 'fallback'].includes(status) && <> <button onClick={() => setAttempt(value => value + 1)}>Try again</button></>}</p>
      </>}
      <p className="hh-share-message" role="status">{message}</p>
    </section>
  );
}
