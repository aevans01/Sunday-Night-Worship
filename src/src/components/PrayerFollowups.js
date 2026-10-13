import { useState } from "react";
import {
  Page,
  Panel,
  Notice,
  Empty,
  Confirm,
  useList,
  ListStatus,
  api,
  errorText,
} from "./PortalUI";
export default function PrayerFollowups() {
  const list = useList("/prayerFollowups");
  const admins = useList("/prayerFollowups/admins");
  const [filter, setFilter] = useState("all"),
    [busy, setBusy] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(null),
    [message, setMessage] = useState("");
  async function update(row, status, assignedAdmin) {
    setBusy(row.id);
    setError("");
    try {
      await api.put(`/prayerFollowups/${row.id}`, { status, ...(assignedAdmin !== undefined ? {assignedAdmin} : {}) });
      await list.reload();
      setMessage("Follow-up status saved.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(null);
    }
  }
  async function resend() {
    setBusy(retry.id);
    setError("");
    try {
      await api.post(`/prayerFollowups/${retry.id}/retry`);
      setRetry(null);
      await list.reload();
      setMessage("Failed notifications queued for retry.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(null);
    }
  }
  return (
    <Page
      eyebrow="CHURCH ADMINISTRATION"
      title="No one walks alone."
      description="Private phone requests and follow-up for church administrators."
    >
      <Notice>{message}</Notice>
      <Notice error>{error}</Notice>
      <div className="portal-toolbar">
        <label>
          Follow-up status{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {["all", "new", "assigned", "contacted", "completed"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button className="portal-btn secondary" onClick={list.reload}>
          Refresh
        </button>
      </div>
      <ListStatus list={list}>
        <div className="portal-prayer-grid">
          {list.items
            .filter((r) => filter === "all" || r.careStatus === filter)
            .map((r) => (
              <Panel key={r.id} title={r.name}>
                <span className="portal-tag">{r.careStatus}</span>
                <p>{r.description}</p>
                <p>
                  <a href={`tel:${r.phone.replace(/[^+0-9]/g, "")}`}>
                    {r.phone}
                  </a>
                </p>
                <p>Assigned to: {r.assignedName || "Unassigned"}</p>
                <p>
                  <small>
                    {r.acceptedEmails} accepted by email provider ·{" "}
                    {r.pendingEmails} pending · {r.failedEmails} failed
                  </small>
                </p>
                {r.lastErrorCode && (
                  <p>
                    <small>
                      Last notification issue: {r.lastErrorCode}. Check
                      notification diagnostics or Brevo logs before retrying.
                    </small>
                  </p>
                )}
                <label>
                  Update status{" "}
                  <select
                    aria-label={`Status for ${r.name}`}
                    value={r.careStatus}
                    disabled={busy !== null}
                    onChange={(e) => update(r, e.target.value, e.target.value === "assigned" && r.assignedAdmin ? Number(r.assignedAdmin) : undefined)}
                  >
                    <option value="new">New / unassigned</option>
                    <option value="assigned">{r.assignedAdmin ? "Assigned" : "Assign to me"}</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <div className="portal-field">
                  <label htmlFor={`prayer-assignee-${r.id}`}>Assign to administrator</label>
                  <select id={`prayer-assignee-${r.id}`} aria-label={`Assign administrator for ${r.name}`} value={r.assignedAdmin || ""} disabled={busy !== null || admins.loading || !!admins.error} onChange={e => update(r, e.target.value ? "assigned" : "new", e.target.value ? Number(e.target.value) : undefined)}>
                    <option value="">Unassigned</option>
                    {r.assignedAdmin && !admins.items.some(a => Number(a.id) === Number(r.assignedAdmin)) && <option value={r.assignedAdmin}>{r.assignedName || "Previous administrator"} (no longer an admin)</option>}
                    {admins.items.map(a => <option key={a.id} value={a.id}>{a.name || a.username || `Administrator ${a.id}`}</option>)}
                  </select>
                  {admins.loading && <small>Loading administrators…</small>}
                  {admins.error && <Notice error>Could not load administrators. <button className="portal-link" onClick={admins.reload}>Try again</button></Notice>}
                </div>
                {Number(r.failedEmails) > 0 && (
                  <button
                    className="portal-btn secondary"
                    disabled={busy !== null}
                    onClick={() => setRetry(r)}
                  >
                    Retry failed emails
                  </button>
                )}
              </Panel>
            ))}
        </div>
        {!list.loading && !list.items.length && (
          <Empty title="No contact requests yet">
            Requests appear here when someone asks to be contacted for prayer.
          </Empty>
        )}
      </ListStatus>
      <Confirm
        show={!!retry}
        title="Retry failed notifications?"
        confirmLabel="Retry emails"
        busy={busy !== null}
        onCancel={() => setRetry(null)}
        onConfirm={resend}
      >
        This resends failed notifications for {retry?.name}. If an earlier
        attempt reached the provider but could not be recorded, recipients may
        receive another email.<Notice error>{error}</Notice>
      </Confirm>
    </Page>
  );
}
