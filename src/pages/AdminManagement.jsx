import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useApp } from "../context/useApp";
import { Badge, Card, EmptyState, Modal, PageHeading } from "../components/UI";

export default function AdminManagement() {
  const {
    users,
    setUsers,
    modules,
    setModules,
    deadlines,
    notify,
    systemSettings: settings,
    setSystemSettings: setSettings,
  } = useApp();
  const [tab, setTab] = useState("Users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");
  const isUsers = tab === "Users";
  const filtered = (isUsers ? users : modules).filter(
    (item) =>
      `${item.name} ${item.email || item.id}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!isUsers || roleFilter === "All" || item.role === roleFilter),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 5, currentPage * 5);
  const openEditor = (item) => {
    setError("");
    setEditing(
      item ||
        (isUsers
          ? { name: "", email: "", role: "Student", status: "Active" }
          : { id: "", name: "", lecturer: "", students: 0, isNew: true }),
    );
  };
  const save = (event) => {
    event.preventDefault();
    const name = editing.name.trim();
    if (!name) {
      setError("Please enter a name.");
      return;
    }
    if (isUsers) {
      const email = editing.email.trim().toLowerCase();
      if (
        users.some(
          (user) =>
            user.email.toLowerCase() === email && user.id !== editing.id,
        )
      ) {
        setError("A user with this email already exists.");
        return;
      }
      const item = {
        ...editing,
        name,
        email,
        id: editing.id || crypto.randomUUID(),
      };
      setUsers((items) =>
        editing.id
          ? items.map((user) => (user.id === item.id ? item : user))
          : [...items, item],
      );
    } else {
      const id = editing.id.trim().toUpperCase();
      if (!id) {
        setError("Please enter a module code.");
        return;
      }
      if (editing.isNew && modules.some((module) => module.id === id)) {
        setError("This module code already exists.");
        return;
      }
      const item = {
        id,
        name,
        lecturer: editing.lecturer.trim(),
        students: Number(editing.students),
      };
      setModules((items) =>
        editing.isNew
          ? [...items, item]
          : items.map((module) => (module.id === id ? item : module)),
      );
    }
    setEditing(null);
    notify(`${isUsers ? "User" : "Module"} saved in local demo state.`);
  };
  const remove = () => {
    if (!isUsers && deadlines.some((item) => item.moduleId === removing.id)) {
      setError(
        "This module has deadlines. Keep it until its deadlines have been reassigned by your backend.",
      );
      return;
    }
    if (isUsers)
      setUsers((items) => items.filter((item) => item.id !== removing.id));
    else setModules((items) => items.filter((item) => item.id !== removing.id));
    setRemoving(null);
    notify(`${isUsers ? "User" : "Module"} removed from the demo workspace.`);
  };
  return (
    <>
      <PageHeading
        eyebrow="FACULTY ADMINISTRATION"
        icon={Users}
        title="Manage Users & Modules"
      >
        {tab !== "System settings" && (
          <button className="button primary" onClick={() => openEditor()}>
            <Plus size={17} />
            Add {isUsers ? "user" : "module"}
          </button>
        )}
      </PageHeading>
      <Card className="management-card">
        <div className="admin-tabs">
          {["Users", "Modules", "System settings"].map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => {
                setTab(item);
                setSearch("");
                setPage(1);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "System settings" ? (
          <form
            className="system-settings"
            onSubmit={(e) => {
              e.preventDefault();
              notify("System settings saved for this demo session.");
            }}
          >
            <h2>Basic system settings</h2>
            <div className="form-row">
              <label>
                Academic year
                <input
                  value={settings.academicYear}
                  onChange={(e) =>
                    setSettings({ ...settings, academicYear: e.target.value })
                  }
                  required
                  maxLength={20}
                />
              </label>
              <label>
                Active semester
                <select
                  value={settings.semester}
                  onChange={(e) =>
                    setSettings({ ...settings, semester: e.target.value })
                  }
                >
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                </select>
              </label>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.reminders}
                onChange={(e) =>
                  setSettings({ ...settings, reminders: e.target.checked })
                }
              />
              Enable demo deadline reminders
            </label>
            <p className="helper">
              These local settings are for demonstration. Server configuration
              and automated reminders require backend integration.
            </p>
            <button className="button primary">Save system settings</button>
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={17} />
                <input
                  aria-label={`Search ${tab.toLowerCase()}`}
                  placeholder={`Search ${tab.toLowerCase()}…`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </label>
              {isUsers && (
                <select
                  aria-label="Filter users by role"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="All">All roles</option>
                  {["Lecturer", "Student", "Admin"].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {(isUsers
                      ? ["Name", "Email address", "Role", "Status", "Actions"]
                      : [
                          "Module",
                          "Module name",
                          "Lecturer",
                          "Students",
                          "Actions",
                        ]
                    ).map((title) => (
                      <th key={title}>{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr key={item.id}>
                      {isUsers ? (
                        <>
                          <td>
                            <div className="user-cell">
                              <span className="table-avatar" aria-hidden="true">
                                {item.name
                                  .replace(/^(Dr\.|Ms\.) /, "")
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                              <strong>{item.name}</strong>
                            </div>
                          </td>
                          <td>{item.email}</td>
                          <td>
                            <Badge
                              tone={
                                item.role === "Admin" ? "purple" : "neutral"
                              }
                            >
                              {item.role}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              tone={
                                item.status === "Active" ? "green" : "neutral"
                              }
                              dot
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <Badge tone="green">{item.id}</Badge>
                          </td>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td>{item.lecturer}</td>
                          <td>{item.students}</td>
                        </>
                      )}
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-button"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => openEditor(item)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button danger-button"
                            aria-label={`Delete ${item.name}`}
                            onClick={() => {
                              setError("");
                              setRemoving(item);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!visible.length && (
              <EmptyState
                title="No matches found"
                description="Try another search or filter."
              />
            )}
            <div className="pagination">
              <span>
                Showing {filtered.length ? (currentPage - 1) * 5 + 1 : 0}–
                {Math.min(currentPage * 5, filtered.length)} of{" "}
                {filtered.length} {tab.toLowerCase()}
              </span>
              <div>
                <button
                  className="icon-button"
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                    key={i}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="icon-button"
                  disabled={currentPage >= pages}
                  aria-label="Next page"
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
      {editing && (
        <Modal
          title={`${isUsers ? (editing.id ? "Edit user" : "Add user") : editing.isNew ? "Add module" : "Edit module"}`}
          onClose={() => setEditing(null)}
        >
          <form className="modal-form" onSubmit={save}>
            {isUsers ? (
              <>
                <label>
                  Full name
                  <input
                    autoFocus
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={editing.email}
                    onChange={(e) =>
                      setEditing({ ...editing, email: e.target.value })
                    }
                    required
                  />
                </label>
                <div className="form-row">
                  <label>
                    Role
                    <select
                      value={editing.role}
                      onChange={(e) =>
                        setEditing({ ...editing, role: e.target.value })
                      }
                    >
                      {["Student", "Lecturer", "Admin"].map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      value={editing.status}
                      onChange={(e) =>
                        setEditing({ ...editing, status: e.target.value })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                </div>
              </>
            ) : (
              <>
                <label>
                  Module code
                  <input
                    autoFocus
                    value={editing.id}
                    onChange={(e) =>
                      setEditing({ ...editing, id: e.target.value })
                    }
                    disabled={!editing.isNew}
                    pattern="[A-Za-z0-9-]+"
                    title="Letters, numbers, and hyphens only"
                    required
                    maxLength={15}
                  />
                </label>
                <label>
                  Module name
                  <input
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  Lecturer
                  <input
                    value={editing.lecturer}
                    onChange={(e) =>
                      setEditing({ ...editing, lecturer: e.target.value })
                    }
                    required
                    maxLength={80}
                  />
                </label>
                <label>
                  Enrolled students
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={editing.students}
                    onChange={(e) =>
                      setEditing({ ...editing, students: e.target.value })
                    }
                    required
                  />
                </label>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="helper">
              Saves to this demo session. No account is created externally.
            </p>
            <button className="button primary full" type="submit">
              Save {isUsers ? "user" : "module"}
            </button>
          </form>
        </Modal>
      )}
      {removing && (
        <Modal
          title={`Delete ${isUsers ? "user" : "module"}?`}
          onClose={() => setRemoving(null)}
        >
          <p>
            Remove <strong>{removing.name}</strong> from this demo workspace?
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button className="button" onClick={() => setRemoving(null)}>
              Cancel
            </button>
            <button className="button danger" onClick={remove}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
