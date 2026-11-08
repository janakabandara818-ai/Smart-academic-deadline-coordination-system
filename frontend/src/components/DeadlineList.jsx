import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderKanban,
  HelpCircle,
} from "lucide-react";
import {
  calculateWorkload,
  formatDate,
  parseDate,
} from "../utils/workloadCalculator";
import { typeColors } from "../data/mockData";
import { DeadlineDetails, EmptyState, RiskBadge } from "./UI";

const icons = {
  Assignment: FileText,
  Lab: FlaskConical,
  Project: FolderKanban,
  Quiz: HelpCircle,
};
export default function DeadlineList({
  deadlines,
  allDeadlines = deadlines,
  limit,
  showRisk = false,
}) {
  const [detail, setDetail] = useState(null);
  const visible = [...deadlines]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
  return (
    <>
      {visible.length ? (
        <div className="deadline-list">
          {visible.map((item) => {
            const Icon = icons[item.type] || FileText;
            return (
              <button
                key={item.id}
                className="deadline-row"
                onClick={() => setDetail(item)}
              >
                <span
                  className="deadline-type-icon"
                  style={{ "--type-color": typeColors[item.type] }}
                >
                  <Icon size={20} />
                </span>
                <span className="deadline-title">
                  <strong>
                    {item.moduleId} – {item.title}
                  </strong>
                  <small>
                    {item.type} · {item.complexity} complexity
                  </small>
                </span>
                {showRisk && (
                  <RiskBadge
                    score={calculateWorkload(item, allDeadlines).score}
                  />
                )}
                <span className="deadline-date">
                  <CalendarDays size={13} />
                  {formatDate(item.date, { year: undefined })}
                  <small>
                    {parseDate(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}{" "}
                    · {item.time}
                  </small>
                </span>
                <ChevronRight size={16} className="row-chevron" />
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
      {detail && (
        <DeadlineDetails deadline={detail} onClose={() => setDetail(null)} />
      )}
    </>
  );
}
