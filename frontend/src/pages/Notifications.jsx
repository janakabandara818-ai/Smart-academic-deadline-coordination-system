import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  Mail,
  MessageCircle,
  Settings2,
} from "lucide-react";
import { useApp } from "../context/useApp";
import { Badge, Card, EmptyState, Modal, PageHeading } from "../components/UI";

export function NotificationPreferences() {
  const { preferences, setPreferences } = useApp();
  return (
    <div className="preference-list">
      {[
        [
          "email",
          "Email alerts",
          "Receive important deadline changes by email.",
        ],
        [
          "deadlineUpdates",
          "Deadline updates",
          "Include newly created and rescheduled deadlines.",
        ],
        [
          "weeklySummary",
          "Weekly summary",
          "A weekly overview of upcoming academic workload.",
        ],
      ].map(([key, title, description]) => (
        <label className="preference-row" key={key}>
          <span>
            <strong>{title}</strong>
            <small>{description}</small>
          </span>
          <input
            type="checkbox"
            className="switch"
            checked={preferences[key]}
            onChange={(event) =>
              setPreferences({ ...preferences, [key]: event.target.checked })
            }
          />
        </label>
      ))}
    </div>
  );
}
export default function Notifications() {
  const { notifications, setNotifications, deadlines, notify } = useApp();
  const [filter, setFilter] = useState("All");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareId, setShareId] = useState(deadlines[0]?.id || "");
  const unread = notifications.filter((item) => !item.read).length;
  const filtered = notifications.filter(
    (item) =>
      filter === "All" ||
      (filter === "Unread" ? !item.read : item.category === filter),
  );
  const shared = deadlines.find((item) => item.id === shareId);
  const shareText = shared
    ? `SADCS deadline reminder: ${shared.moduleId} – ${shared.title}. Due ${shared.date} at ${shared.time} (Sri Lanka time). Demo workspace reminder.`
    : "";
  return (
    <>
      <PageHeading eyebrow="STAY IN THE LOOP" icon={Bell} title="Notifications">
        <button className="button" onClick={() => setPreferencesOpen(true)}>
          <Mail size={16} />
          Email preferences
        </button>
        <button className="button" onClick={() => setSharing(true)}>
          <MessageCircle size={16} />
          WhatsApp share
        </button>
      </PageHeading>
      <Card className="notifications-card">
        <div className="notifications-toolbar">
          <div className="filter-tabs">
            {["All", "Unread", "Deadlines", "Assignments", "System"].map(
              (tab) => (
                <button
                  key={tab}
                  className={filter === tab ? "active" : ""}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                  {tab === "All" && <span>{notifications.length}</span>}
                  {tab === "Unread" && <span>{unread}</span>}
                </button>
              ),
            )}
          </div>
          <button
            className="text-button"
            disabled={!unread}
            onClick={() => {
              setNotifications((items) =>
                items.map((item) => ({ ...item, read: true })),
              );
              notify("All notifications marked as read.");
            }}
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>
        <div className="notification-list">
          {filtered.length ? (
            filtered.map((item) => (
              <article
                className={`notification-item ${!item.read ? "unread" : ""}`}
                key={item.id}
              >
                <span
                  className={`notification-type ${item.category.toLowerCase()}`}
                >
                  {item.category === "Deadlines" ? (
                    <Bell size={21} />
                  ) : item.category === "Assignments" ? (
                    <CalendarDays size={21} />
                  ) : (
                    <Settings2 size={21} />
                  )}
                </span>
                <div className="notification-copy">
                  <div>
                    <h3>{item.title}</h3>
                    {!item.read && <Badge tone="green">New</Badge>}
                  </div>
                  <p>{item.message}</p>
                  <small>{item.time}</small>
                </div>
                <button
                  className="icon-button"
                  title={item.read ? "Mark as unread" : "Mark as read"}
                  aria-label={`${item.read ? "Mark as unread" : "Mark as read"}: ${item.title}`}
                  onClick={() =>
                    setNotifications((items) =>
                      items.map((n) =>
                        n.id === item.id ? { ...n, read: !n.read } : n,
                      ),
                    )
                  }
                >
                  {item.read ? <Mail size={18} /> : <Check size={18} />}
                </button>
              </article>
            ))
          ) : (
            <EmptyState
              title="You’re all caught up"
              description="There are no notifications in this category."
            />
          )}
        </div>
      </Card>
      <div className="notice">
        <Mail size={17} />
        <span>
          Demo notifications only. Email delivery is not connected. WhatsApp
          sharing opens a draft for you to review and send.
        </span>
      </div>
      {preferencesOpen && (
        <Modal
          title="Email notification preferences"
          onClose={() => setPreferencesOpen(false)}
        >
          <p className="helper">
            These preferences are saved for this demo session. No emails are
            sent.
          </p>
          <NotificationPreferences />
          <button
            className="button primary full"
            onClick={() => {
              setPreferencesOpen(false);
              notify(
                "Demo email preferences saved. Email delivery is not connected.",
              );
            }}
          >
            Save preferences
          </button>
        </Modal>
      )}
      {sharing && (
        <Modal
          title="Share a deadline on WhatsApp"
          onClose={() => setSharing(false)}
        >
          <label className="field-label">
            Choose a deadline
            <select
              value={shareId}
              onChange={(e) => setShareId(e.target.value)}
            >
              {deadlines.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.moduleId} – {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="share-preview">
            {shareText || "There are no deadlines to share."}
          </div>
          <p className="helper">
            Opens WhatsApp with this text. Choose your recipient and send it
            yourself; SADCS does not send a message automatically.
          </p>
          {shared && (
            <a
              className="button primary full"
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} />
              Open WhatsApp draft
            </a>
          )}
        </Modal>
      )}
    </>
  );
}
