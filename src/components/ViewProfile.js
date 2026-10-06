import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Page, Panel, Notice, Avatar, api, errorText } from './PortalUI';
export default function ViewProfile() {
  const {
    user,
    loading
  } = useUser();
  const [details, setDetails] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    if (user?.id) api.get(`/userById/${user.id}`).then(({
      data
    }) => live && setDetails(data)).catch(e => live && setError(errorText(e)));
    return () => {
      live = false;
    };
  }, [user?.id]);
  const name = details ? `${details.firstName} ${details.lastName}` : user?.username || 'Member';
  return <Page eyebrow="YOUR ACCOUNT" title="Your place in our community." description="Your account details and ways to stay connected.">{loading ? <p role="status">Checking your session…</p> : !user ? <Panel title="Sign in to see your profile"><Link className="portal-btn" to="/Login">Sign in</Link></Panel> : <><Notice error>{error}</Notice><div className="portal-profile-layout"><Panel className="portal-profile-summary"><Avatar name={name} /><h2>{name}</h2><p>@{details?.username || user.username}</p><span className="portal-tag">{String(user.role) === '1' ? 'Administrator' : 'Church member'}</span></Panel><Panel title="Account details" description="Need to update something? Ask a church administrator to update your member record.">{details ? <dl className="portal-profile-details">{[['Username', details.username], ['Email address', details.emailAddr], ['Phone number', details.phoneNum || 'Not provided']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : !error && <p role="status">Loading account details…</p>}<div className="portal-profile-links"><Link to="/Events">Browse events ↗</Link><Link to="/CreatePrayerRequest">Share a prayer request ↗</Link><Link to="/PhotoAlbum">Explore photos ↗</Link></div></Panel></div></>}</Page>;
}
