import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/useApp";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ComingSoon from "./components/ComingSoon";
import Dashboard from "./pages/Dashboard";
import UnifiedCalendar from "./pages/UnifiedCalendar";
import DeadlinePlanner from "./pages/DeadlinePlanner";
import WorkloadAnalysis from "./pages/WorkloadAnalysis";
import SmartSuggestions from "./pages/SmartSuggestions";
import MoodleIntegration from "./pages/MoodleIntegration";
import AdminManagement from "./pages/AdminManagement";
import StudentDashboard from "./pages/StudentDashboard";
import Settings from "./pages/Settings";
import "./styles/global.css";

function Layout() {
  const { role, toast, setToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);
  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);
  const staff = (page) =>
    role !== "Student" ? page : <Navigate to="/" replace />;
  const lecturerFeature = (feature, page) =>
    role === "Lecturer" ? <ComingSoon feature={feature} /> : page;
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-shell">
        <Header onMenu={() => setMenuOpen(true)} />
        <main
          id="main-content"
          className={`main-content page-${pathname === "/" ? (role === "Student" ? "student" : "dashboard") : pathname.slice(1)}`}
          tabIndex={-1}
        >
          <Routes>
            <Route
              path="/"
              element={
                role === "Student" ? <StudentDashboard /> : <Dashboard />
              }
            />
            <Route
              path="/calendar"
              element={lecturerFeature("Unified Calendar", <UnifiedCalendar />)}
            />
            <Route path="/planner" element={staff(<DeadlinePlanner />)} />
            <Route
              path="/analysis"
              element={staff(
                lecturerFeature("Workload Analysis", <WorkloadAnalysis />),
              )}
            />
            <Route
              path="/suggestions"
              element={staff(
                lecturerFeature("Smart Suggestions", <SmartSuggestions />),
              )}
            />
            {/* Notifications remain disabled for other roles. */}
            {role === "Lecturer" && (
              <Route
                path="/notifications"
                element={<ComingSoon feature="Notifications" />}
              />
            )}
            <Route
              path="/moodle"
              element={staff(
                lecturerFeature("Moodle Integration", <MoodleIntegration />),
              )}
            />
            <Route
              path="/admin"
              element={
                role === "Admin" ? (
                  <AdminManagement />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={lecturerFeature("Settings", <Settings />)}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          <span>{toast}</span>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout />
      </AppProvider>
    </BrowserRouter>
  );
}
