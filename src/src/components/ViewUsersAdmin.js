import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Page, Panel, Field, Notice, Empty, Avatar, Confirm, useList, ListStatus, api, errorText } from './PortalUI';
export default function ViewUsersAdmin() {
  const list = useList('/getUsers');
  const [q, setQ] = useState(''),
    [editing, setEditing] = useState(null),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const visible = list.items.filter(u => `${u.firstName} ${u.lastName} ${u.username} ${u.emailAddr}`.toLowerCase().includes(q.toLowerCase()));
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.put(`/updateUser/${editing.id}`, editing);
      list.setItems(old => old.map(u => u.id === editing.id ? {
        ...u,
        ...editing,
        password: undefined
      } : u));
      setEditing(null);
      setMessage('Member details updated.');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    try {
      await api.delete(`/deleteUser/${deleting.id}`);
      list.setItems(old => old.filter(u => u.id !== deleting.id));
      setDeleting(null);
      setMessage('Member removed.');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return <Page eyebrow="CHURCH ADMINISTRATION" title="Your church family." description="Manage member details and account access."><Notice>{message}</Notice><div className="portal-toolbar"><span>{list.items.length} members loaded</span><input aria-label="Search members" placeholder="Search names, usernames, or email…" value={q} onChange={e => setQ(e.target.value)} /></div><ListStatus list={list}><Panel className="portal-table-panel">{visible.length ? <div className="portal-table-scroll"><table><thead><tr><th>Member</th><th>Contact</th><th>Access</th><th>Actions</th></tr></thead><tbody>{visible.map(u => <tr key={u.id}><td><div className="portal-member"><Avatar name={u.firstName || u.username} /><div><strong>{u.firstName} {u.lastName}</strong><small>@{u.username}</small></div></div></td><td>{u.emailAddr}<small className="portal-cell-note">{u.phoneNum || 'No phone number'}</small></td><td><span className="portal-tag">{String(u.Admin) === '1' ? 'Administrator' : 'Member'}</span></td><td><div className="portal-row-actions"><button className="portal-link" onClick={() => {
                      setError('');
                      setEditing({
                        ...u,
                        password: ''
                      });
                    }}>Edit</button><button className="portal-link danger" onClick={() => {
                      setError('');
                      setDeleting(u);
                    }}>Delete</button></div></td></tr>)}</tbody></table></div> : !list.loading && <Empty title="No matching members">Try a different search.</Empty>}</Panel></ListStatus><Modal show={!!editing} onHide={() => !busy && setEditing(null)} centered size="lg"><Modal.Header><Modal.Title>Edit member details</Modal.Title></Modal.Header><Modal.Body>{editing && <form id="edit-member" onSubmit={save}><Notice error>{error}</Notice><div className="portal-form-grid">{[['firstName', 'First name'], ['lastName', 'Last name'], ['username', 'Username'], ['emailAddr', 'Email address'], ['phoneNum', 'Phone number']].map(([key, label]) => <Field key={key} id={`edit-${key}`} label={label} required={key !== 'phoneNum'} type={key === 'emailAddr' ? 'email' : 'text'} value={editing[key] || ''} onChange={e => setEditing({
              ...editing,
              [key]: e.target.value
            })} />)}</div><Field as="select" id="edit-role" label="Account access" value={String(editing.Admin)} onChange={e => setEditing({
            ...editing,
            Admin: e.target.value
          })}><option value="0">Member</option><option value="1">Administrator</option></Field><Field id="edit-password" label="New password (optional)" type="password" minLength={12} maxLength={72} autoComplete="new-password" value={editing.password} onChange={e => setEditing({
            ...editing,
            password: e.target.value
          })} help="Leave blank to keep the current password. A password change signs this member out." /></form>}</Modal.Body><Modal.Footer><button className="portal-btn secondary" disabled={busy} onClick={() => setEditing(null)}>Cancel</button><button className="portal-btn" form="edit-member" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></Modal.Footer></Modal><Confirm show={!!deleting} title="Delete this member?" onCancel={() => setDeleting(null)} onConfirm={remove} busy={busy}>Permanently remove {deleting?.username} from the member list.<Notice error>{error}</Notice></Confirm></Page>;
}
