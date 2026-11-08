import { Link } from "react-router-dom";
export default function StatCard({
  icon: Icon,
  value,
  label,
  tone = "green",
  to,
}) {
  return (
    <Link to={to} className={`stat-card ${tone}`}>
      <Icon className="stat-icon" size={40} />
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <h2>{label}</h2>
      </div>
    </Link>
  );
}
