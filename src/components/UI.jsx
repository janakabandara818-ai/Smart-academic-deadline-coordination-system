import { useEffect, useRef } from "react";
import { ArrowUpRight, CalendarDays, X } from "lucide-react";
import { Link } from "react-router-dom";
import { classifyScore, formatDate } from "../utils/workloadCalculator";
import { typeColors } from "../data/mockData";

export function PageHeading({ title, description, children, icon: Icon }) {
  return (
    <div className="page-heading">
      <div>
        <h1>
          {Icon && <Icon size={27} />}
          {title}
        </h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}
export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <div className="card-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function Badge({ children, tone = "neutral", dot = false }) {
  return (
    <span
      className={`badge ${tone}`}
      title={typeof children === "string" ? children : undefined}
    >
      {dot && <span className="status-dot" />}
      {children}
    </span>
  );
}
export function RiskBadge({ score }) {
  const risk = classifyScore(score);
  return (
    <Badge tone={risk.className} dot>
      {risk.level}
    </Badge>
  );
}
export function EmptyState({
  title = "No deadlines here",
  description = "Select another date or change your filters.",
}) {
  return (
    <div className="empty-state">
      <CalendarDays size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowUpRight size={15} />
    </Link>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function DeadlineDetails({ deadline, onClose }) {
  return (
    <Modal title="Deadline details" onClose={onClose}>
      <Badge tone="green">{deadline.moduleId}</Badge>
      <h3 className="detail-title">{deadline.title}</h3>
      <div className="detail-meta">
        <span>
          <i
            className="type-dot"
            style={{ background: typeColors[deadline.type] }}
          />
          {deadline.type}
        </span>
        <span>{deadline.complexity} complexity</span>
      </div>
      <p className="detail-description">{deadline.description}</p>
      <div className="info-box">
        <CalendarDays size={20} />
        <div>
          <strong>{formatDate(deadline.date, { weekday: "long" })}</strong>
          <p>Due at {deadline.time} · Sri Lanka time</p>
        </div>
      </div>
      <p className="helper">
        Source: {deadline.source}. Open your university LMS for assessment
        instructions.
      </p>
      <button className="button primary full" onClick={onClose}>
        Done
      </button>
    </Modal>
  );
}
