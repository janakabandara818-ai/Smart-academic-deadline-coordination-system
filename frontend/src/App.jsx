import { useEffect, useState } from "react";
import {
  BrowserRouter,
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
import DeadlinePlanner from "./pages/DeadlinePlanner";
import DeadlineViewer from "./pages/DeadlineViewer";
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
  const lecturerPage = (feature, page) =>
    role === "Lecturer" ? page : <ComingSoon feature={feature} />;
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
                lecturerPage(
                  role === "Student" ? "Student Dashboard" : "Admin Management",
                  <Dashboard />,
                )
              }
            />
            <Route
              path="/calendar"
              element={<DeadlineViewer />}
            />
            <Route
              path="/planner"
              element={lecturerPage("Deadline Planner", <DeadlinePlanner />)}
            />
            <Route
              path="/analysis"
              element={<ComingSoon feature="Workload Analysis" />}
            />
            <Route
              path="/suggestions"
              element={<ComingSoon feature="Smart Suggestions" />}
            />
            <Route
              path="/notifications"
              element={<ComingSoon feature="Notifications" />}
            />
            <Route
              path="/moodle"
              element={<ComingSoon feature="Moodle Integration" />}
            />
            <Route
              path="/admin"
              element={<ComingSoon feature="Admin Management" />}
            />
            <Route
              path="/settings"
              element={<ComingSoon feature="Settings" />}
            />
            <Route path="*" element={<ComingSoon feature="This page" />} />
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
