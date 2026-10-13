import { useState } from "react";
import {
  Page,
  Panel,
  Empty,
  Notice,
  useList,
  ListStatus,
  api,
  errorText,
} from "./PortalUI";
export default function VisitorRequests() {
  const list = useList("/visitorRequests");
  const [busy, setBusy] = useState(null),
    [error, setError] = useState("");
  async function update(r, status) {
    setBusy(r.id);
    try {
      await api.put(`/visitorRequests/${r.id}`, { status });
      await list.reload();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(null);
    }
  }
  return (
    <Page
      eyebrow="CHURCH ADMINISTRATION"
      title="Welcome the next family."
      description="Private visitor contact requests and follow-up."
    >
      <Notice error>{error}</Notice>
      <ListStatus list={list}>
        <div className="portal-prayer-grid">
          {list.items.map((r) => (
            <Panel key={r.id} title={r.name}>
              <p>
                <a href={`mailto:${r.email}`}>{r.email}</a>
              </p>
              {r.phone && <p>{r.phone}</p>}
              <p>
                {r.visit_date
                  ? `Planned visit: ${r.visit_date.slice(0, 10)}`
                  : "Visit date not selected"}
              </p>
              <p>{r.message}</p>
              <p>Assigned to: {r.assignedName || "Unassigned"}</p>
              <label>
                Status{" "}
                <select
                  value={r.status}
                  disabled={busy !== null}
                  onChange={(e) => update(r, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="assigned">Assign to me</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </Panel>
          ))}
        </div>
        {!list.loading && !list.items.length && (
          <Empty title="No visitor requests yet">
            Requests from the Plan Your Visit page appear here.
          </Empty>
        )}
      </ListStatus>
    </Page>
  );
}
