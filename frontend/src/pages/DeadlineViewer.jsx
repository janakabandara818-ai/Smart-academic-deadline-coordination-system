import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { useApp } from "../context/useApp";
import DeadlineList from "../components/DeadlineList";
import { Badge, Card, PageHeading } from "../components/UI";

export default function DeadlineViewer() {
  const { deadlines, modules } = useApp();
  const [moduleId, setModuleId] = useState("All");
  const filtered = deadlines.filter(
    (item) => moduleId === "All" || item.moduleId === moduleId,
  );

  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="Assignment Deadlines"
        description="Browse assignment deadlines across your modules."
      >
        <Badge tone="caution" dot>
          Sample data · Not connected to live Moodle
        </Badge>
      </PageHeading>
      <div className="filters-bar">
        <label className="inline-field">
          <span>Module</span>
          <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
            <option value="All">All modules</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.id} – {module.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Card title="Assignment deadlines">
        <p className="helper" role="status">
          {filtered.length} of {deadlines.length} sample deadlines · {moduleId === "All" ? "All modules" : moduleId}
        </p>
        <DeadlineList
          deadlines={filtered}
          emptyTitle={moduleId === "All" ? "No deadlines available" : "No deadlines for this module"}
          emptyDescription={deadlines.length === 0
            ? "There are no assignment deadlines in this sample dataset."
            : "Choose All modules or another module to see its deadlines."}
        />
      </Card>
    </>
  );
}
