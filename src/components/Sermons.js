import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Page,
  Panel,
  Empty,
  useList,
  ListStatus,
  Notice,
  Field,
  Confirm,
  api,
  errorText,
} from "./PortalUI";
const blank = {
  title: "",
  speaker: "",
  date: "",
  scripture: "",
  description: "",
  youtube: "",
};
export default function Sermons({ admin = false }) {
  const list = useList("/sermons");
  const [query, setQuery] = useState(""),
    [edit, setEdit] = useState(null),
    [form, setForm] = useState(blank),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [remove, setRemove] = useState(null),
    [message, setMessage] = useState("");
  const visible = list.items.filter((s) =>
    `${s.title} ${s.speaker} ${s.scripture}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm({ ...form, [k]: e.target.value }),
  });
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (edit.id) await api.put(`/manageSermons/${edit.id}`, form);
      else await api.post("/manageSermons", form);
      setEdit(null);
      await list.reload();
      setMessage("Sermon saved.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function destroy() {
    setBusy(true);
    try {
      await api.delete(`/manageSermons/${remove.id}`);
      setRemove(null);
      await list.reload();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      eyebrow={admin ? "CHURCH ADMINISTRATION" : "HEAR THE WORD"}
      title={admin ? "Share the message." : "Scripture for everyday life."}
      description="Watch messages from Haven Heights and explore Scripture together."
      action={
        admin ? (
          <button
            className="portal-btn"
            onClick={() => {
              setEdit({});
              setForm(blank);
              setError("");
            }}
          >
            + Add sermon
          </button>
        ) : (
          <Link className="portal-btn" to="/PlanVisit">
            Join us in person
          </Link>
        )
      }
    >
      <Notice>{message}</Notice>
      <Notice error>{error}</Notice>
      {edit && (
        <Panel title={edit.id ? "Edit sermon" : "Add a sermon"}>
          <form onSubmit={save}>
            <Field
              label="Title"
              id="sermon-title"
              required
              maxLength={200}
              {...field("title")}
            />
            <Field
              label="Speaker"
              id="sermon-speaker"
              required
              maxLength={150}
              {...field("speaker")}
            />
            <Field
              label="Date"
              id="sermon-date"
              type="date"
              required
              {...field("date")}
            />
            <Field
              label="Scripture reference"
              id="sermon-scripture"
              maxLength={255}
              {...field("scripture")}
            />
            <Field
              label="YouTube video link or ID"
              id="sermon-youtube"
              required
              maxLength={500}
              {...field("youtube")}
            />
            <Field
              as="textarea"
              label="Description"
              id="sermon-description"
              maxLength={4000}
              {...field("description")}
            />
            <button className="portal-btn" disabled={busy}>
              Save sermon
            </button>
            <button
              type="button"
              className="portal-btn secondary"
              disabled={busy}
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
          </form>
        </Panel>
      )}
      <div className="portal-toolbar">
        <input
          aria-label="Search sermons"
          placeholder="Search messages, speakers or Scripture…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ListStatus list={list}>
        {visible.length ? (
          <div className="portal-video-grid">
            {visible.map((s) => (
              <Panel key={s.id} title={s.title}>
                <a
                  href={`https://www.youtube.com/watch?v=${s.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{ width: "100%" }}
                    src={`https://i.ytimg.com/vi/${s.youtube_id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                </a>
                <p>
                  {s.speaker} · {s.sermon_date.slice(0, 10)}
                </p>
                <p>{s.scripture}</p>
                <p>{s.description}</p>
                <a
                  className="portal-btn secondary"
                  href={`https://www.youtube.com/watch?v=${s.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch message ↗
                </a>
                {admin && (
                  <div className="portal-toolbar">
                    <button
                      className="portal-link"
                      onClick={() => {
                        setEdit(s);
                        setForm({
                          title: s.title,
                          speaker: s.speaker,
                          date: s.sermon_date.slice(0, 10),
                          scripture: s.scripture,
                          description: s.description,
                          youtube: s.youtube_id,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="portal-link danger"
                      onClick={() => setRemove(s)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Panel>
            ))}
          </div>
        ) : (
          !list.loading && (
            <Empty title="Messages will appear here">
              {admin
                ? "Add your first sermon using its YouTube link."
                : "Join us in person or contact the church office for available messages."}
            </Empty>
          )
        )}
      </ListStatus>
      <Confirm
        show={!!remove}
        title="Delete this sermon?"
        busy={busy}
        onCancel={() => setRemove(null)}
        onConfirm={destroy}
      >
        Remove {remove?.title} from the sermon library? The YouTube video itself
        is not deleted.
      </Confirm>
    </Page>
  );
}
