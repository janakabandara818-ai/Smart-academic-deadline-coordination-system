import { classifyScore } from "../utils/workloadCalculator";

export default function WorkloadGauge({ score }) {
  const risk = classifyScore(score);
  return (
    <div
      className={`gauge ${risk.className}`}
      role="img"
      aria-label={`${Math.round(score * 100)} percent workload, ${risk.level}`}
    >
      <svg viewBox="0 0 240 145" aria-hidden="true">
        <path
          className="gauge-track"
          d="M 25 120 A 95 95 0 0 1 215 120"
          pathLength="100"
        />
        <path
          className="gauge-fill"
          d="M 25 120 A 95 95 0 0 1 215 120"
          pathLength="100"
          strokeDasharray={`${score * 100} 100`}
        />
      </svg>
      <div className="gauge-text">
        <strong>
          {Math.round(score * 100)}
          <span>%</span>
        </strong>
        <p>Workload score</p>
      </div>
      <div className="gauge-range">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
