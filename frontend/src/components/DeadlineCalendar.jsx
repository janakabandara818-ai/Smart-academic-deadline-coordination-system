import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEMO_TODAY, typeColors } from "../data/mockData";
import {
  addDays,
  dateKey,
  formatDate,
  parseDate,
} from "../utils/workloadCalculator";
import { DeadlineDetails, EmptyState } from "./UI";

export default function DeadlineCalendar({
  deadlines,
  compact = false,
  onSelect,
  selected: externalSelected,
}) {
  const [month, setMonth] = useState(new Date(2026, 10, 1, 12));
  const [view, setView] = useState("Month");
  const [internalSelected, setInternalSelected] = useState("2026-11-14");
  const [detail, setDetail] = useState(null);
  const selected = externalSelected || internalSelected;
  const choose = (date) => {
    setInternalSelected(date);
    onSelect?.(date);
  };
  const move = (step) => {
    if (view === "Week") {
      const next = addDays(selected, step * 7);
      choose(next);
      setMonth(
        new Date(
          parseDate(next).getFullYear(),
          parseDate(next).getMonth(),
          1,
          12,
        ),
      );
    } else
      setMonth(new Date(month.getFullYear(), month.getMonth() + step, 1, 12));
  };
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const start = new Date(firstDay);
  start.setDate(start.getDate() - start.getDay());
  const days = Array.from(
    {
      length:
        35 +
        (new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() +
          firstDay.getDay() >
        35
          ? 7
          : 0),
    },
    (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    },
  );
  const selectedDate = parseDate(selected);
  const weekStart = addDays(selected, -selectedDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    parseDate(addDays(weekStart, i)),
  );
  const visibleDays = view === "Week" ? weekDays : days;
  const monthDeadlines = deadlines
    .filter(
      (item) =>
        parseDate(item.date).getMonth() === month.getMonth() &&
        parseDate(item.date).getFullYear() === month.getFullYear(),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className={`deadline-calendar ${compact ? "compact-calendar" : ""}`}>
      <div className="calendar-toolbar">
        <div className="calendar-date-navigation">
          <button
            className="icon-button"
            aria-label={view === "Week" ? "Previous week" : "Previous month"}
            onClick={() => move(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <strong>
            {view === "Week"
              ? `${formatDate(weekStart, { year: undefined })} – ${formatDate(addDays(weekStart, 6), { year: undefined })}`
              : month.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
          </strong>
          <button
            className="icon-button"
            aria-label={view === "Week" ? "Next week" : "Next month"}
            onClick={() => move(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {!compact && (
          <div className="calendar-view-controls">
            <button
              className="button small today-button"
              onClick={() => {
                setMonth(new Date(2026, 10, 1, 12));
                choose(DEMO_TODAY);
              }}
            >
              Demo today
            </button>
            <div className="segmented" aria-label="Calendar view">
              {["Month", "Week", "List"].map((mode) => (
                <button
                  key={mode}
                  aria-pressed={view === mode}
                  className={view === mode ? "selected" : ""}
                  onClick={() => {
                    if (
                      mode === "Week" &&
                      (selectedDate.getMonth() !== month.getMonth() ||
                        selectedDate.getFullYear() !== month.getFullYear())
                    ) {
                      choose(dateKey(firstDay));
                    }
                    setView(mode);
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {view === "List" ? (
        <div className="calendar-agenda">
          {monthDeadlines.length ? (
            monthDeadlines.map((item) => (
              <button
                key={item.id}
                className="agenda-row"
                onClick={() => setDetail(item)}
              >
                <span className="agenda-date">
                  <strong>{parseDate(item.date).getDate()}</strong>
                  {parseDate(item.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <i
                  className="type-dot"
                  style={{ background: typeColors[item.type] }}
                />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.moduleId} · {item.type}
                  </small>
                </span>
                <span className="agenda-time">{item.time}</span>
                <ChevronRight size={16} />
              </button>
            ))
          ) : (
            <EmptyState
              title="A clear month"
              description="No deadlines match this month and module."
            />
          )}
        </div>
      ) : (
        <>
          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{compact ? day.slice(0, 1) : day}</span>
            ))}
          </div>
          <div
            className={`calendar-grid ${view === "Week" ? "week-grid" : ""}`}
          >
            {visibleDays.map((day) => {
              const key = dateKey(day);
              const events = deadlines.filter((item) => item.date === key);
              return (
                <button
                  key={key}
                  className={`calendar-day ${day.getMonth() !== month.getMonth() ? "outside-month" : ""} ${selected === key ? "date-selected" : ""} ${key === DEMO_TODAY ? "demo-today" : ""}`}
                  onClick={() => choose(key)}
                  aria-label={`${formatDate(key, { weekday: "long" })}, ${events.length} deadlines`}
                  aria-pressed={selected === key}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <div className="calendar-events">
                    {events.slice(0, compact ? 3 : 2).map((item) =>
                      compact ? (
                        <i
                          key={item.id}
                          style={{ background: typeColors[item.type] }}
                        />
                      ) : (
                        <span
                          key={item.id}
                          className="calendar-event"
                          style={{ "--event-color": typeColors[item.type] }}
                        >
                          <i />
                          {item.moduleId}
                          <span>{item.title}</span>
                        </span>
                      ),
                    )}
                    {events.length > 2 && !compact && (
                      <small>+{events.length - 2} more</small>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
      {detail && (
        <DeadlineDetails deadline={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
