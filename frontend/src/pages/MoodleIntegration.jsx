import { useState } from "react";
import { Check, CircleAlert, Link2, RefreshCw } from "lucide-react";
import { useApp } from "../context/useApp";
import { Badge, Card, PageHeading } from "../components/UI";

export default function MoodleIntegration() {
  const { notify } = useApp();
  const [url, setUrl] = useState("https://moodle.eng.ruh.ac.lk");
  const [options, setOptions] = useState({
    courses: true,
    deadlines: true,
    changes: true,
  });
  const [feedback, setFeedback] = useState(null);
  const [lastDemo, setLastDemo] = useState("");
  const simulate = (event) => {
    event.preventDefault();
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      setFeedback({
        error: true,
        message: "Enter a valid HTTPS Moodle server URL.",
      });
      return;
    }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
      setFeedback({
        error: true,
        message: "Use an HTTPS URL without usernames or passwords.",
      });
      return;
    }
    if (!Object.values(options).some(Boolean)) {
      setFeedback({
        error: true,
        message: "Select at least one synchronization option.",
      });
      return;
    }
    setLastDemo(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
      }),
    );
    setFeedback({
      error: false,
      message:
        "Demo sync check complete. Your options are valid. No Moodle request was made and no live data was imported.",
    });
    notify("Demo sync check complete. Moodle remains disconnected.");
  };

  return (
    <>
      <PageHeading
        icon={Link2}
        title="Moodle Integration"
        description="Connect to your Moodle LMS to sync assignment and course data."
      />
      <form className="moodle-layout" onSubmit={simulate}>
        <Card>
          <div className="moodle-brand-row">
            <span className="moodle-wordmark">
              m<span>oodle</span>
            </span>
            <Badge tone="caution">Not Connected – Demo Mode</Badge>
          </div>
          <label className="field-label">
            Moodle server URL
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setFeedback(null);
              }}
              required
              placeholder="https://your-moodle-server.edu"
            />
          </label>
          <div className="connection-details">
            <div>
              <span>Last live sync</span>
              <strong>Never</strong>
            </div>
            <div>
              <span>Sync status</span>
              <strong className="orange-text">Not connected</strong>
            </div>
            <div>
              <span>Data source</span>
              <strong>Local demo records</strong>
            </div>
            {lastDemo && (
              <div>
                <span>Last demo check (Sri Lanka)</span>
                <strong>{lastDemo}</strong>
              </div>
            )}
          </div>
        </Card>
        <Card title="Sync Options" className="sync-options-card">
          <div className="sync-options">
            {[
              ["courses", "Courses / Modules"],
              ["deadlines", "Assignments & Deadlines"],
              ["changes", "Updates (Changes)"],
            ].map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.checked })
                  }
                />
                <strong>{label}</strong>
              </label>
            ))}
          </div>
          <button className="button outline full" type="submit">
            <RefreshCw size={18} />
            Sync now · demo check
          </button>
          <p className="helper">
            Validates demo options only. No live Moodle request is made.
          </p>
        </Card>
        {feedback && (
          <div
            className={`feedback ${feedback.error ? "error" : "success"}`}
            role="status"
          >
            {feedback.error ? <CircleAlert size={19} /> : <Check size={19} />}
            <p>{feedback.message}</p>
          </div>
        )}
      </form>
    </>
  );
}
