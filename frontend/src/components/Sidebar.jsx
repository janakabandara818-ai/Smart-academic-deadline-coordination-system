import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  ChartNoAxesCombined,
  Bell,
  Plug,
  Users,
  Settings,
  Search,
  X,
} from "lucide-react";
import { useApp } from "../context/useApp";

export default function Sidebar({ open, onClose }) {
  const { role, notifications } = useApp();
  const unread = notifications.filter((item) => !item.read).length;
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/calendar", icon: CalendarDays, label: "Unified calendar" },
    ...(role !== "Student"
      ? [
          { to: "/planner", icon: CalendarPlus, label: "Deadline planner" },
          {
            to: "/analysis",
            icon: ChartNoAxesCombined,
            label: "Workload analysis",
          },
        ]
      : []),
    { to: "/notifications", icon: Bell, label: "Notifications", count: unread },
    ...(role !== "Student"
      ? [{ to: "/moodle", icon: Plug, label: "Moodle integration" }]
      : []),
    ...(role === "Admin"
      ? [{ to: "/admin", icon: Users, label: "Users & modules" }]
      : []),
    { to: "/settings", icon: Settings, label: "Settings" },
  ];
  return (
    <>
      {open && (
        <button
          className="sidebar-scrim"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Search size={19} />
          <strong>SADCS</strong>
          <button
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {links.map(({ to, icon: Icon, label, count }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {count > 0 && <span className="nav-count">{count}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
