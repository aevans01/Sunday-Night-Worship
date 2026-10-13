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
  const [filter, setFilter] = useState("all"),
    [busy, setBusy] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(null),
    [message, setMessage] = useState("");
  async function update(row, status) {
    setBusy(row.id);
    setError("");
    try {
      await api.put(`/prayerFollowups/${row.id}`, { status });
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
                    onChange={(e) => update(r, e.target.value)}
                  >
                    <option value="new">New / unassigned</option>
                    <option value="assigned">Assign to me</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
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
