import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { GradesView, SubjectsView, OverviewView } from "@/components/portal-views";
import { grades, allSubjects } from "@/lib/curriculum";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

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

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null as string | null },
  { id: "subjects", label: "Subjects", icon: BookOpen, badge: null as string | null },
  { id: "grades", label: "Grades", icon: GraduationCap, badge: null as string | null },
];

const allowedSubjectIds = ["science", "hindi", "social", "english"];

function DashboardScreen() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [initialGradeNav, setInitialGradeNav] = useState<
    { gradeId: string; subjectId?: string; lessonId?: string; mode?: "read" } | undefined
  >(undefined);
  const [gradesKey, setGradesKey] = useState(0);
  const [subjectsKey, setSubjectsKey] = useState(0);
  const [currentNav, setCurrentNav] = useState<{ gradeId?: string; subjectId?: string }>({});
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col">
      {/* Body: sidebar + main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside
          className={`${collapsed ? "w-16" : "w-72 2xl:w-80"} shrink-0 border-r border-border bg-card flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden`}
        >
          {/* Brand */}
          <div className={`${collapsed ? "justify-center px-0" : "px-4"} py-5 border-b border-border flex items-center gap-3 h-24 2xl:h-28 shrink-0`}>
            <div className="size-14 2xl:size-16 rounded-xl bg-gradient-to-br from-primary/15 via-background to-background border border-border ring-1 ring-primary/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/images/bhasyam-logo.png" alt="Bhasyam" className="h-12 w-12 2xl:h-14 2xl:w-14 object-contain" />
            </div>
            {!collapsed && (
              <div className="min-w-0 animate-fade-in-up">
                <div className="text-xl 2xl:text-2xl font-bold tracking-tight leading-tight truncate">
                  Assessment CMS
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 sidebar-scroll">
            {!collapsed && (
              <div className="flex items-center gap-2.5 px-2.5 mb-2">
                <span className="text-base 2xl:text-lg font-semibold tracking-wider text-muted-foreground">
                  Workspace
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            )}
            <ul className="space-y-0.5">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      title={collapsed ? item.label : undefined}
                      onClick={() => {
                        if (item.id === "grades") {
                          setInitialGradeNav(undefined);
                          setGradesKey((k) => k + 1);
                          setExpandedGrade(null);
                        }
                        if (item.id === "subjects") {
                          setSubjectsKey((k) => k + 1);
                        }
                        if (item.id !== "grades") {
                          setCurrentNav({});
                        }
                        setActive(item.id);
                      }}
                      className={`group relative w-full h-11 2xl:h-12 ${collapsed ? "justify-center px-0" : "px-3"} rounded-lg flex items-center gap-3 text-base 2xl:text-lg font-medium transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium 2xl:font-semibold shadow-sm ring-1 ring-primary/10"
                          : "text-foreground hover:bg-muted hover:translate-x-0.5"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
                      )}
                      <Icon className={`size-5 shrink-0 transition-all ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} group-hover:scale-105`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span className="font-mono-ui text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground/60">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Grades accordion in sidebar */}
            {!collapsed && (active === "grades" || !isMobile) && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2.5 px-2.5 mb-2">
                  <span className="text-base 2xl:text-lg font-semibold tracking-wider text-muted-foreground">
                    Select a Grade
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                {grades.map((g) => {
                  const isExpanded = expandedGrade === g.id;
                  const allowedSubjects = g.subjects.filter((s) => allowedSubjectIds.includes(s.id));
                  return (
                    <div key={g.id}>
                      <button
                        onClick={() => setExpandedGrade(isExpanded ? null : g.id)}
                        className={`w-full px-3 py-3 2xl:py-3.5 flex items-center gap-3 2xl:gap-3.5 rounded-lg text-base 2xl:text-lg transition-all duration-200 ${
                          isExpanded ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted"
                        }`}
                      >
                        <span className={`size-8 2xl:size-9 rounded-lg flex items-center justify-center text-xs 2xl:text-sm font-semibold shrink-0 transition-colors ${
                          isExpanded ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 text-primary"
                        }`}>
                          {g.level}
                        </span>
                        <span className="flex-1 text-left font-medium">Grade {g.level}</span>
                        <ChevronDown className={`size-5 2xl:size-6 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary" : ""}`} />
                      </button>
                      {isExpanded && (
                        <div className="ml-5 pl-3 border-l border-border space-y-0.5 py-1 animate-slide-in-left">
                          {allowedSubjects.map((s) => {
                            const isSelected = currentNav.gradeId === g.id && currentNav.subjectId === s.id;
                            return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setInitialGradeNav({ gradeId: g.id, subjectId: s.id });
                                setGradesKey((k) => k + 1);
                                setActive("grades");
                              }}
                              className={`w-full px-2 py-2 2xl:py-2.5 flex items-center gap-2.5 2xl:gap-3 rounded-md text-base 2xl:text-lg font-medium text-foreground transition-colors text-left ${isSelected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"}`}
                            >
                              <div className={`size-7 2xl:size-8 flex items-center justify-center shrink-0 rounded-md ${isSelected ? "bg-primary/10" : ""}`}>
                                {s.iconImage ? (
                                  <img src={s.iconImage} alt={s.name} className="size-7 2xl:size-8 object-contain" />
                                ) : (
                                  <span className="text-lg 2xl:text-xl leading-none">{s.icon}</span>
                                )}
                              </div>
                              <span>{s.name}</span>
                            </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Admin details + logout at bottom */}
          <div className="border-t border-border p-3.5 space-y-2.5">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center px-0" : "px-2"} py-2 rounded-lg hover:bg-muted transition-colors`}>
              <div className="size-11 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0 ring-2 ring-primary/20 shadow-sm">
                AD
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 animate-fade-in-up">
                    <div className="text-base font-semibold truncate">Admin</div>
                    <div className="text-xs text-muted-foreground truncate">Administrator</div>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              title={collapsed ? "Log out" : undefined}
              className={`w-full h-11 ${collapsed ? "justify-center px-0" : "px-2.5"} rounded-md flex items-center gap-3 text-base text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors active:scale-[0.98]`}
            >
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Log out</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Content header */}
          <div className="h-14 border-b border-border bg-card flex items-center px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 text-sm 2xl:text-lg">
              <button
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="group h-9 w-9 2xl:h-10 2xl:w-10 rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-sm hover:bg-primary hover:border-primary hover:text-white hover:shadow-md hover:shadow-primary/25 flex items-center justify-center transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4 2xl:size-5 text-primary group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                ) : (
                  <PanelLeftClose className="size-4 2xl:size-5 text-primary group-hover:text-white group-hover:scale-110 group-hover:-rotate-180 transition-all duration-300" />
                )}
              </button>
              <div className="h-5 2xl:h-6 w-px bg-border" />
              <span className="text-foreground font-medium">Workspace</span>
              <ChevronRight className="size-3.5 2xl:size-4 text-muted-foreground" />
              <span className="font-bold capitalize text-foreground">{active}</span>
            </div>
          </div>


          {/* Content body */}
          <div key={active} className="flex-1 overflow-y-auto p-6 animate-fade-in-up">
            {active === "dashboard" && (
              <OverviewView
                onOpenSubject={(subjectId) => {
                  setInitialGradeNav({ subjectId, mode: "read" } as any);
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
              />
            )}
            {active === "grades" && (
              <GradesView key={gradesKey} initialNav={initialGradeNav} onNavChange={setCurrentNav} />
            )}
            {active === "subjects" && (
              <SubjectsView
                key={subjectsKey}
                onOpenLesson={(p) => {
                  setInitialGradeNav({ ...p, mode: "read" });
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
              />
            )}
          </div>


          {/* Footer */}
          <footer className="h-10 md:h-12 2xl:h-14 border-t border-border bg-card px-6 flex items-center justify-center gap-2 shrink-0">
            <span className="text-xs md:text-sm 2xl:text-base text-muted-foreground">
              &copy; 2026 Assessment CMS · All rights reserved by
            </span>
            <div className="flex items-center gap-1.5">
              <img
                src="/images/icon.png"
                alt="Wise Wings"
                className="h-4 md:h-5 2xl:h-6 w-4 md:w-5 2xl:w-6 rounded-sm object-contain"
              />
              <span className="font-semibold text-xs md:text-sm 2xl:text-base text-foreground">
                wise wings
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
