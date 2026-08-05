import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Menu,
  LogOut,
} from "lucide-react";
import { GradesView, SubjectsView, OverviewView } from "@/components/portal-views";
import { grades, allSubjects } from "@/lib/curriculum";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Assessment CMS" },
      { name: "description", content: "Assessment CMS admin dashboard." },
      { property: "og:title", content: "Assessment CMS" },
      { property: "og:description", content: "Assessment CMS admin dashboard." },
    ],
  }),
  component: DashboardScreen,
});

type NavItem = {
  id: string;
  label: string;
  icon: any;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "grades", label: "Grades", icon: GraduationCap },
];

const allowedSubjectIds = ["science", "hindi", "social", "english"];

const SIDEBAR_EXPANDED = 220;
const SIDEBAR_COLLAPSED = 56;

function DashboardScreen() {
  const [active, setActive] = useState("dashboard");
  const [initialGradeNav, setInitialGradeNav] = useState<
    { gradeId: string; subjectId?: string; lessonId?: string; mode?: "read" } | undefined
  >(undefined);
  const [gradesKey, setGradesKey] = useState(0);
  const [subjectsKey, setSubjectsKey] = useState(0);
  const [currentNav, setCurrentNav] = useState<{ gradeId?: string; subjectId?: string }>({});
  const [initialSubjectsNav, setInitialSubjectsNav] = useState<{ subjectId?: string; gradeId?: string } | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const currentGrade = initialGradeNav?.gradeId ? grades.find((g) => g.id === initialGradeNav.gradeId) : null;
  const currentSubject = currentGrade?.subjects.find((s) => s.id === initialGradeNav?.subjectId);
  const allowedGradeSubjects = currentGrade?.subjects.filter((s) => allowedSubjectIds.includes(s.id)) || [];

  const rowCount =
    active === "dashboard"
      ? grades.length
      : active === "grades"
        ? initialGradeNav?.subjectId
          ? currentSubject?.lessons.length ?? 0
          : initialGradeNav?.gradeId
            ? allowedGradeSubjects.length
            : grades.length
        : active === "subjects"
          ? currentNav.gradeId
            ? allSubjects.find((s) => s.id === currentNav.subjectId && s.gradeId === currentNav.gradeId)?.lessons.length ?? 0
            : currentNav.subjectId
              ? grades.length
              : allSubjects.filter((s) => allowedSubjectIds.includes(s.id)).filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i).length
          : 0;

  const pageTitle = (() => {
    if (active === "dashboard") return "Dashboard";
    if (active === "subjects") {
      if (currentNav.gradeId && currentNav.subjectId) {
        const s = allSubjects.find((x) => x.id === currentNav.subjectId);
        return s?.name || "Lessons";
      }
      if (currentNav.subjectId) {
        const s = allSubjects.find((x) => x.id === currentNav.subjectId);
        return s?.name || "Subject";
      }
      return "Subjects";
    }
    if (active === "grades") {
      if (initialGradeNav?.lessonId) return currentSubject?.name || "Lessons";
      if (initialGradeNav?.subjectId) return currentSubject?.name || "Subjects";
      if (initialGradeNav?.gradeId) return `Grade ${currentGrade?.level || ""}`;
      return "Grades";
    }
    return "Assessment CMS";
  })();

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden text-base"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#e8edf2" }}
    >
      {/* Top Header — Fluent enterprise blue */}
      <header className="h-12 bg-[#0F6CBD] flex items-center px-3 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="text-white/95 hover:bg-white/15 rounded p-1.5 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-white font-semibold text-[17px] tracking-tight">Bhasyam</span>
            <span className="text-white/50 text-[17px]">|</span>
            <span className="text-white/95 text-[17px] truncate">Assessment CMS</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-white/90 text-sm font-medium px-2 py-1 rounded bg-white/10">
            {pageTitle}
          </span>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Fixed-width dark sidebar */}
        <aside
          className={`shrink-0 flex flex-col overflow-hidden z-10 cms-sidebar ${sidebarCollapsed ? "cms-sidebar-collapsed" : ""}`}
          style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
        >
          {/* Brand — large logo on light panel for visibility */}
          <div
            className={`shrink-0 border-b border-[#d0d7de] bg-white ${
              sidebarCollapsed ? "px-2 py-2.5 flex justify-center" : "px-3 py-4 flex flex-col items-center gap-2 text-center"
            }`}
          >
            <img
              src="/images/bhasyam-new-logo.png"
              alt="Bhasyam"
              className={`object-contain shrink-0 ${sidebarCollapsed ? "h-11 w-11" : "h-[96px] w-[96px] 2xl:h-[112px] 2xl:w-[112px]"}`}
            />
            {!sidebarCollapsed && (
              <div className="text-xs 2xl:text-sm font-semibold text-[#0F6CBD] leading-tight tracking-wide uppercase">
                Assessment CMS
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="cms-sidebar-nav">
            {!sidebarCollapsed && (
              <div className="cms-sidebar-section-label">Navigation</div>
            )}
            <ul className="cms-sidebar-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={() => {
                        if (item.id === "grades") {
                          setInitialGradeNav(undefined);
                          setGradesKey((k) => k + 1);
                        }
                        if (item.id === "subjects") {
                          setInitialSubjectsNav(undefined);
                          setCurrentNav({});
                          setSubjectsKey((k) => k + 1);
                        }
                        if (item.id !== "grades") {
                          setCurrentNav({});
                        }
                        setActive(item.id);
                      }}
                      className={`cms-sidebar-nav-btn ${isActive ? "active" : ""} ${
                        sidebarCollapsed ? "cms-sidebar-nav-btn-collapsed" : ""
                      }`}
                    >
                      <Icon className="size-5 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick stats */}
          {!sidebarCollapsed && (
            <div className="cms-sidebar-stats">
              <div className="cms-sidebar-section-label">Quick stats</div>
              <div className="cms-sidebar-stats-card">
                <div className="cms-sidebar-stat-row">
                  <span>Grades</span>
                  <span>{grades.length}</span>
                </div>
                <div className="cms-sidebar-stat-row">
                  <span>Subjects</span>
                  <span>4</span>
                </div>
                <div className="cms-sidebar-stat-row">
                  <span>Active view</span>
                  <span className="capitalize">{active}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0" />

          {/* Profile footer */}
          <div className="cms-sidebar-footer">
            {!sidebarCollapsed ? (
              <div className="cms-sidebar-profile">
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className="size-9 rounded-full bg-[#0F6CBD] flex items-center justify-center text-sm font-bold text-white">
                      AD
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1a2332] truncate">Admin</div>
                    <div className="text-[12px] font-semibold text-[#64748b] truncate">Administrator</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                  className="cms-sidebar-logout-btn"
                >
                  <LogOut className="size-3.5" />
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                title="Log out"
                className="cms-sidebar-logout-btn-collapsed"
              >
                <LogOut className="size-5" />
              </button>
            )}
          </div>
        </aside>

        {/* Main content canvas — single scroll parent */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
            {active === "dashboard" && (
              <OverviewView
                onOpenSubject={(subjectId) => {
                  setInitialGradeNav({ subjectId, mode: "read" } as any);
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
                onNavigate={(view, opts) => {
                  if (view === "grades") {
                    if (opts?.gradeId) {
                      setInitialGradeNav({ gradeId: opts.gradeId });
                      setGradesKey((k) => k + 1);
                    }
                    setActive("grades");
                  } else if (view === "subjects") {
                    setSubjectsKey((k) => k + 1);
                    setActive("subjects");
                  }
                }}
              />
            )}
            {active === "grades" && (
              <GradesView key={gradesKey} initialNav={initialGradeNav} onNavChange={setCurrentNav} />
            )}
            {active === "subjects" && (
              <SubjectsView
                key={subjectsKey}
                initialSubjectId={initialSubjectsNav?.subjectId}
                initialGradeId={initialSubjectsNav?.gradeId}
                onNavChange={(nav) => {
                  setCurrentNav(nav);
                }}
                onOpenLesson={(p) => {
                  setInitialGradeNav({ ...p, mode: "read" });
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
              />
            )}
          </div>

          <footer className="h-9 border-t border-[#d0d7de] px-4 flex items-center shrink-0 bg-white">
            <span className="cms-footer-meta">Rows: {rowCount}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
