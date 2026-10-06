import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Avatar } from '../components/PortalUI';
export default function MainNavigation() {
  const {
    user,
    loading,
    logout
  } = useUser();
  const [expanded, setExpanded] = useState(false),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const close = () => setExpanded(false);
  const name = user?.firstName || user?.firstname || user?.username || 'Member';
  async function signout() {
    setBusy(true);
    setError('');
    try {
      await logout();
      close();
    } catch {
      setError('Could not sign out. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return <><Navbar expand="lg" expanded={expanded} onToggle={setExpanded} className="portal-nav"><div className="portal-nav-inner"><Navbar.Brand as={Link} to="/" onClick={close}><span className="portal-brand-mark" aria-hidden="true">H</span><span>Haven Heights<small>BAPTIST CHURCH</small></span></Navbar.Brand><Navbar.Toggle aria-controls="portal-navigation" /><Navbar.Collapse id="portal-navigation"><Nav className="portal-nav-links"><Nav.Link as={NavLink} to="/" end onClick={close}>Home</Nav.Link><NavDropdown title="Prayer" id="prayer-nav"><NavDropdown.Item as={Link} to="/ViewPrayerRequests" onClick={close}>Prayer requests</NavDropdown.Item><NavDropdown.Item as={Link} to="/CreatePrayerRequest" onClick={close}>Share a request</NavDropdown.Item></NavDropdown><Nav.Link as={NavLink} to="/SongPicker" onClick={close}>Songs</Nav.Link><Nav.Link as={NavLink} to="/Events" onClick={close}>Events</Nav.Link><Nav.Link as={NavLink} to="/PhotoAlbum" onClick={close}>Photos</Nav.Link>{String(user?.role) === '1' && <NavDropdown title="Admin" id="admin-nav"><NavDropdown.Item as={Link} to="/AdminDashboard" onClick={close}>Dashboard</NavDropdown.Item><NavDropdown.Item as={Link} to="/SongSelector" onClick={close}>Song wheel</NavDropdown.Item></NavDropdown>}</Nav><div className="portal-nav-account">{loading ? <span>Checking session…</span> : user ? <><Avatar name={name} /><NavDropdown title={name} id="account-nav"><NavDropdown.Item as={Link} to="/ViewProfile" onClick={close}>My profile</NavDropdown.Item><NavDropdown.Item as={Link} to="/UploadPhotos" onClick={close}>Upload photos</NavDropdown.Item><NavDropdown.Item onClick={signout} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'}</NavDropdown.Item></NavDropdown></> : <><Link className="portal-nav-login" to="/Login" onClick={close}>Sign in</Link><Link className="portal-btn" to="/Register" onClick={close}>Join our community</Link></>}</div></Navbar.Collapse></div></Navbar>{error && <div className="portal-nav-error" role="alert">{error}</div>}</>;
}
