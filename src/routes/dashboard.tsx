import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null as string | null, color: "from-amber-400 to-orange-500" },
  { id: "subjects", label: "Subjects", icon: BookOpen, badge: null as string | null, color: "from-green-400 to-emerald-500" },
  { id: "grades", label: "Grades", icon: GraduationCap, badge: null as string | null, color: "from-yellow-400 to-yellow-500" },
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
  const [initialSubjectsNav, setInitialSubjectsNav] = useState<{ subjectId?: string; gradeId?: string } | undefined>(undefined);
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
    <div className="fixed inset-0 bg-[#FAFAF9] text-foreground flex flex-col">
      {/* Top Header Bar */}
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-yellow-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>Assessment CMS</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside
          className={`${collapsed ? "w-20" : "w-72 2xl:w-80"} shrink-0 bg-white border-r border-gray-200 flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden relative`}
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl" />

          {/* Brand */}
          <div className={`${collapsed ? "justify-center px-0 py-6" : "px-5 py-6 2xl:py-8"} relative border-b border-gray-100 flex flex-col items-center gap-3 shrink-0`}>
            <img
              src="/images/bhasyam-new-logo.png"
              alt="Bhasyam"
              className={`${collapsed ? "h-14 w-14" : "h-32 w-32 2xl:h-40 2xl:w-40"} object-contain relative`}
            />
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-xl 2xl:text-2xl font-extrabold tracking-tight text-gray-800" style={{ fontFamily: "'Georgia', serif" }}>
                  Assessment CMS
                </div>
              </motion.div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scroll">
            {!collapsed && (
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-3 mb-3">
                Menu
              </div>
            )}
            <ul className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <motion.button
                      whileHover={{ x: isActive ? 0 : 3 }}
                      whileTap={{ scale: 0.97 }}
                      title={collapsed ? item.label : undefined}
                      onClick={() => {
                        if (item.id === "grades") {
                          setInitialGradeNav(undefined);
                          setGradesKey((k) => k + 1);
                          setExpandedGrade(null);
                        }
                        if (item.id === "subjects") {
                          setInitialSubjectsNav(undefined);
                          setSubjectsKey((k) => k + 1);
                        }
                        if (item.id !== "grades") {
                          setCurrentNav({});
                        }
                        setActive(item.id);
                      }}
                      className={`group relative w-full h-12 ${collapsed ? "justify-center px-0" : "px-3"} rounded-xl flex items-center gap-3 text-sm font-medium overflow-hidden transition-colors duration-300 ${
                        isActive
                          ? "text-green-700"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/70"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-yellow-50 border border-yellow-100 rounded-xl"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <motion.div
                        animate={isActive ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative z-10 shrink-0"
                      >
                        <Icon className={`size-5 ${isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                      </motion.div>
                      {!collapsed && (
                        <span className="relative z-10 flex-1 text-left">{item.label}</span>
                      )}
                      {!collapsed && isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
                          className="size-1.5 rounded-full bg-green-500 relative z-10 shadow-sm"
                        />
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            {/* Grades accordion */}
            <AnimatePresence>
              {!collapsed && active === "grades" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 overflow-hidden"
                >
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-3 mb-3">
                    Select Grade
                  </div>
                  <div className="space-y-1">
                    {grades.map((g, i) => {
                      const isExpanded = expandedGrade === g.id;
                      const allowedSubjects = g.subjects.filter((s) => allowedSubjectIds.includes(s.id));
                      const gradeStyles = [
                        { active: "bg-yellow-50 text-yellow-700 border border-yellow-200", badge: "bg-yellow-500 text-white" },
                        { active: "bg-amber-50 text-amber-700 border border-amber-200", badge: "bg-amber-500 text-white" },
                        { active: "bg-orange-50 text-orange-700 border border-orange-200", badge: "bg-orange-500 text-white" },
                        { active: "bg-yellow-50 text-yellow-700 border border-yellow-200", badge: "bg-yellow-400 text-white" },
                        { active: "bg-amber-50 text-amber-700 border border-amber-200", badge: "bg-amber-400 text-white" },
                      ];
                      const gs = gradeStyles[i] || gradeStyles[0];
                      return (
                        <motion.div
                          key={g.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <button
                            onClick={() => setExpandedGrade(isExpanded ? null : g.id)}
                            className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-xl text-sm transition-all duration-200 ${
                              isExpanded ? gs.active : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            <span className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isExpanded ? gs.badge : "bg-gray-100 text-gray-500"
                            } transition-all`}>
                              {g.level}
                            </span>
                            <span className="flex-1 text-left font-medium">Grade {g.level}</span>
                            <ChevronDown className={`size-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-gray-700" : "text-gray-400"}`} />
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-8 pl-3 border-l-2 border-gray-200 space-y-0.5 py-1 overflow-hidden"
                              >
                                {allowedSubjects.map((s) => {
                                  const isSelected = currentNav.gradeId === g.id && currentNav.subjectId === s.id;
                                  return (
                                    <motion.button
                                      key={s.id}
                                      whileHover={{ x: 4 }}
                                      onClick={() => {
                                        setInitialGradeNav({ gradeId: g.id, subjectId: s.id });
                                        setGradesKey((k) => k + 1);
                                        setActive("grades");
                                      }}
                                      className={`w-full px-2 py-2 flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all ${
                                        isSelected ? "bg-yellow-50 text-yellow-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      <div className="size-6 flex items-center justify-center shrink-0">
                                        {s.iconImage ? (
                                          <img src={s.iconImage} alt={s.name} className="size-6 object-contain" />
                                        ) : (
                                          <span className="text-base">{s.icon}</span>
                                        )}
                                      </div>
                                      <span>{s.name}</span>
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Admin card */}
          <div className="p-3 border-t border-gray-100">
            <div className={`bg-gray-50 rounded-xl p-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
              <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                <div className="relative">
                  <div className="size-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    AD
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">Admin</div>
                    <div className="text-[11px] text-gray-400 truncate">Administrator</div>
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                title={collapsed ? "Log out" : undefined}
                className={`w-full mt-2 h-9 ${collapsed ? "justify-center px-0" : "px-3"} rounded-lg flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all`}
              >
                <LogOut className="size-4 shrink-0" />
                {!collapsed && <span>Log out</span>}
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Content header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCollapsed((c) => !c)}
                className="h-10 w-10 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-400/20 flex items-center justify-center transition-all"
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
              </motion.button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <div className="flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                <button onClick={() => { setActive("dashboard"); setCurrentNav({}); }} className="text-gray-500 hover:text-indigo-600 transition-colors font-medium px-2 py-0.5 rounded-full hover:bg-indigo-50">Workspace</button>
                <ChevronRight className="size-3 text-gray-300" />
                {active === "subjects" && (
                  <>
                    <button onClick={() => { setInitialSubjectsNav(undefined); setSubjectsKey((k) => k + 1); setActive("subjects"); setCurrentNav({}); }} className={`transition-colors px-2 py-0.5 rounded-full ${currentNav.subjectId || currentNav.gradeId ? 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium' : 'text-indigo-600 font-semibold bg-indigo-50'}`}>Subjects</button>
                    {currentNav.subjectId && (
                      <>
                        <ChevronRight className="size-3 text-gray-300" />
                        <button onClick={() => { setInitialSubjectsNav({ subjectId: currentNav.subjectId }); setSubjectsKey((k) => k + 1); setActive("subjects"); setCurrentNav({ subjectId: currentNav.subjectId }); }} className={`transition-colors px-2 py-0.5 rounded-full capitalize ${currentNav.gradeId ? 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium' : 'text-indigo-600 font-semibold bg-indigo-50'}`}>{currentNav.subjectId}</button>
                      </>
                    )}
                    {currentNav.gradeId && (
                      <>
                        <ChevronRight className="size-3 text-gray-300" />
                        <button className="text-indigo-600 font-semibold px-2 py-0.5 rounded-full bg-indigo-50">Grade {grades.find((g) => g.id === currentNav.gradeId)?.level || currentNav.gradeId}</button>
                      </>
                    )}
                  </>
                )}
                {active === "grades" && (
                  <>
                    <button onClick={() => { setInitialGradeNav(undefined); setGradesKey((k) => k + 1); setActive("grades"); setCurrentNav({}); }} className={`transition-colors px-2 py-0.5 rounded-full ${currentNav.gradeId ? 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium' : 'text-indigo-600 font-semibold bg-indigo-50'}`}>Grades</button>
                    {currentNav.gradeId && (
                      <>
                        <ChevronRight className="size-3 text-gray-300" />
                        <button onClick={() => { setGradesKey((k) => k + 1); setInitialGradeNav({ gradeId: currentNav.gradeId! }); }} className={`transition-colors px-2 py-0.5 rounded-full ${currentNav.subjectId ? 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium' : 'text-indigo-600 font-semibold bg-indigo-50'}`}>Grade {grades.find((g) => g.id === currentNav.gradeId)?.level || currentNav.gradeId}</button>
                      </>
                    )}
                    {currentNav.subjectId && (
                      <>
                        <ChevronRight className="size-3 text-gray-300" />
                        <span className="text-indigo-600 font-semibold px-2 py-0.5 rounded-full bg-indigo-50 capitalize">{currentNav.subjectId}</span>
                      </>
                    )}
                  </>
                )}
                {active === "dashboard" && (
                  <span className="text-indigo-600 font-semibold px-2 py-0.5 rounded-full bg-indigo-50">Dashboard</span>
                )}
              </div>
            </div>
          </div>

          {/* Content body */}
          <div key={active} className="flex-1 overflow-y-auto overflow-x-hidden p-6 animate-fade-in-up flex flex-col">
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

          {/* Footer */}
          <footer className="h-12 border-t border-gray-200 bg-white px-6 flex items-center justify-center gap-2 shrink-0">
            <span className="text-sm text-gray-500">
              &copy; 2026 Assessment CMS · All rights reserved by
            </span>
            <div className="flex items-center gap-1.5">
              <img
                src="/images/icon.png"
                alt="Wise Wings"
                className="h-5 w-5 rounded-sm object-contain"
              />
              <span className="font-semibold text-sm text-gray-700">
                wise wings
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
