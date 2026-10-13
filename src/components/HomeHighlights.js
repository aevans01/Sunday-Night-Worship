import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./PortalUI";
export default function HomeHighlights() {
  const [events, setEvents] = useState([]),
    [sermon, setSermon] = useState(null);
  useEffect(() => {
    let active = true;
    api
      .get("/getEvents", { params: { upcoming: "true", limit: 3 } })
      .then(({ data }) => {
        if (active) setEvents(data);
      })
      .catch(() => {});
    api
      .get("/sermons", { params: { limit: 1 } })
      .then(({ data }) => {
        if (active) setSermon(data[0] || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!events.length && !sermon) return null;
  return (
    <section className="hh-shell hh-community" aria-labelledby="hh-next-title">
      <div className="hh-section-heading">
        <div>
          <p className="hh-eyebrow">YOUR NEXT STEP</p>
          <h2 id="hh-next-title">Stay connected.</h2>
        </div>
        <Link className="hh-text-link" to="/Events">
          All events ↗
        </Link>
      </div>
      <div className="hh-highlights">
        {sermon && (
          <article>
            <p className="hh-eyebrow">LATEST MESSAGE</p>
            <h3>{sermon.title}</h3>
            <p>
              {sermon.speaker} · {sermon.sermon_date}
            </p>
            <Link className="hh-button hh-secondary" to="/Sermons">
              Watch the message ↗
            </Link>
          </article>
        )}
        {events.map((e) => (
          <article key={e.id}>
            <p className="hh-eyebrow">COMING UP · {e.Date.slice(0, 10)}</p>
            <h3>{e.Title}</h3>
            <p>{e.Location}</p>
            <Link className="hh-button hh-secondary" to="/Events">
              Event details ↗
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
