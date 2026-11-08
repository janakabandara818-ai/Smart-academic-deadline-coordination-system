import { useState } from "react";
import { AppContext } from "./useApp";
import {
  initialDeadlines,
  initialModules,
  initialNotifications,
  initialUsers,
} from "../data/mockData";

export function AppProvider({ children }) {
  const [role, setRole] = useState("Lecturer");
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [modules, setModules] = useState(initialModules);
  const [users, setUsers] = useState(initialUsers);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [proposal, setProposal] = useState(null);
  const [preferences, setPreferences] = useState({
    email: true,
    deadlineUpdates: true,
    weeklySummary: false,
  });
  const [toast, setToast] = useState("");
  const [systemSettings, setSystemSettings] = useState({
    academicYear: "2026/2027",
    semester: "Semester 1",
    reminders: true,
  });
  const notify = (message) => setToast(message);
  const addDeadline = (draft) => {
    const deadline = {
      ...draft,
      id: `d-${crypto.randomUUID()}`,
      time: "23:59",
      source: "SADCS demo",
      description:
        "A locally coordinated deadline. This change is stored in this demo session only.",
    };
    setDeadlines((items) =>
      [...items, deadline].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setNotifications((items) => [
      {
        id: crypto.randomUUID(),
        title: "New deadline coordinated",
        message: `${draft.moduleId} · ${draft.title} is scheduled for ${draft.date}. Saved locally; no external messages were sent.`,
        category: "Deadlines",
        read: false,
        time: "Just now",
      },
      ...items,
    ]);
    setProposal(null);
    notify("Deadline confirmed in this demo workspace.");
  };
  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        deadlines,
        setDeadlines,
        modules,
        setModules,
        users,
        setUsers,
        notifications,
        setNotifications,
        proposal,
        setProposal,
        preferences,
        setPreferences,
        systemSettings,
        setSystemSettings,
        toast,
        setToast,
        notify,
        addDeadline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
