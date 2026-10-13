import { Link } from "react-router-dom";
import { useState } from "react";
import { Panel, Field, Notice, api, errorText } from "./PortalUI";
const blank = {
  name: "",
  email: "",
  phone: "",
  visitDate: "",
  message: "",
  consent: false,
};
export default function VisitorContact() {
  const [form, setForm] = useState(blank),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm({ ...form, [k]: e.target.value }),
  });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/planVisit", form);
      setDone(true);
      setForm(blank);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel
      title="Let us help you plan your visit"
      description="An optional private request to connect with our church team. No account needed."
    >
      <Notice error>{error}</Notice>
      {done ? (
        <Notice>
          Your request has been received. The church team will follow up using
          the contact information you provided.
        </Notice>
      ) : (
        <form onSubmit={submit}>
          <Field
            label="Your name"
            id="visitor-name"
            required
            maxLength={100}
            autoComplete="name"
            {...field("name")}
          />
          <Field
            label="Email"
            id="visitor-email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            {...field("email")}
          />
          <Field
            label="Phone (optional)"
            id="visitor-phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            {...field("phone")}
          />
          <Field
            label="When would you like to visit? (optional)"
            id="visitor-date"
            type="date"
            {...field("visitDate")}
          />
          <Field
            label="How can we help? (optional)"
            id="visitor-message"
            as="textarea"
            maxLength={2000}
            {...field("message")}
          />
          <label>
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            />{" "}
            I agree to share these details with church administrators and be
            contacted about this request.
          </label>
          <p>
            <Link to="/Privacy">How your information is used</Link>
          </p>
          <p>
            <button className="portal-btn" disabled={busy}>
              {busy ? "Sending…" : "Send private request →"}
            </button>
          </p>
        </form>
      )}
    </Panel>
  );
}
