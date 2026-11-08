import { useState } from "react";
import { CalendarDays, TriangleAlert } from "lucide-react";
import { useApp } from "../context/useApp";
import { calculateWorkload } from "../utils/workloadCalculator";
import { DEMO_TODAY } from "../data/mockData";
import DeadlineCalendar from "../components/DeadlineCalendar";
import DeadlineList from "../components/DeadlineList";
import { Card, PageHeading } from "../components/UI";

export default function StudentDashboard() {
  const { deadlines, modules } = useApp();
  const [moduleId, setModuleId] = useState("All");
  const [filter, setFilter] = useState("Upcoming");
  const [selected, setSelected] = useState(null);
  const filtered = deadlines.filter(
    (item) =>
      (moduleId === "All" || moduleId === item.moduleId) &&
      (filter !== "Upcoming" || item.date >= DEMO_TODAY),
  );
  const conflicts = filtered.filter(
    (item) => calculateWorkload(item, deadlines).level === "Conflict",
  ).length;

  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="My Deadlines"
        description="View your upcoming assignments and manage your academic time."
      />
      <div className="student-toolbar">
        <label className="inline-field">
          <span>Module</span>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
          >
            <option value="All">All modules</option>
            {modules.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} – {item.name}
              </option>
            ))}
          </select>
        </label>
        <span className="student-alert">
          <TriangleAlert size={15} />
          {conflicts} workload {conflicts === 1 ? "alert" : "alerts"}
        </span>
      </div>
      <div className="student-layout">
        <Card className="student-calendar-card">
          <DeadlineCalendar
            compact
            deadlines={filtered}
            onSelect={setSelected}
          />
          {selected && (
            <button
              className="text-button clear-date"
              onClick={() => setSelected(null)}
            >
              Clear date
            </button>
          )}
        </Card>
        <div className="student-deadlines">
          <div className="segmented">
            {["Upcoming", "All"].map((option) => (
              <button
                key={option}
                className={filter === option ? "selected" : ""}
                onClick={() => {
                  setFilter(option);
                  setSelected(null);
                }}
              >
                {option}
                {option === "Upcoming" && ` (${filtered.length})`}
              </button>
            ))}
          </div>
          <Card>
            <DeadlineList
              showRisk
              deadlines={
                selected
                  ? filtered.filter((item) => item.date === selected)
                  : filtered
              }
              allDeadlines={deadlines}
            />
          </Card>
        </div>
      </div>
      <p className="helper student-demo-note">
        Demo cohort · Dates and workload indicators use sample records.
      </p>
    </>
  );
}
