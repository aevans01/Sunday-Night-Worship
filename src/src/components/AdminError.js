import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Page, Panel } from './PortalUI';
export default function AdminError() {
  const denied = useLocation().pathname.toLowerCase() === '/adminerror';
  return <Page title={denied ? 'This area is for administrators.' : 'We couldn’t find that page.'} description={denied ? 'Your account does not have access to this part of the site.' : 'The link may have changed. Let’s get you back to your church community.'}><Panel className="portal-error-panel"><span aria-hidden="true">{denied ? '↗' : '404'}</span><h2>{denied ? 'Looking for something else?' : 'A fresh start.'}</h2><p>You can find events, prayer requests, and today’s scripture from the home page.</p><Link className="portal-btn" to="/">Return home →</Link></Panel></Page>;
}
