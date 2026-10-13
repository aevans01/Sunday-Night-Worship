import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Field, Notice, ListStatus, useList, api, errorText } from './PortalUI';
function PositionEditor({person, saved}) {
  const [form, setForm] = useState({name:person.name,role:person.role,photo:person.photo || ''});
  const [busy,setBusy] = useState(false), [error,setError] = useState(''), [message,setMessage] = useState('');
  const change = key => e => {setForm(old => ({...old,[key]:e.target.value}));setMessage('');};
  async function submit(e) {
    e.preventDefault();setBusy(true);setError('');setMessage('');
    try {await api.put(`/manageStaff/${person.id}`,form);saved(person.id,form);setMessage('Position updated.');}
    catch(e) {setError(errorText(e));} finally {setBusy(false);}
  }
  return <Panel title={person.role}><form onSubmit={submit}>
    <Field id={`staff-name-${person.id}`} label="Name" value={form.name} onChange={change('name')} maxLength={100} required />
    <Field id={`staff-role-${person.id}`} label="Position" value={form.role} onChange={change('role')} maxLength={100} required />
    <Field id={`staff-photo-${person.id}`} label="Photo link" type="url" value={form.photo} onChange={change('photo')} maxLength={1000} help="Paste an HTTPS link to a photo. Leave blank for the default image." />
    <Notice error>{error}</Notice><Notice>{message}</Notice><button className="portal-btn" disabled={busy}>{busy ? 'Saving…' : 'Save position'}</button>
  </form></Panel>;
}
export default function ManageStaff() {
  const list=useList('/staff');
  const saved=(id,form)=>list.setItems(rows=>rows.map(row=>row.id===id?{...row,...form}:row));
  return <Page eyebrow="CHURCH ADMINISTRATION" title="Manage our team." description="Update each position independently. Changes appear in the public team directory." action={<Link className="portal-btn" to="/Staff">View directory ↗</Link>}><ListStatus list={list}><div className="portal-admin-grid">{list.items.map(person=><PositionEditor key={person.id} person={person} saved={saved}/>)}</div></ListStatus></Page>;
}
