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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "subjects", label: "Subjects", icon: BookOpen, badge: "24" },
  { id: "grades", label: "Grades", icon: GraduationCap, badge: null },
  { id: "lessons", label: "Lessons", icon: FileText, badge: "128" },
  { id: "students", label: "Students", icon: Users, badge: null },
  { id: "reports", label: "Reports", icon: BarChart3, badge: null },
  { id: "settings", label: "Settings", icon: Settings, badge: null },
];

const stats = [
  { label: "Active Subjects", value: "24", delta: "+3", tone: "text-emerald-600" },
  { label: "Total Lessons", value: "128", delta: "+12", tone: "text-emerald-600" },
  { label: "Assessments Pending", value: "7", delta: "-2", tone: "text-amber-600" },
  { label: "Enrolled Students", value: "1,842", delta: "+56", tone: "text-emerald-600" },
];

const recent = [
  { title: "Class X · Physics · Chapter 4", meta: "Updated 12 min ago", by: "R. Menon" },
  { title: "Class IX · Mathematics · Algebra", meta: "Updated 34 min ago", by: "S. Iyer" },
  { title: "Class VIII · English · Poetry", meta: "Updated 1 hr ago", by: "A. Rao" },
  { title: "Class VII · Social · Civics", meta: "Updated 3 hr ago", by: "K. Bhaskar" },
];

function DashboardScreen() {
  const [active, setActive] = useState("dashboard");
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
        <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
          {/* Brand */}
          <div className="px-4 py-4 border-b border-border flex items-center gap-3">
            <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">
              <img src={bhasyamLogo.url} alt="Bhasyam" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight leading-tight">
                Assessment CMS
              </div>
              <div className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                Bhasyam
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 pt-3">
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

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Workspace
            </div>
            <ul className="space-y-0.5">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActive(item.id)}
                      className={`w-full h-9 px-2.5 rounded-md flex items-center gap-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/80 hover:bg-muted"
                      }`}
                    >
                      <Icon className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="font-mono-ui text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin details + logout at bottom */}
          <div className="border-t border-border p-3 space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-muted transition-colors">
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate">Admin Desai</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  admin@bhasyam.edu
                </div>
              </div>
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full h-9 px-2.5 rounded-md flex items-center gap-2.5 text-sm text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Content header */}
          <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Workspace</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="font-semibold capitalize">{active}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 w-8 rounded-md border border-border hover:bg-muted flex items-center justify-center">
                <Bell className="size-4 text-muted-foreground" />
              </button>
              <button className="h-8 px-3 rounded-md bg-foreground text-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-black/90">
                <Plus className="size-3.5" />
                New Lesson
              </button>
            </div>
          </div>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here's what's happening across the Bhasyam assessment workspace today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
                    <div className={`font-mono-ui text-[11px] ${s.tone}`}>{s.delta}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent + panel */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="text-sm font-semibold">Recent updates</div>
                  <button className="text-[11px] text-primary hover:underline">View all</button>
                </div>
                <ul className="divide-y divide-border">
                  {recent.map((r) => (
                    <li
                      key={r.title}
                      className="px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{r.title}</div>
                        <div className="text-[11px] text-muted-foreground">{r.meta}</div>
                      </div>
                      <div className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
                        {r.by}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm font-semibold">System status</div>
                <div className="mt-3 space-y-2.5 text-xs">
                  {[
                    { l: "API Gateway", v: "Operational", ok: true },
                    { l: "Database", v: "Operational", ok: true },
                    { l: "Media Storage", v: "Operational", ok: true },
                    { l: "Auth Service", v: "Operational", ok: true },
                  ].map((s) => (
                    <div key={s.l} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{s.l}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-emerald-700">
                          {s.v}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
