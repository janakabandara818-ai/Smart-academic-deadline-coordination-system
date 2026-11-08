import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChartNoAxesCombined, Info } from "lucide-react";
import { useApp } from "../context/useApp";
import { DEMO_TODAY } from "../data/mockData";
import { calculateWorkload } from "../utils/workloadCalculator";
import { PageHeading } from "../components/UI";

export default function DeadlinePlanner() {
  const { modules, proposal, setProposal, deadlines } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(
    proposal || {
      moduleId: modules[0]?.id || "",
      title: "",
      type: "Project",
      complexity: "High",
      date: "2026-11-14",
    },
  );
  const [error, setError] = useState("");
  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.moduleId || !form.date) {
      setError("Please complete all required fields.");
      return;
    }
    if (form.date < DEMO_TODAY) {
      setError(
        "Choose a date on or after November 7, 2026, the demo reference date.",
      );
      return;
    }
    calculateWorkload(form, deadlines);
    setProposal({ ...form, title: form.title.trim() });
    navigate("/analysis");
  };

  return (
    <>
      <PageHeading
        icon={CalendarDays}
        title="Plan a New Deadline"
        description="Propose an assignment deadline and let the system analyze conflicts."
      />
      <div className="planner-layout">
        <form
          id="deadline-planner-form"
          className="planner-form"
          onSubmit={submit}
        >
          <label>
            Module / course <span className="required">*</span>
            <select
              name="moduleId"
              value={form.moduleId}
              onChange={update}
              required
            >
              <option value="" disabled>
                Select a module
              </option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.id} – {module.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assignment title <span className="required">*</span>
            <input
              name="title"
              value={form.title}
              onChange={update}
              placeholder="Group Project – System Design"
              required
              maxLength={120}
            />
          </label>
          <div className="form-row">
            <label>
              Assignment type <span className="required">*</span>
              <select name="type" value={form.type} onChange={update}>
                {["Project", "Assignment", "Lab", "Quiz"].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Complexity (workload) <span className="required">*</span>
              <select
                name="complexity"
                value={form.complexity}
                onChange={update}
              >
                {["Low", "Medium", "High"].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Proposed deadline <span className="required">*</span>
            <input
              type="date"
              name="date"
              min={DEMO_TODAY}
              value={form.date}
              onChange={update}
              required
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <p className="helper">
            Demo analysis · No changes are published to Moodle.
          </p>
        </form>
        <div className="planner-aside">
          <aside className="next-steps">
            <h2>
              <Info size={19} />
              What happens next?
            </h2>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>Analyze student workload</strong>
                  <p>Check for deadline conflicts in the seven-day window.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Get smart suggestions</strong>
                  <p>Receive better alternative dates.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Update & notify</strong>
                  <p>
                    Confirm a date in this demo workspace. No external messages
                    are sent.
                  </p>
                </div>
              </li>
            </ol>
          </aside>
          <button
            className="button primary full"
            form="deadline-planner-form"
            type="submit"
          >
            <ChartNoAxesCombined size={18} />
            Analyze & get suggestions
          </button>
        </div>
      </div>
    </>
  );
}
