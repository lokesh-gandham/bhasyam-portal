import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import bhasyamLogo from "../assets/bhasyam-logo.png.asset.json";
import wisewingsLogo from "../assets/wisewings-logo.png.asset.json";
import { GradesView, SubjectsView, LessonsView, OverviewView } from "@/components/portal-views";
import { grades, allSubjects, allLessons } from "@/lib/curriculum";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bhasyam Assessment CMS" },
      { name: "description", content: "Bhasyam Assessment CMS admin dashboard." },
      { property: "og:title", content: "Dashboard — Bhasyam Assessment CMS" },
      { property: "og:description", content: "Bhasyam Assessment CMS admin dashboard." },
    ],
  }),
  component: DashboardScreen,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null as string | null },
  { id: "subjects", label: "Subjects", icon: BookOpen, badge: String(allSubjects.length) },
  { id: "grades", label: "Grades", icon: GraduationCap, badge: String(grades.length) },
  { id: "lessons", label: "Lessons", icon: FileText, badge: String(allLessons.length) },
  { id: "students", label: "Students", icon: Users, badge: null },
  { id: "reports", label: "Reports", icon: BarChart3, badge: null },
  { id: "settings", label: "Settings", icon: Settings, badge: null },
];


function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Settings className="size-5 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}

function DashboardScreen() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [initialGradeNav, setInitialGradeNav] = useState<
    { gradeId: string; subjectId: string; lessonId: string; mode: "read" | "quiz" } | undefined
  >(undefined);
  const [gradesKey, setGradesKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col">
      {/* Top app strip */}
      <div className="h-9 border-b border-border bg-white/70 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-black/10" />
            <span className="size-2.5 rounded-full bg-black/10" />
            <span className="size-2.5 rounded-full bg-black/10" />
          </div>
          <span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
            Assessment CMS · v2.4.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono-ui text-[10px] font-medium text-emerald-700">
            Secure connection
          </span>
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside
          className={`${collapsed ? "w-16" : "w-64"} shrink-0 border-r border-border bg-card flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden`}
        >
          {/* Brand */}
          <div className="px-3 py-4 border-b border-border flex items-center gap-3 h-[73px]">
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
              <img src={bhasyamLogo.url} alt="Bhasyam" className="h-8 w-8 object-contain" />
            </div>
            {!collapsed && (
              <div className="min-w-0 animate-fade-in-up">
                <div className="text-sm font-semibold tracking-tight leading-tight truncate">
                  Assessment CMS
                </div>
                <div className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                  Bhasyam
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="px-3 pt-3 animate-fade-in-up">
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search…"
                  className="w-full h-8 pl-8 pr-2 rounded-md bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                />
                <span className="font-mono-ui absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground border border-border rounded px-1 py-0.5">
                  ⌘K
                </span>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {!collapsed && (
              <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Workspace
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
                        }
                        setActive(item.id);
                      }}
                      className={`group relative w-full h-9 ${collapsed ? "justify-center px-0" : "px-2.5"} rounded-md flex items-center gap-2.5 text-sm transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/80 hover:bg-muted hover:translate-x-0.5"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />
                      )}
                      <Icon className={`size-4 shrink-0 transition-transform ${isActive ? "text-primary" : "text-muted-foreground"} group-hover:scale-110`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span className="font-mono-ui text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
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
          </nav>

          {/* Admin details + logout at bottom */}
          <div className="border-t border-border p-3 space-y-2">
            <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center px-0" : "px-2"} py-2 rounded-md hover:bg-muted transition-colors`}>
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0 ring-2 ring-background">
                AD
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 animate-fade-in-up">
                    <div className="text-xs font-semibold truncate">Admin Desai</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      admin@bhasyam.edu
                    </div>
                  </div>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </>
              )}
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              title={collapsed ? "Log out" : undefined}
              className={`w-full h-9 ${collapsed ? "justify-center px-0" : "px-2.5"} rounded-md flex items-center gap-2.5 text-sm text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors active:scale-[0.98]`}
            >
              <LogOut className="size-4 shrink-0" />
              {!collapsed && <span>Log out</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Content header */}
          <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="h-8 w-8 rounded-md border border-border hover:bg-muted flex items-center justify-center transition-all active:scale-95"
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4 text-muted-foreground" />
                ) : (
                  <PanelLeftClose className="size-4 text-muted-foreground" />
                )}
              </button>
              <div className="h-5 w-px bg-border" />
              <span className="text-muted-foreground">Workspace</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="font-semibold capitalize">{active}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 w-8 rounded-md border border-border hover:bg-muted flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                <Bell className="size-4 text-muted-foreground" />
              </button>
              <button className="btn-shine h-8 px-3 rounded-md bg-foreground text-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-black/90 transition-all active:scale-[0.98]">
                <Plus className="size-3.5" />
                New Lesson
              </button>
            </div>
          </div>


          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6">
            {active === "dashboard" && <OverviewView />}
            {active === "grades" && (
              <GradesView key={gradesKey} initialNav={initialGradeNav} />
            )}
            {active === "subjects" && (
              <SubjectsView
                onOpenLesson={(p) => {
                  setInitialGradeNav({ ...p, mode: "read" });
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
              />
            )}
            {active === "lessons" && (
              <LessonsView
                onOpenLesson={(p) => {
                  setInitialGradeNav({ ...p, mode: "read" });
                  setGradesKey((k) => k + 1);
                  setActive("grades");
                }}
              />
            )}
            {active === "students" && (
              <PlaceholderView title="Students" description="Student roster management is coming soon." />
            )}
            {active === "reports" && (
              <PlaceholderView title="Reports" description="Assessment reports and analytics are coming soon." />
            )}
            {active === "settings" && (
              <PlaceholderView title="Settings" description="Workspace preferences are coming soon." />
            )}
          </div>


          {/* Footer */}
          <footer className="h-10 border-t border-border bg-card px-6 flex items-center justify-center gap-2 shrink-0">
            <span className="font-mono-ui text-[10px] text-muted-foreground tracking-tight uppercase">
              &copy; 2026 Assessment CMS · All rights reserved by
            </span>
            <div className="flex items-center gap-1.5">
              <img
                src={wisewingsLogo.url}
                alt="Wise Wings"
                className="h-4 w-4 rounded-sm object-contain"
              />
              <span className="font-bold text-[11px] tracking-tighter text-foreground uppercase">
                wise wings
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
