import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function Header({ onMenu }) {
  const { role, setRole, notifications } = useApp();
  const navigate = useNavigate();
  const name =
    role === "Student"
      ? "S. Fernando"
      : role === "Admin"
        ? "Faculty Admin"
        : "Dr. Nimal Perera";
  return (
    <header className="topbar">
      <button
        className="icon-button mobile-menu"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Menu size={22} />
      </button>
      <div className="university-brand">
        <img
          className="university-logo"
          src="/images/ruhuna-logo.png"
          alt="University of Ruhuna logo"
        />
        <div>
          <strong>University of Ruhuna</strong>
          <span>Faculty of Engineering</span>
        </div>
      </div>
      <Link to="/" className="header-sadcs">
        <CalendarDays size={31} />
        <span>
          <strong>SADCS</strong>
          <small>Smart Academic Deadline Coordination System</small>
        </span>
      </Link>
      <div className="header-actions">
        <label className="role-select">
          <span className="sr-only">Demo role</span>
          <select
            value={role}
            title="Demo role switching only; not authentication"
            onChange={(event) => {
              setRole(event.target.value);
              navigate("/");
            }}
          >
            <option>Lecturer</option>
            <option>Student</option>
            <option>Admin</option>
          </select>
          <ChevronDown size={13} />
        </label>
        <Link
          to="/notifications"
          className="notification-button icon-button"
          aria-label={`${notifications.filter((item) => !item.read).length} unread notifications`}
        >
          <Bell size={20} />
          {notifications.some((item) => !item.read) && <i />}
        </Link>
        <div className="profile">
          <span className="profile-icon">
            <UserRound size={19} />
          </span>
          <strong>{name}</strong>
        </div>
      </div>
    </header>
  );
}
