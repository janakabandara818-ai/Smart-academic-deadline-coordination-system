import { Check, Info, Settings2 } from "lucide-react";
import { useApp } from "../context/useApp";
import { Badge, Card, PageHeading } from "../components/UI";
import { NotificationPreferences } from "./Notifications";

export default function Settings() {
  const { role, notify } = useApp();
  return (
    <>
      <PageHeading
        eyebrow="MAKE YOUR WORKSPACE YOURS"
        title="Workspace settings"
        icon={Settings2}
        description="Manage your preferences for a more focused academic week."
      />
      <div className="settings-layout">
        <Card
          title="Notification preferences"
          subtitle="Choose which updates you’d like to receive."
        >
          <NotificationPreferences />
          <div className="notice">
            <Info size={17} />
            <span>
              Preferences last for this demo session. Email delivery requires a
              backend service.
            </span>
          </div>
          <button
            className="button primary"
            onClick={() =>
              notify("Your demo preferences have been saved for this session.")
            }
          >
            <Check size={17} />
            Save preferences
          </button>
        </Card>
        <Card
          title="Workspace information"
          subtitle="About your current demo environment."
        >
          <div className="connection-details">
            <div>
              <span>Selected role</span>
              <Badge tone="green">{role}</Badge>
            </div>
            <div>
              <span>Academic year</span>
              <strong>2026 / 2027</strong>
            </div>
            <div>
              <span>Timezone</span>
              <strong>Asia / Colombo</strong>
            </div>
            <div>
              <span>Environment</span>
              <strong>Local demonstration</strong>
            </div>
            <div>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>
          </div>
          <p className="helper">
            <Settings2 size={15} /> The role selector is for frontend
            demonstration only. It is not secure authentication.
          </p>
        </Card>
      </div>
    </>
  );
}
