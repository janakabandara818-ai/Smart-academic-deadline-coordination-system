import {
  CalendarDays,
  ChartNoAxesCombined,
  Layers3,
  TriangleAlert,
} from "lucide-react";
import { useApp } from "../context/useApp";
import { Card, PageHeading, TextLink } from "../components/UI";
import StatCard from "../components/StatCard";
import DeadlineList from "../components/DeadlineList";
import { calculateWorkload } from "../utils/workloadCalculator";

export default function Dashboard() {
  const { deadlines, modules } = useApp();
  const conflicts = deadlines.filter(
    (item) => calculateWorkload(item, deadlines).level === "Conflict",
  ).length;
  const featured = deadlines.filter((item) =>
    ["d1", "d4", "d5"].includes(item.id),
  );
  const counts = [0.5, 1, 2, 2, 2.5, 3, 4];
  return (
    <>
      <PageHeading
        title={
          <>
           Welcome , Dr. Perera! <span className="wave">👋</span>
          </>
        }
        description="Coordinate assignment deadlines, analyze workload, and keep students balanced."
      />
      <div className="stats-grid">
        <StatCard
          icon={CalendarDays}
          value={deadlines.length}
          label="Upcoming Deadlines"
          to="/calendar"
        />
        <StatCard
          icon={TriangleAlert}
          value={conflicts}
          label="Conflict Detected"
          tone="red"
          to="/analysis"
        />
        <StatCard
          icon={Layers3}
          value={modules.length}
          label="Active Modules"
          to="/calendar"
        />
        <StatCard
          icon={ChartNoAxesCombined}
          value="72%"
          label="Avg. Workload"
          tone="red"
          to="/analysis"
        />
      </div>
      <div className="dashboard-main">
        <Card
          title="Upcoming Deadlines"
          action={<TextLink to="/calendar">View all</TextLink>}
        >
          <DeadlineList
            deadlines={featured.length === 3 ? featured : deadlines}
            limit={3}
          />
        </Card>
        <Card title="Workload (Next 7 Days)">
          <div
            className="workload-chart"
            role="img"
            aria-label="Sample assessment counts for November 8 to 14"
          >
            <div className="chart-axis">
              {[4, 3, 2, 1, 0].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div className="chart-plot">
              <div className="chart-bars">
                {counts.map((value, i) => (
                  <div className="chart-column" key={i}>
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(value / 4) * 100}%`,
                        background: i === 6 ? "#247A16" : "#b8e99b",
                      }}
                    />
                    <span className="chart-label">
                      Nov<small>{8 + i}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="chart-demo-label">
            Sample workload forecast · Demo data
          </p>
        </Card>
      </div>
    </>
  );
}
