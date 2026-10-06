import { useEffect } from 'react';
import MainNavigation from './MainNavigation';
import { Link } from 'react-router-dom';
import '../style/Portal.css';
export default function Layout({
  children
}) {
  useEffect(() => {
    document.body.classList.add('portal-body');
    return () => document.body.classList.remove('portal-body');
  }, []);
  return <div className="portal-site"><a className="portal-skip" href="#main-content">Skip to content</a><MainNavigation /><main id="main-content" tabIndex={-1}>{children}</main><footer className="portal-footer"><div><strong>Haven Heights</strong><span>Baptist Church</span></div><p>Growing in faith. Connected in community.</p><Link to="/">Service times & today’s scripture ↗</Link></footer></div>;
}
