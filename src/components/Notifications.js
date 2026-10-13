import { useState } from "react";
import {
  Page,
  Panel,
  Notice,
  Confirm,
  useList,
  ListStatus,
  api,
  errorText,
} from "./PortalUI";
const explanations = {
  EMAIL_HTTP_401: "Brevo API key was rejected.",
  EMAIL_HTTP_403: "Brevo permissions or account access were rejected.",
  EMAIL_HTTP_400:
    "Brevo rejected the sender or message. Check the verified sender and provider logs.",
  EMAIL_HTTP_429: "Brevo rate limit or sending quota was reached.",
  EMAIL_NETWORK_OR_TIMEOUT:
    "The provider could not be reached or the request timed out.",
  RETRY_LIMIT: "Automatic retries stopped.",
};
export default function Notifications() {
  const list = useList("/notifications");
  const [retry, setRetry] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function send() {
    setBusy(true);
    try {
      await api.post(`/notifications/${retry.id}/retry`);
      setRetry(null);
      await list.reload();
      setMessage("Notification queued for another attempt.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      eyebrow="CHURCH ADMINISTRATION"
      title="Keep communication moving."
      description="Event and visitor notification status. Accepted means the email provider accepted the request, not confirmed inbox delivery."
    >
      <Notice>{message}</Notice>
      <Notice error>{error}</Notice>
      <button className="portal-btn secondary" onClick={list.reload}>
        Refresh status
      </button>
      <ListStatus list={list}>
        <Panel className="portal-table-panel">
          <div className="portal-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Issue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.subject}
                      <small>{n.kind}</small>
                    </td>
                    <td>{n.recipient}</td>
                    <td>
                      {n.status === "sent" ? "Accepted" : n.status} ·{" "}
                      {n.attempts} attempts
                    </td>
                    <td>
                      {explanations[n.last_error_code] ||
                        n.last_error_code ||
                        "—"}
                    </td>
                    <td>
                      {n.status === "failed" && (
                        <button
                          className="portal-link"
                          onClick={() => {
                            setRetry(n);
                            setError("");
                          }}
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </ListStatus>
      <Confirm
        show={!!retry}
        title="Retry this notification?"
        confirmLabel="Retry email"
        busy={busy}
        onCancel={() => setRetry(null)}
        onConfirm={send}
      >
        Retry {retry?.subject}? If an earlier attempt was accepted but could not
        be recorded, this could send another copy.<Notice error>{error}</Notice>
      </Confirm>
    </Page>
  );
}
