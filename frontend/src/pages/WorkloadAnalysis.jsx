import {
  ArrowRight,
  CalendarDays,
  Layers3,
  ListChecks,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { calculateWorkload, formatDate } from "../utils/workloadCalculator";
import { Badge, Card, PageHeading } from "../components/UI";
import WorkloadGauge from "../components/WorkloadGauge";
import DeadlineList from "../components/DeadlineList";
import { sampleProposal } from "../data/mockData";

export default function WorkloadAnalysis() {
  const { proposal, deadlines, setProposal, addDeadline } = useApp();
  const navigate = useNavigate();
  const draft = proposal || sampleProposal;
  const result = calculateWorkload(draft, deadlines);
  const summaries = [
    {
      icon: ListChecks,
      label: "Assessments in the 7-day window",
      value: result.count,
    },
    { icon: Layers3, label: "Affected modules", value: result.moduleCount },
    {
      icon: SlidersHorizontal,
      label: "Estimated student workload",
      value: result.description,
    },
    {
      icon: TriangleAlert,
      label: "Conflict classification",
      value: <Badge tone={result.className}>{result.level}</Badge>,
    },
  ];

  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="Conflict Analysis Result"
        description="Workload evaluation for the proposed deadline."
      />
      <p className="analysis-context">
        <strong>
          {draft.moduleId} – {draft.title}
        </strong>
        <span>
          {formatDate(draft.date)}
          {!proposal ? " · Sample proposal" : ""}
        </span>
      </p>
      <div className="analysis-layout">
        <Card className="gauge-card">
          <WorkloadGauge score={result.score} />
          <Badge tone={result.className}>
            <TriangleAlert size={19} />
            {result.level === "Conflict" ? "High Conflict" : result.level}
          </Badge>
        </Card>
        <Card title="Analysis Summary" className="analysis-summary">
          <div className="analysis-metrics">
            {summaries.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <span>
                  <Icon size={20} />
                  {label}
                </span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="page-button-row">
        <Link to="/planner" className="button">
          <SlidersHorizontal size={16} />
          Edit deadline
        </Link>
        <div>
          {proposal && (
            <button
              className="button"
              onClick={() => {
                addDeadline(draft);
                navigate("/calendar");
              }}
            >
              Confirm proposed date
            </button>
          )}
          <button
            className="button primary"
            onClick={() => {
              setProposal(draft);
              navigate("/suggestions");
            }}
          >
            Explore alternative dates
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <details className="analysis-details">
        <summary>Score calculation & nearby deadlines</summary>
        <div className="factor-grid">
          {[
            ["Deadline density", result.factors.density, "40%"],
            ["Assessment complexity", result.factors.complexity, "35%"],
            ["Day preference", result.factors.preference, "25%"],
          ].map(([title, factor, weight]) => (
            <div className="factor" key={title}>
              <strong>
                {title} · {weight} weight
              </strong>
              <div className="progress-track">
                <i style={{ width: `${factor * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="risk-legend">
          <span>Approved ≤40%</span>
          <span>Caution &gt;40–65%</span>
          <span>Conflict &gt;65%</span>
        </div>
        <p className="helper">
          Seven-day window: {formatDate(result.start)} –{" "}
          {formatDate(result.end)}. Includes the proposed assessment.
        </p>
        <DeadlineList deadlines={result.nearby} />
      </details>
    </>
  );
}
