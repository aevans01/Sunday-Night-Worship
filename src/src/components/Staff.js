import { Link } from 'react-router-dom';
import { Page, Notice, useList, ListStatus } from './PortalUI';
import { churchInfo as church } from './churchInfo';
import '../style/Welcome.css';
export default function Staff() {
  const list = useList('/staff');
  return <Page eyebrow="MEET OUR TEAM" title="People here to serve you." description="Meet the ministry and support team at Haven Heights Baptist Church." action={<Link className="portal-btn" to="/PlanVisit">Plan your visit ↗</Link>}>
    <ListStatus list={list}><div className="welcome-staff-grid">{list.items.map(person => <article className="welcome-staff-card" key={person.id}>
      <div className="welcome-staff-photo"><img src={person.photo || '/images/staff-placeholder.svg'} alt={person.photo ? person.name : ''} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/staff-placeholder.svg'; e.currentTarget.alt = ''; }} /></div>
      <div className="welcome-staff-copy"><h2>{person.name}</h2><p>{person.role}</p></div>
    </article>)}</div>{!list.loading && !list.error && !list.items.length && <Notice>Our team directory is being updated. Please contact the church office.</Notice>}</ListStatus>
    <section className="welcome-connect"><div><p className="portal-eyebrow">LET’S CONNECT</p><h2>We’d love to hear from you.</h2><p>Have a question or want to connect with someone on our team? Call the church office.</p></div><a className="portal-btn" href={church.phoneHref}>{church.phone}</a></section>
  </Page>;
}
