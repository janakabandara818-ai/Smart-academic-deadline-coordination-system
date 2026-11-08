import { useState } from "react";
import { CalendarDays, Info } from "lucide-react";
import { useApp } from "../context/useApp";
import { typeColors } from "../data/mockData";
import { formatDate } from "../utils/workloadCalculator";
import DeadlineCalendar from "../components/DeadlineCalendar";
import DeadlineList from "../components/DeadlineList";
import { Badge, Card, PageHeading } from "../components/UI";

export default function UnifiedCalendar() {
  const { deadlines, modules } = useApp();
  const [moduleId, setModuleId] = useState("All");
  const [selected, setSelected] = useState("2026-11-14");
  const filtered = deadlines.filter(
    (item) => moduleId === "All" || item.moduleId === moduleId,
  );
  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="Unified Deadline Calendar"
        description="View all assignment deadlines from Moodle in one place."
      >
        <div className="sync-heading">
          <Badge tone="caution" dot>
            Demo Data – Not Connected
          </Badge>
          <small>Last live sync: Never</small>
        </div>
      </PageHeading>
      <div className="filters-bar">
        <label className="inline-field">
          <span>Module</span>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
          >
            <option value="All">All modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} – {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="calendar-layout">
        <Card className="main-calendar-card">
          <DeadlineCalendar
            deadlines={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        </Card>
        <div className="calendar-detail-column">
          <Card className="calendar-legend-card">
            <div className="calendar-legend">
              {Object.entries(typeColors).map(([type, color]) => (
                <span key={type}>
                  <i style={{ background: color }} />
                  {type}
                </span>
              ))}
            </div>
            <div className="calendar-sync">
              <Info size={16} />
              <span>Moodle demo data</span>
            </div>
          </Card>
          <Card
            title={formatDate(selected, { weekday: "short", year: undefined })}
            subtitle="Selected date"
          >
            <DeadlineList
              deadlines={filtered.filter((item) => item.date === selected)}
              allDeadlines={deadlines}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
