import { useEffect, useState, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight, ChevronDown, ArrowLeft, GraduationCap, BookOpen, FileText, Clock, CheckCircle2, Lock, PlayCircle, Trophy, Star, Zap, Target, Flame, Shield, MoreVertical, ArrowRight, Microscope, Globe } from "lucide-react";

function HindiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor" stroke="none" fontFamily="serif">अ</text>
    </svg>
  );
}
import { grades, allSubjects, allLessons, type Lesson, type Subject, type Grade } from "@/lib/curriculum";

const subjectIcons: Record<string, any> = {
  science: Microscope,
  hindi: HindiIcon,
  social: Globe,
  english: BookOpen,
};

function showComingSoon(subjectId: string, gradeId?: string): boolean {
  if (subjectId === "english") return true;
  if (subjectId === "social") {
    if (!gradeId) return false;
    const level = Number(String(gradeId).replace(/\D/g, "")) || 0;
    return level > 0 && level < 3;
  }
  return false;
}

type Nav = {
  gradeId?: string;
  subjectId?: string;
  lessonId?: string;
  mode?: "read";
};

function Crumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap bg-gray-50 rounded-lg px-3 py-2 border border-border/50">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-4 text-gray-600/60" />}
          {it.onClick ? (
            <button onClick={it.onClick} className="text-foreground font-medium hover:text-primary hover:underline transition-colors">
              {it.label}
            </button>
          ) : (
            <span className="text-foreground font-bold">{it.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

type LessonStatus = "completed" | "in-progress" | "locked";

function getLessonStatuses(total: number): LessonStatus[] {
  const completedCount = Math.max(0, Math.min(total - 1, Math.floor(total * 0.5)));
  const inProgressCount = completedCount < total ? 1 : 0;
  return Array.from({ length: total }, (_, i) => {
    if (i < completedCount) return "completed";
    if (i === completedCount) return "in-progress";
    return "locked";
  });
}

function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text.split("").map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"[Math.floor(Math.random() * 70)]).join(""));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let iteration = 0;
    const maxIterations = text.length;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < iteration) return char;
            const threshold = (i % 3 === 0) ? iteration - 1 : iteration;
            if (i < threshold) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDone(true);
      }
      iteration += 1;
    }, 55);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {display}
      {!done && <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = 0;
          const end = target;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function BackBtn({ onClick, label = "Go back" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="cms-back-btn" aria-label={label} title={label}>
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function SubjectLessonView({
  subject,
  gradeId,
  gradeLabel,
  onOpenLesson,
  onBack,
}: {
  subject: Subject;
  gradeId: string;
  gradeLabel: string;
  onOpenLesson: () => void;
  onBack: () => void;
  crumbs?: { label: string; onClick?: () => void }[];
}) {
  const lessons = subject.lessons;

  return (
    <div className="cms-shell cms-shell-page">
      <div className="cms-toolbar">
        <BackBtn onClick={onBack} label="Back to subjects" />
        <h2 className="cms-page-title">{subject.name} – {gradeLabel}</h2>
      </div>

      <div className="cms-card cms-card-fill">
        <div className="cms-card-header">
          <span className="text-base font-semibold text-[#1a2332]">Lessons</span>
        </div>
        <div className="cms-card-body">
          {lessons.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-5 py-16 text-center">
              <div>
                <Clock className="size-9 text-[#64748b] mx-auto mb-3" />
                <p className="text-lg font-semibold text-[#1a2332]">Coming Soon</p>
                <p className="text-base text-[#334155] mt-1">Lessons for this subject are being prepared.</p>
              </div>
            </div>
          ) : (
            <div className="cms-lesson-grid">
              {lessons.map((l, i) => {
                const isComingSoon = showComingSoon(subject.id, gradeId);
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-disabled={isComingSoon}
                    disabled={isComingSoon}
                    className="cms-lesson-card"
                    onClick={() => {
                      if (isComingSoon) return;
                      if (l.htmlPath) {
                        window.open(l.htmlPath, "_blank");
                      } else {
                        onOpenLesson();
                      }
                    }}
                  >
                    <div className="cms-lesson-number">
                      <span className="text-xl font-bold leading-none">{i + 1}</span>
                      <span className="text-sm font-semibold leading-none">Lesson</span>
                    </div>
                    <div className="cms-lesson-info">
                      <div className="cms-lesson-title">{subject.name} – Lesson{i + 1}</div>
                      <div className="text-base font-semibold text-[#1a2332]">Exercise for lesson {i + 1}</div>
                      <div className="flex items-center gap-1.5 text-base font-semibold text-[#1a2332] mt-0.5">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Interactive assessments
                      </div>
                    </div>
                    {!isComingSoon && <span className="cms-lesson-action">Open →</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonReader({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-600 font-mono-ui">Lesson</div>
          <h2 className="text-lg font-semibold tracking-tight mt-0.5">{lesson.title}</h2>
        </div>
        <button
          onClick={onBack}
          className="h-8 px-3 rounded-md border border-border text-xs hover:bg-muted inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">{lesson.summary}</p>
        <div>
          <h3 className="text-sm font-semibold mb-2">Key points</h3>
          <ul className="space-y-1.5">
            {lesson.content.map((c, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary font-mono-ui text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        {lesson.quiz.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-3">Quiz</h3>
            <div className="space-y-4">
              {lesson.quiz.map((q, qi) => {
                const answered = selected[qi] !== undefined;
                return (
                  <div key={qi} className="border border-border rounded-lg p-4">
                    <p className="text-sm font-medium mb-3">
                      {qi + 1}. {q.q}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const chosen = selected[qi] === oi;
                        const isCorrect = oi === q.answer;
                        return (
                          <button
                            key={oi}
                            onClick={() => setSelected((s) => ({ ...s, [qi]: oi }))}
                            disabled={answered}
                            className={`w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                              answered
                                ? isCorrect
                                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 font-medium"
                                  : chosen
                                    ? "border-destructive/50 bg-destructive/10 text-destructive font-medium"
                                    : "border-border opacity-50"
                                : "border-border hover:border-primary/40 hover:bg-muted"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function SubjectCard({ subject, onOpen, gradeLabel }: { subject: Subject; onOpen: () => void; gradeLabel?: string }) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-card border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/40 transition-all group"
    >
      <div className={`inline-flex items-center justify-center size-12 rounded-lg ${subject.color} text-xl`}>
        {(() => { const Icon = subjectIcons[subject.id] || BookOpen; return <Icon className="size-8" />; })()}
      </div>
      <div className="mt-3 text-lg font-semibold text-gray-800">{subject.name}</div>
      {gradeLabel && (
        <div className="font-mono-ui text-[11px] uppercase tracking-widest mt-0.5 text-gray-500">
          {gradeLabel}
        </div>
      )}
      <div className="mt-2 text-sm text-gray-600">{subject.lessons.length} lessons</div>
      <div className="mt-3 text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Open <ChevronRight className="size-4" />
      </div>
    </button>
  );
}

const gradeDescriptions: Record<number, string> = {
  1: "Start exploring the basics and building foundation",
  2: "Strengthen concepts and build confidence",
  3: "Learn, practice and grow every day",
  4: "Expand knowledge and think beyond",
  5: "Master skills and prepare for the future",
};

const gradeColors = [
  { iconBg: "bg-blue-100", iconText: "text-blue-600", title: "text-blue-600", border: "border-blue-200", btnBg: "bg-blue-50", btnText: "text-blue-600", btnHover: "hover:bg-blue-100", shadow: "shadow-blue-200/60", ring: "ring-blue-200" },
  { iconBg: "bg-emerald-100", iconText: "text-emerald-600", title: "text-emerald-600", border: "border-emerald-200", btnBg: "bg-emerald-50", btnText: "text-emerald-600", btnHover: "hover:bg-emerald-100", shadow: "shadow-emerald-200/60", ring: "ring-emerald-200" },
  { iconBg: "bg-amber-100", iconText: "text-amber-600", title: "text-amber-600", border: "border-amber-200", btnBg: "bg-amber-50", btnText: "text-amber-600", btnHover: "hover:bg-amber-100", shadow: "shadow-amber-200/60", ring: "ring-amber-200" },
  { iconBg: "bg-purple-100", iconText: "text-purple-600", title: "text-purple-600", border: "border-purple-200", btnBg: "bg-purple-50", btnText: "text-purple-600", btnHover: "hover:bg-purple-100", shadow: "shadow-purple-200/60", ring: "ring-purple-200" },
  { iconBg: "bg-rose-100", iconText: "text-rose-600", title: "text-rose-600", border: "border-rose-200", btnBg: "bg-rose-50", btnText: "text-rose-600", btnHover: "hover:bg-rose-100", shadow: "shadow-rose-200/60", ring: "ring-rose-200" },
];

function GradeCard({ grade, onOpen, index }: { grade: Grade; onOpen: () => void; index?: number }) {
  const totalLessons = grade.subjects.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <tr
      onClick={onOpen}
      className="group cms-row-clickable"
    >
      <td className="cms-sno">
        {(index ?? 0) + 1}
      </td>
      <td>
        <span className="cms-link">
          Grade {grade.level}
        </span>
      </td>
      <td>
        {grade.subjects.filter((s) => allowedSubjectIds.includes(s.id)).length}
      </td>
      <td>
        {totalLessons}
      </td>
    </tr>
  );
}

export function GradesView({ initialNav, onNavChange }: { initialNav?: Nav; onNavChange?: (nav: Nav) => void } = {}) {
  const [nav, setNav] = useState<Nav>(initialNav ?? {});

  const setNavTracked = (next: Nav) => {
    setNav(next);
    onNavChange?.(next);
  };

  useEffect(() => {
    onNavChange?.(initialNav ?? {});
  }, []);

  const grade = grades.find((g) => g.id === nav.gradeId);
  const subject = grade?.subjects.find((s) => s.id === nav.subjectId);
  const lesson = subject?.lessons.find((l) => l.id === nav.lessonId);

  if (lesson) {
    return (
      <div key={`lesson-${lesson.id}`} className="space-y-4 animate-view-in">
        <Crumbs
          items={[
            { label: "Grades", onClick: () => setNavTracked({}) },
            { label: grade!.label, onClick: () => setNavTracked({ gradeId: grade!.id }) },
            { label: subject!.name, onClick: () => setNavTracked({ gradeId: grade!.id, subjectId: subject!.id }) },
            { label: lesson.title },
          ]}
        />
        <LessonReader
          lesson={lesson}
          onBack={() => setNavTracked({ gradeId: grade!.id, subjectId: subject!.id })}
        />
      </div>
    );
  }

  if (subject) {
    return (
      <SubjectLessonView
        key={`subject-${subject.id}`}
        subject={subject}
        gradeId={grade!.id}
        gradeLabel={grade!.label}
        onOpenLesson={() => {
          const isComingSoon = showComingSoon(subject.id, grade!.id);
          if (isComingSoon) return;
          const firstIncomplete = subject.lessons.find((l) => l.htmlPath);
          if (firstIncomplete) {
            window.open(firstIncomplete.htmlPath, "_blank");
          } else {
            const nonHtml = subject.lessons[0];
            if (nonHtml) setNavTracked({ gradeId: grade!.id, subjectId: subject.id, lessonId: nonHtml.id });
          }
        }}
        onBack={() => setNavTracked({ gradeId: grade!.id })}
      />
    );
  }

  if (grade) {
    const filteredSubjects = grade.subjects.filter((s) => allowedSubjectIds.includes(s.id));

    return (
      <div className="cms-shell cms-shell-page">
        <div className="cms-toolbar">
          <BackBtn onClick={() => setNavTracked({})} label="Back to grades" />
          <h2 className="cms-page-title">Grade {grade.level} – Subjects</h2>
        </div>

        <div className="cms-card cms-card-fill">
          <div className="cms-card-header">
            <span className="text-base font-semibold text-[#1a2332]">Subjects in this grade</span>
          </div>
          <div className="cms-card-body">
            <div className="cms-entity-grid">
              {filteredSubjects.map((s) => {
                const lessonCount = s.lessons.length;
                const isComingSoon = showComingSoon(s.id, grade.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setNavTracked({ gradeId: grade.id, subjectId: s.id });
                    }}
                    className="cms-entity-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="cms-entity-icon">
                        {(() => { const Icon = subjectIcons[s.id] || BookOpen; return <Icon className="cms-entity-icon-svg" />; })()}
                      </div>
                      <span className={`cms-status ${isComingSoon ? "cms-status-soon" : "cms-status-active"}`}>
                        {isComingSoon ? "Coming Soon" : "Active"}
                      </span>
                    </div>
                    <div>
                      <div className="cms-entity-title">{s.name}</div>
                      <div className="cms-entity-desc" style={s.id === 'hindi' ? { fontWeight: 700 } : undefined}>{s.description}</div>
                    </div>
                    <div className="cms-entity-meta">
                      <div>
                        <div className="cms-entity-meta-label">Lessons</div>
                        <div className="cms-entity-meta-value">{lessonCount}</div>
                      </div>
                      <div>
                        <div className="cms-entity-meta-label">Status</div>
                        <div className="cms-entity-meta-value">{isComingSoon ? "Soon" : "Active"}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-shell cms-shell-page">
      <div className="cms-toolbar">
        <h2 className="cms-page-title">Active Grades</h2>
      </div>

      <div className="cms-card cms-card-fill">
        <div className="cms-card-header">
          <span className="text-base font-semibold text-[#1a2332]">Select a grade to manage subjects</span>
        </div>
        <div className="cms-card-body">
          <div className="cms-grade-grid">
            {grades.map((g) => {
              const totalLessons = g.subjects.reduce((acc, s) => acc + s.lessons.length, 0);
              const subjectCount = g.subjects.filter((s) => allowedSubjectIds.includes(s.id)).length;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setNavTracked({ gradeId: g.id, subjectId: nav.subjectId })}
                  className="cms-entity-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="cms-entity-icon">
                      <GraduationCap className="cms-entity-icon-svg" />
                    </div>
                    <span className="cms-status cms-status-active">Active</span>
                  </div>
                  <div className="cms-entity-title">Grade {g.level}</div>
                  <div className="cms-entity-desc">{gradeDescriptions[g.level]}</div>
                  <div className="cms-entity-meta">
                    <div>
                      <div className="cms-entity-meta-label">Subjects</div>
                      <div className="cms-entity-meta-value">{subjectCount}</div>
                    </div>
                    <div>
                      <div className="cms-entity-meta-label">Lessons</div>
                      <div className="cms-entity-meta-value">{totalLessons}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonList({ lessons, onOpen }: { lessons: Lesson[]; onOpen: (l: Lesson) => void }) {
  return (
    <div className="space-y-4 stagger">
      {lessons.map((l, i) => (
        <button
          key={l.id}
          onClick={() => {
            if (l.htmlPath) {
              window.open(l.htmlPath, "_blank");
            } else {
              onOpen(l);
            }
          }}
          className="w-full bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-5 hover:shadow-sm hover:border-primary/40 transition-all group"
        >
          <span className="size-12 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-base 2xl:text-xl font-medium flex-1 text-left">Lesson {i + 1}</span>
          <span className="text-sm text-white font-medium inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
            Open <ChevronRight className="size-4" />
          </span>
        </button>
      ))}
    </div>
  );
}

const allowedSubjectIds = ["english", "hindi", "science", "social"];

export function SubjectsView({ onOpenLesson, onNavChange, initialSubjectId, initialGradeId }: { onOpenLesson: (path: { gradeId: string; subjectId: string; lessonId: string }) => void; onNavChange?: (nav: { gradeId?: string; subjectId?: string }) => void; initialSubjectId?: string; initialGradeId?: string }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubjectId ?? null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(initialGradeId ?? null);

  const subject = allSubjects.find((s) => s.id === selectedSubject && s.gradeId === selectedGrade);

  // Step 3: Show lessons
  if (subject) {
    const gradeLabel = grades.find((g) => g.id === selectedGrade)?.label;
    return (
      <SubjectLessonView
        subject={subject}
        gradeId={selectedGrade || ""}
        gradeLabel={gradeLabel || ""}
        onOpenLesson={() => {
          const isComingSoon = showComingSoon(subject.id, selectedGrade || undefined);
          if (isComingSoon) return;
          const firstWithHtml = subject.lessons.find((l) => l.htmlPath);
          if (firstWithHtml) {
            window.open(firstWithHtml.htmlPath, "_blank");
          } else {
            const nonHtml = subject.lessons[0];
            if (nonHtml) onOpenLesson({ gradeId: selectedGrade || "", subjectId: subject.id, lessonId: nonHtml.id });
          }
        }}
        onBack={() => { setSelectedGrade(null); onNavChange?.({ subjectId: selectedSubject || undefined }); }}
      />
    );
  }

  // Step 2: Show grades for selected subject
  if (selectedSubject) {
    const subjectData = allSubjects.find((s) => s.id === selectedSubject);

    return (
      <div className="cms-shell cms-shell-page">
        <div className="cms-toolbar">
          <BackBtn
            onClick={() => {
              setSelectedSubject(null);
              setSelectedGrade(null);
              onNavChange?.({});
            }}
            label="Back to subjects"
          />
          <h2 className="cms-page-title">{subjectData?.name} – Grades</h2>
        </div>

        <div className="cms-card cms-card-fill">
          <div className="cms-card-header">
            <span className="text-base font-semibold text-[#1a2332]">Choose a grade for this subject</span>
          </div>
          <div className="cms-card-body">
            <div className="cms-entity-grid">
              {grades.map((g) => {
                const isComingSoon = showComingSoon(selectedSubject!, g.id);
                const lessonCount = g.subjects.find((s) => s.id === selectedSubject)?.lessons.length || 0;
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-disabled={isComingSoon}
                    disabled={isComingSoon}
                    onClick={() => {
                      if (isComingSoon) return;
                      setSelectedGrade(g.id);
                      onNavChange?.({ subjectId: selectedSubject || undefined, gradeId: g.id });
                    }}
                    className="cms-entity-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="cms-entity-icon">
                        <GraduationCap className="cms-entity-icon-svg" />
                      </div>
                      <span className={`cms-status ${isComingSoon ? "cms-status-soon" : "cms-status-active"}`}>
                        {isComingSoon ? "Coming Soon" : "Active"}
                      </span>
                    </div>
                    <div className="cms-entity-title">Grade {g.level}</div>
                    <div className="cms-entity-meta">
                      <div>
                        <div className="cms-entity-meta-label">Lessons</div>
                        <div className="cms-entity-meta-value">{lessonCount}</div>
                      </div>
                      <div>
                        <div className="cms-entity-meta-label">Status</div>
                        <div className="cms-entity-meta-value">{isComingSoon ? "Soon" : "Active"}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Show subject list (cards) — no back button on root
  const uniqueSubjects = allSubjects
    .filter((s) => allowedSubjectIds.includes(s.id))
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const getSubjectTotalLessons = (subjectId: string) =>
    grades.reduce((acc, g) => {
      const subj = g.subjects.find((gs) => gs.id === subjectId);
      return acc + (subj ? subj.lessons.length : 0);
    }, 0);

  return (
    <div className="cms-shell cms-shell-page">
      <div className="cms-toolbar">
        <h2 className="cms-page-title">Active Subjects</h2>
      </div>

      <div className="cms-card cms-card-fill">
        <div className="cms-card-header">
          <span className="text-base font-semibold text-[#1a2332]">Curriculum subjects</span>
        </div>
        <div className="cms-card-body">
          <div className="cms-entity-grid cms-entity-grid-4">
            {uniqueSubjects.map((s) => {
              const totalLessons = getSubjectTotalLessons(s.id);
              const isComingSoon = showComingSoon(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(s.id);
                    onNavChange?.({ subjectId: s.id });
                  }}
                  className="cms-entity-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="cms-entity-icon">
                      {(() => { const Icon = subjectIcons[s.id] || BookOpen; return <Icon className="cms-entity-icon-svg" />; })()}
                    </div>
                    <span className={`cms-status ${isComingSoon ? "cms-status-soon" : "cms-status-active"}`}>
                      {isComingSoon ? "Coming Soon" : "Active"}
                    </span>
                  </div>
                  <div>
                    <div className="cms-entity-title">{s.name}</div>
                      <div className="cms-entity-desc" style={s.id === 'hindi' ? { fontWeight: 700 } : undefined}>{s.description}</div>
                    </div>
                    <div className="cms-entity-meta">
                      <div>
                        <div className="cms-entity-meta-label">Lessons</div>
                        <div className="cms-entity-meta-value">{totalLessons}</div>
                    </div>
                    <div>
                      <div className="cms-entity-meta-label">Grades</div>
                      <div className="cms-entity-meta-value">{grades.length}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonsView({ onOpenLesson }: { onOpenLesson: (path: { gradeId: string; subjectId: string; lessonId: string }) => void }) {
  const [q, setQ] = useState("");
  const filtered = allLessons.filter(
    (l) =>
      l.title.toLowerCase().includes(q.toLowerCase()) ||
      l.subjectName.toLowerCase().includes(q.toLowerCase()) ||
      l.gradeLabel.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-4 p-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="cms-page-title">All Lessons</h2>
          <p className="text-base text-[#323130] mt-1">{allLessons.length} lessons across Grades 1 – 5.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lessons…"
          className="h-10 px-3 w-72 rounded-sm bg-white border border-[#8a8886] text-base text-[#242424] placeholder:text-[#605e5c] focus:outline-none focus:ring-1 focus:ring-[#0078D4]"
        />
      </div>
      <div className="bg-white border border-[#e1dfdd] rounded-sm overflow-hidden">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Subject</th>
              <th>Grade</th>
              <th className="text-right">Quiz</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const isComingSoon = showComingSoon(l.subjectId, l.gradeId);
              return (
                <tr
                  key={`${l.gradeId}-${l.subjectId}-${l.id}`}
                  className={`group ${isComingSoon ? '' : 'cms-row-clickable'}`}
                  onClick={() => {
                    if (isComingSoon) return;
                    if (l.htmlPath) {
                      window.open(l.htmlPath, "_blank");
                    } else {
                      onOpenLesson({ gradeId: l.gradeId, subjectId: l.subjectId, lessonId: l.id });
                    }
                  }}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-[#323130] shrink-0" />
                      <span className={isComingSoon ? 'font-medium text-[#242424]' : 'cms-link'}>{l.title}</span>
                    </div>
                  </td>
                  <td>{l.subjectName}</td>
                  <td>{l.gradeLabel}</td>
                  <td className="text-right font-medium">
                    {isComingSoon ? (
                      <span className="cms-status cms-status-soon">Soon</span>
                    ) : (
                      `${l.quiz.length}Q`
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-base text-[#323130] py-8">
                  No lessons match "{q}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OverviewView({
  onOpenSubject,
  onNavigate,
}: {
  onOpenSubject?: (subjectId: string) => void;
  onNavigate?: (view: string, opts?: { gradeId?: string; subjectId?: string }) => void;
} = {}) {
  const totalSubjects = allSubjects.filter((s) => allowedSubjectIds.includes(s.id)).length / 5;

  const totalLessons = grades.reduce((acc, g) => acc + g.subjects.reduce((a, s) => a + s.lessons.length, 0), 0);

  const finalChartData = grades.map((g) => ({
    name: `Grade ${g.level}`,
    subjects: g.subjects.filter((s) => allowedSubjectIds.includes(s.id)).length,
    lessons: g.subjects.reduce((acc, s) => acc + s.lessons.length, 0),
  }));

  const [chartData, setChartData] = useState(
    finalChartData.map((d) => ({ ...d, subjects: 0, lessons: 0 }))
  );

  useEffect(() => {
    const duration = 700;
    const steps = 28;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setChartData(
        finalChartData.map((d) => ({
          ...d,
          subjects: Math.round(d.subjects * eased),
          lessons: Math.round(d.lessons * eased),
        }))
      );

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
    // Animate once on mount with stable grade targets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cms-shell cms-shell-page">
      <div className="cms-card">
        <div className="cms-dash-welcome">
          <h1 className="cms-dash-welcome-title">Welcome Admin</h1>
        </div>
      </div>

      <div className="cms-stat-row">
        {[
          { label: "Grades", value: 5, icon: GraduationCap },
          { label: "Subjects", value: totalSubjects, icon: BookOpen },
          { label: "Lessons", value: totalLessons, icon: FileText },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="cms-card cms-stat-card">
              <div className="cms-stat-card-inner">
                <div className="cms-stat-icon">
                  <Icon className="cms-stat-icon-svg" />
                </div>
                <div>
                  <div className="cms-stat-value">{s.value}</div>
                  <div className="cms-stat-label">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cms-card">
        <div className="cms-card-header">
          <div>
            <h2 className="cms-section-title">Overview</h2>
            <p className="cms-section-sub">Content distribution across grades</p>
          </div>
          <div className="cms-chart-legend">
            <div className="cms-chart-legend-item">
              <div className="cms-legend-dot cms-legend-subjects" />
              <span>Subjects</span>
            </div>
            <div className="cms-chart-legend-item">
              <div className="cms-legend-dot cms-legend-lessons" />
              <span>Lessons</span>
            </div>
          </div>
        </div>
        <div className="cms-chart-pad">
          <div className="cms-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF2" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#1a2332", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#1a2332", fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "4px", border: "1px solid #D0D7DE", fontSize: "13px", color: "#1a2332" }} />
                <Bar dataKey="subjects" fill="#0F6CBD" radius={[2, 2, 0, 0]} maxBarSize={32} isAnimationActive={false} label={{ position: "top", fontSize: 11, fill: "#0F6CBD", fontWeight: 700 }} />
                <Bar dataKey="lessons" fill="#50A5E8" radius={[2, 2, 0, 0]} maxBarSize={32} isAnimationActive={false} label={{ position: "top", fontSize: 11, fill: "#1a6fb5", fontWeight: 700 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="cms-card">
        <div className="cms-card-header">
          <h2 className="cms-page-title">Grade List</h2>
        </div>
        <div className="cms-grade-grid">
          {grades.map((g) => {
            const gLessons = g.subjects.reduce((a, s) => a + s.lessons.length, 0);
            const gSubjects = g.subjects.filter((s) => allowedSubjectIds.includes(s.id)).length;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onNavigate?.("grades", { gradeId: g.id })}
                className="cms-entity-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="cms-entity-icon">
                    <GraduationCap className="cms-entity-icon-svg" />
                  </div>
                  <span className="cms-status cms-status-active">Live</span>
                </div>
                <div className="cms-entity-title">Grade {g.level}</div>
                <div className="cms-entity-meta">
                  <div>
                    <div className="cms-entity-meta-label">Subjects</div>
                    <div className="cms-entity-meta-value">{gSubjects}</div>
                  </div>
                  <div>
                    <div className="cms-entity-meta-label">Lessons</div>
                    <div className="cms-entity-meta-value">{gLessons}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
