import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import '../style/SiteTheme.css';

const pages = {
  '/login': ['YOUR ACCOUNT', 'Welcome back.', 'Sign in to stay connected with your church community.', 'account'],
  '/register': ['YOUR ACCOUNT', 'A place for you.', 'Create your account and connect with Haven Heights.', 'account'],
  '/viewprofile': ['YOUR ACCOUNT', 'Your profile.', 'Your account details, all in one place.', 'profile'],
  '/editprofile': ['YOUR ACCOUNT', 'Update your profile.', 'Keep your contact information up to date.', 'profile'],
  '/viewprayerrequests': ['PRAYER & COMMUNITY', 'Praying together.', 'Bring our church family’s requests before God.', 'prayer-list'],
  '/createprayerrequest': ['PRAYER & COMMUNITY', 'Let us pray with you.', 'Share a request with your church community.', 'prayer-form'],
  '/events': ['LIFE AT HAVEN HEIGHTS', 'Gather. Connect. Grow.', 'Explore upcoming gatherings and church events.', 'events'],
  '/createevent': ['CHURCH ADMINISTRATION', 'Create an event.', 'Prepare the details for your next church gathering.', 'event-form'],
  '/uploadphotos': ['OUR COMMUNITY', 'Share a memory.', 'Add photos from life at Haven Heights.', 'photo-upload'],
  '/photoalbum': ['OUR COMMUNITY', 'Memories worth keeping.', 'Browse moments of fellowship, worship, and friendship.', 'photos'],
  '/songpicker': ['WORSHIP TOGETHER', 'Find your next song.', 'Search for music to share with our church family.', 'song-picker'],
  '/songselector': ['WORSHIP TOGETHER', 'Let the music begin.', 'Choose from the songs submitted by our community.', 'song-wheel'],
  '/admindashboard': ['CHURCH ADMINISTRATION', 'Care for your community.', 'Manage songs, prayer requests, members, and events.', 'admin-dashboard'],
  '/viewsongsadmin': ['CHURCH ADMINISTRATION', 'Song submissions.', 'Review the music shared by your church community.', 'admin-table'],
  '/viewpradmin': ['CHURCH ADMINISTRATION', 'Prayer requests.', 'Review and manage submitted prayer requests.', 'admin-table'],
  '/viewusersadmin': ['CHURCH ADMINISTRATION', 'Church members.', 'Manage member details and account roles.', 'admin-table'],
  '/vieweventsadmin': ['CHURCH ADMINISTRATION', 'Church events.', 'Review your gatherings and event registrations.', 'events-admin'],
  '/viewattendees': ['CHURCH ADMINISTRATION', 'Event attendees.', 'Review registrations for your church gathering.', 'admin-table'],
};

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const path = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const home = path === '/';
  const page = pages[path] || ['HAVEN HEIGHTS', 'Welcome to Haven Heights.', 'Connect with your church community.', 'general'];
  useEffect(() => {
    document.body.classList.add('hh-site-theme');
    return () => document.body.classList.remove('hh-site-theme');
  }, []);
  return (
    <div className="layoutContainer hh-site">
      <a className="hh-skip-link" href="#hh-main">Skip to content</a>
      <MainNavigation />
      <main id="hh-main" tabIndex={-1} className={home ? 'hh-main-home' : `hh-page hh-page-${page[3]}`}>
        {home ? children : <>
          <header className="hh-page-heading">
            <nav aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> / </span><span>{page[0] === 'CHURCH ADMINISTRATION' ? 'Administration' : page[0] === 'YOUR ACCOUNT' ? 'Account' : 'Community'}</span></nav>
            <p className="hh-page-eyebrow">{page[0]}</p>
            <h1>{page[1]}</h1>
            <p className="hh-page-description">{page[2]}</p>
          </header>
          <div className="hh-page-content">{children}</div>
        </>}
      </main>
      {!home && <footer className="hh-site-footer"><span>Haven Heights Baptist Church</span><Link to="/">Service times &amp; today’s scripture <span aria-hidden="true">↗</span></Link></footer>}
    </div>
  );
}
