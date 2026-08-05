import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Menu,
  LogOut,
  ChevronDown,
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
  const [profileOpen, setProfileOpen] = useState(false);
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

        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 text-white/95 hover:bg-white/15 rounded px-2 py-1.5 transition-colors"
            >
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
              <ChevronDown className="size-4" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white rounded-md shadow-lg border border-[#d0d7de] py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate({ to: "/" });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1a2332] hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
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

          <div className="flex-1 min-h-0" />
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
