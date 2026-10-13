import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Page,
  Panel,
  Empty,
  useList,
  ListStatus,
  Confirm,
  Notice,
  api,
  errorText,
} from "./PortalUI";
export default function ViewSongsAdmin() {
  const list = useList("/getSongs"),
    [q, setQ] = useState(""),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [editing, setEditing] = useState(null),
    [songName, setSongName] = useState(""),
    [artist, setArtist] = useState("");
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api.put(`/updateSong/${editing.id}`, {
        ...editing,
        SongName: songName,
        Artist: artist,
        VideoDescription: editing.VideoDescription || "",
      });
      setEditing(null);
      await list.reload();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    try {
      await api.delete(`/deleteSong/${selected.id}`);
      list.setItems((old) => old.filter((s) => s.id !== selected.id));
      setSelected(null);
      setMessage("Song deleted.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const visible = list.items.filter((s) =>
    String(s.SongName || s.VideoTitle || s.VideoTitleShortened || "")
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <Page
      eyebrow="CHURCH ADMINISTRATION"
      title="The songs we share."
      description="Browse your community’s current worship song submissions."
      action={
        <Link className="portal-btn" to="/SongSelector">
          Open song wheel ↗
        </Link>
      }
    >
      <div className="portal-toolbar">
        <span>{list.items.length} songs loaded</span>
        <input
          aria-label="Search songs"
          placeholder="Search song titles…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Notice>{message}</Notice>
      <Notice error>{error}</Notice>
      {editing && (
        <Panel title="Correct song identity">
          <label>
            Song name{" "}
            <input
              value={songName}
              maxLength={200}
              onChange={(e) => setSongName(e.target.value)}
            />
          </label>
          <label>
            Artist{" "}
            <input
              value={artist}
              maxLength={200}
              onChange={(e) => setArtist(e.target.value)}
            />
          </label>
          <button
            className="portal-btn"
            disabled={busy || !songName.trim()}
            onClick={save}
          >
            Save identity
          </button>
          <button
            className="portal-btn secondary"
            disabled={busy}
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
        </Panel>
      )}
      <ListStatus list={list}>
        <Panel className="portal-table-panel">
          {visible.length ? (
            <div className="portal-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Song</th>
                    <th>Watch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="portal-song-row">
                          {s.VideoImage && (
                            <img src={s.VideoImage} alt="" loading="lazy" />
                          )}
                          <strong>
                            {s.SongName ||
                              s.VideoTitle ||
                              s.VideoTitleShortened}
                          </strong>
                          <small>
                            {s.Artist ||
                              (!s.SongName ? "Song identity needs review" : "")}
                          </small>
                        </div>
                      </td>
                      <td>
                        <a
                          className="portal-link"
                          href={`https://www.youtube.com/watch?v=${encodeURIComponent(s.VideoSource)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch ↗
                        </a>
                      </td>
                      <td>
                        <button
                          className="portal-link"
                          onClick={() => {
                            setEditing(s);
                            setSongName(s.SongName || "");
                            setArtist(s.Artist || "");
                            setError("");
                          }}
                        >
                          Correct identity
                        </button>
                        <button
                          className="portal-link danger"
                          onClick={() => {
                            setError("");
                            setSelected(s);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !list.loading && (
              <Empty title="No songs in this view">
                Search for a different title or invite members to submit a song.
              </Empty>
            )
          )}
        </Panel>
      </ListStatus>
      <Confirm
        show={!!selected}
        title="Delete this song?"
        busy={busy}
        onCancel={() => {
          if (!busy) setSelected(null);
        }}
        onConfirm={remove}
      >
        Remove “{selected?.VideoTitle || selected?.VideoTitleShortened}” from
        the song list? This cannot be undone.<Notice error>{error}</Notice>
      </Confirm>
    </Page>
  );
}
