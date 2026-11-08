import { useState } from "react";
import { ArrowLeft, CalendarDays, Check, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import {
  calculateWorkload,
  formatDate,
  suggestDates,
} from "../utils/workloadCalculator";
import { sampleProposal } from "../data/mockData";
import { Badge, EmptyState, PageHeading } from "../components/UI";

export default function SmartSuggestions() {
  const { proposal, deadlines, addDeadline } = useApp();
  const navigate = useNavigate();
  const draft = proposal || sampleProposal;
  const options = suggestDates(draft, deadlines);
  const [selected, setSelected] = useState("");
  const chosen =
    options.find((option) => option.date === selected) || options[0];
  const original = calculateWorkload(draft, deadlines);

  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="Suggested Alternative Dates"
        description="Here are better options with lower workload and fewer conflicts."
      />
      <div className="suggestions-layout">
        <p className="suggestion-context">
          {draft.moduleId} – {draft.title}
          <span>
            Proposed: {formatDate(draft.date)} · {original.percent}% workload
          </span>
        </p>
        {options.length ? (
          <div className="suggestion-list">
            {options.map((option, index) => (
              <label
                key={option.date}
                className={`suggestion-option ${index === 0 ? "recommended" : ""} ${chosen?.date === option.date ? "chosen" : ""}`}
              >
                <input
                  type="radio"
                  name="suggested-date"
                  checked={chosen?.date === option.date}
                  onChange={() => setSelected(option.date)}
                />
                <CalendarDays className="suggestion-date-icon" size={29} />
                <strong className="suggestion-date">
                  {formatDate(option.date, { weekday: "short" })}
                </strong>
                {index === 0 && (
                  <Badge tone="green">
                    <Check size={14} />
                    Recommended
                  </Badge>
                )}
                <span className="suggestion-score">
                  <strong>Workload: {option.percent}%</strong>
                  <span className={`score-track ${option.className}`}>
                    <i style={{ width: `${option.percent}%` }} />
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No lower-workload dates found"
            description="Try changing the proposed date or complexity in the planner."
          />
        )}
        <div className="suggestions-actions">
          <Link to="/analysis" className="button">
            <ArrowLeft size={17} />
            Back
          </Link>
          {chosen && (
            <button
              className="button primary"
              onClick={() => {
                addDeadline({ ...draft, date: chosen.date });
                navigate("/calendar");
              }}
            >
              <CheckCircle2 size={18} />
              Confirm selected date
            </button>
          )}
        </div>
        <p className="helper">
          Demo recommendations are calculated from sample deadlines.
          Confirmation saves locally.
        </p>
      </div>
    </>
  );
}
