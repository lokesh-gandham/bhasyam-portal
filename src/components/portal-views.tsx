import { useEffect, useState, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight, ArrowLeft, GraduationCap, BookOpen, FileText, Clock, CheckCircle2, Lock, PlayCircle, Trophy, Star, Zap, Target, Flame, Shield, MoreVertical, ArrowRight } from "lucide-react";
import { grades, allSubjects, allLessons, type Lesson, type Subject, type Grade } from "@/lib/curriculum";

function showComingSoon(subjectId: string, gradeId?: string): boolean {
  if (subjectId === "english") return true;
  if (subjectId === "social" && gradeId && (gradeId === "grade-1" || gradeId === "grade-2")) return true;
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
    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-4 text-muted-foreground/60" />}
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

function SubjectLessonView({
  subject,
  gradeId,
  gradeLabel,
  onOpenLesson,
  onBack,
  crumbs,
}: {
  subject: Subject;
  gradeId: string;
  gradeLabel: string;
  onOpenLesson: () => void;
  onBack: () => void;
  crumbs: { label: string; onClick?: () => void }[];
}) {
  const lessons = subject.lessons;

  const subjectIllustrations: Record<string, string> = {
    science: "/images/scicon.png",
    hindi: "/images/hicon.png",
    social: "/images/sicon.png",
    english: "/images/englishicon1.png",
  };

  const subjectColors: Record<string, { banner: string; tag: string; tagText: string; dot: string }> = {
    science: { banner: "from-green-50 to-emerald-50", tag: "bg-green-100", tagText: "text-green-700", dot: "bg-green-500" },
    hindi: { banner: "from-orange-50 to-amber-50", tag: "bg-orange-100", tagText: "text-orange-700", dot: "bg-orange-500" },
    social: { banner: "from-blue-50 to-indigo-50", tag: "bg-blue-100", tagText: "text-blue-700", dot: "bg-blue-500" },
    english: { banner: "from-rose-50 to-pink-50", tag: "bg-rose-100", tagText: "text-rose-700", dot: "bg-rose-500" },
  };
  const colors = subjectColors[subject.id] || subjectColors.science;

    return (
    <div className="space-y-6 animate-view-in">
      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1.5 transition-colors font-medium"
      >
        <ArrowLeft className="size-4" /> Back to Grades
      </button>

      {/* Hero banner */}
      <div className={`relative bg-gradient-to-r ${colors.banner} rounded-2xl p-8 text-gray-800 overflow-hidden`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-20 size-32 border-2 border-gray-300 rounded-full" />
          <div className="absolute bottom-4 right-40 size-20 border-2 border-gray-300 rounded-full" />
          <div className="absolute top-10 right-60 size-16 border border-gray-300 rounded-full" />
        </div>
        <div className="relative flex items-center gap-6">
          <div className="size-24 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/80">
            {subject.iconImage ? (
              <img src={subject.iconImage} alt={subject.name} className="size-20 object-contain" />
            ) : (
              <span className="text-5xl">{subject.icon}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl 2xl:text-3xl font-semibold text-gray-800">{subject.name} &ndash; {gradeLabel}</h2>
            <p className="text-gray-600 mt-1 text-sm 2xl:text-base">{subject.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-semibold ${colors.tag} ${colors.tagText} px-3 py-1 rounded-full`}>
                {lessons.length > 0 ? `${lessons.length} Lessons` : 'Coming Soon'}
              </span>
            </div>
          </div>
          <div className="hidden md:block shrink-0">
            <img src={subjectIllustrations[subject.id]} alt="" className="size-32 object-contain drop-shadow-lg" />
          </div>
          <button
            onClick={onOpenLesson}
            className="shrink-0 bg-white/80 hover:bg-white backdrop-blur-sm border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-all"
          >
            Start Learning <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-5">All Lessons</h3>
        {lessons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-10 text-center"
          >
            <div className="size-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="size-8 text-amber-500" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Coming Soon</h4>
            <p className="text-sm text-gray-500 mt-1.5">Lessons for this subject are being prepared. Stay tuned!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lessons.map((l, i) => {
            const isComingSoon = showComingSoon(subject.id, gradeId);
            const lessonColors = [
              { bg: "bg-emerald-50", text: "text-emerald-600", ring: "hover:ring-emerald-200" },
              { bg: "bg-blue-50", text: "text-blue-600", ring: "hover:ring-blue-200" },
              { bg: "bg-amber-50", text: "text-amber-600", ring: "hover:ring-amber-200" },
              { bg: "bg-purple-50", text: "text-purple-600", ring: "hover:ring-purple-200" },
            ];
            const lc = lessonColors[i % lessonColors.length];
            return (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                key={l.id}
                onClick={() => {
                  if (isComingSoon) return;
                  if (l.htmlPath) {
                    window.open(l.htmlPath, "_blank");
                  } else {
                    onOpenLesson();
                  }
                }}
                disabled={isComingSoon}
                className={`bg-white border border-gray-100 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 group ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-2 ' + lc.ring}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-14 ${lc.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className={`text-xl font-bold ${lc.text}`}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-800">Lesson {i + 1}</h4>
                    {isComingSoon ? (
                      <span className="text-xs font-semibold text-amber-500 mt-1 inline-block">Coming Soon</span>
                    ) : (
                      <span className="text-xs text-gray-400 mt-0.5 inline-block">Click to open</span>
                    )}
                  </div>
                  {!isComingSoon && (
                    <ChevronRight className="size-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
          </div>
        )}
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
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono-ui">Lesson</div>
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
        <p className="text-sm text-muted-foreground">{lesson.summary}</p>
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
      className="text-left bg-card border border-border rounded-lg p-4 hover:shadow-sm hover:border-primary/40 transition-all group"
    >
      <div className={`inline-flex items-center justify-center size-10 rounded-lg ${subject.color} text-lg`}>
        {subject.iconImage ? (
          <img src={subject.iconImage} alt={subject.name} className="size-7 object-contain" />
        ) : (
          subject.icon
        )}
      </div>
      <div className="mt-3 text-base font-semibold">{subject.name}</div>
      {gradeLabel && (
        <div className="font-mono-ui text-[10px] uppercase tracking-widest mt-0.5">
          {gradeLabel}
        </div>
      )}
      <div className="mt-2 text-xs">{subject.lessons.length} lessons</div>
      <div className="mt-3 text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Open <ChevronRight className="size-3" />
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
  const c = gradeColors[(index ?? 0) % gradeColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -12, rotateX: 4, scale: 0.88, y: 30 }}
      animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.1, duration: 0.55, type: "spring", stiffness: 180, damping: 18 }}
      whileHover={{ scale: 1.04, rotateY: -6, rotateX: 2, y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.97, rotateY: 0, rotateX: 0 }}
      onClick={onOpen}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md cursor-pointer group flex flex-col"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="p-6 text-center flex flex-col flex-1">
        <motion.div
          whileHover={{ rotate: -10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`size-16 ${c.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
        >
          <GraduationCap className={`size-8 ${c.iconText}`} />
        </motion.div>
        <h3 className={`text-xl font-bold ${c.title}`}>Grade {grade.level}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed h-10">{gradeDescriptions[grade.level] || "Explore and learn"}</p>
        <div className="flex items-center justify-center gap-5 mt-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">{grade.subjects.length}</span>
            <span className="text-xs text-gray-400">Subjects</span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <FileText className="size-3.5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">{totalLessons}</span>
            <span className="text-xs text-gray-400">Lessons</span>
          </div>
        </div>
        <div className="mt-auto pt-5">
          <div className={`text-sm font-semibold ${c.btnText} flex items-center justify-center gap-1.5 group-hover:gap-2.5 transition-all`}>
            Explore Grade <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
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
        crumbs={[
          { label: "Grades", onClick: () => setNavTracked({}) },
          { label: grade!.label, onClick: () => setNavTracked({ gradeId: grade!.id }) },
          { label: subject.name },
        ]}
      />
    );
  }

  if (grade) {
    const subjectStyles: Record<string, { border: string; iconBg: string; progress: string; btnBg: string; btnText: string; btnHover: string }> = {
      science: { border: "border-l-emerald-400", iconBg: "bg-emerald-50", progress: "text-emerald-400", btnBg: "bg-emerald-50/80", btnText: "text-emerald-600", btnHover: "hover:bg-emerald-100" },
      hindi: { border: "border-l-amber-400", iconBg: "bg-amber-50", progress: "text-amber-400", btnBg: "bg-amber-50/80", btnText: "text-amber-600", btnHover: "hover:bg-amber-100" },
      social: { border: "border-l-blue-400", iconBg: "bg-blue-50", progress: "text-blue-400", btnBg: "bg-blue-50/80", btnText: "text-blue-600", btnHover: "hover:bg-blue-100" },
      english: { border: "border-l-rose-400", iconBg: "bg-rose-50", progress: "text-rose-400", btnBg: "bg-rose-50/80", btnText: "text-rose-600", btnHover: "hover:bg-rose-100" },
    };

    const subjectCardImages: Record<string, string> = {
      english: "/images/english bg.jpg",
      science: "/images/science bg ..jpg",
      hindi: "/images/hindibg.jpg",
      social: "/images/social bg.jpg",
    };

    const filteredSubjects = grade.subjects.filter((s) => allowedSubjectIds.includes(s.id));

    return (
      <div className="flex flex-col flex-1 animate-view-in min-h-0">
        <div className="relative flex items-center shrink-0 mb-4">
          <div className="absolute left-0">
            <button
              onClick={() => setNavTracked({})}
              className="text-sm 2xl:text-base text-gray-500 hover:text-gray-800 inline-flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="size-4 2xl:size-5" /> Back to Grades
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-3">
            <GraduationCap className="size-8 2xl:size-9 text-gray-700" />
            <h2 className="text-2xl 2xl:text-3xl font-semibold tracking-tight text-gray-800">{grade.label} – Subjects</h2>
          </div>
        </div>

        <div className="flex justify-center mt-12 2xl:mt-16 min-h-0" style={{ perspective: "1200px" }}>
          <div className="flex justify-center gap-4 sm:gap-5 2xl:gap-6 w-full max-w-6xl flex-wrap">
            {filteredSubjects.map((s, i) => {
              const sc = subjectStyles[s.id] || subjectStyles.science;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, rotateY: -15, rotateX: 5, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6, type: "spring", stiffness: 180, damping: 18 }}
                  whileHover={{ scale: 1.06, rotateY: -8, rotateX: 3, y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.96, rotateY: 0, rotateX: 0 }}
                  onClick={() => setNavTracked({ gradeId: grade.id, subjectId: s.id })}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md group flex flex-col cursor-pointer flex-1 min-w-0 w-full sm:w-auto"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={`h-36 sm:h-44 2xl:h-52 ${sc.iconBg} flex items-center justify-center p-2 relative shrink-0 overflow-hidden`}>
                    {subjectCardImages[s.id] ? (
                      <motion.img
                        src={subjectCardImages[s.id]}
                        alt={s.name}
                        className="w-full h-full object-contain"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                      />
                    ) : (
                      <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-sm text-gray-300">Subject Image</span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 2xl:px-6 pt-4 pb-2">
                    <div className={`size-14 2xl:size-16 ${sc.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3`}>
                      {s.iconImage ? (
                        <img src={s.iconImage} alt={s.name} className="size-9 2xl:size-11 object-contain" />
                      ) : (
                        <span className="text-3xl 2xl:text-4xl">{s.icon}</span>
                      )}
                    </div>
                    <h3 className="text-lg 2xl:text-xl font-bold text-gray-800">{s.name}</h3>
                    <p className="text-xs 2xl:text-sm text-gray-400 mt-1">{s.description}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => setNavTracked({ gradeId: grade.id, subjectId: s.id })}
                      className={`w-full ${sc.btnBg} ${sc.btnText} ${sc.btnHover} py-3 2xl:py-4 text-sm 2xl:text-base font-semibold flex items-center justify-center gap-2 transition-colors shrink-0`}
                    >
                      Explore & Learn <ChevronRight className="size-4 2xl:size-5" />
                    </button>
                  </div>
                </motion.div>
              );
          })}
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="flex flex-col flex-1 animate-view-in min-h-0 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center shrink-0"
        >
          <h2 className="text-3xl 2xl:text-4xl font-semibold tracking-tight text-gray-800">Grades</h2>
          <p className="text-sm 2xl:text-base text-gray-500 mt-1.5">Select a grade to explore subjects and lessons</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-0.5 bg-gray-300 rounded-full" />
            <Star className="size-3 text-amber-400 fill-amber-400" />
            <div className="w-8 h-0.5 bg-gray-300 rounded-full" />
          </div>
        </motion.div>

        <div className="flex justify-center mt-8 sm:mt-12 2xl:mt-16 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6 w-full max-w-5xl">
            {grades.map((g, i) => (
              <GradeCard key={g.id} grade={g} index={i} onOpen={() => setNavTracked({ gradeId: g.id })} />
            ))}
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
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);

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
        crumbs={[
          { label: "Subjects", onClick: () => { setSelectedSubject(null); setSelectedGrade(null); onNavChange?.({}); } },
          { label: subject.name, onClick: () => { setSelectedGrade(null); onNavChange?.({ subjectId: selectedSubject || undefined }); } },
          { label: gradeLabel || "" },
        ]}
      />
    );
  }

  // Step 2: Show grades for selected subject
  if (selectedSubject) {
    const subjectData = allSubjects.find((s) => s.id === selectedSubject);

    const gradeColors = [
      { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", numBg: "bg-blue-500", btn: "bg-blue-50 text-blue-600 hover:bg-blue-100", shadow: "shadow-blue-200/50" },
      { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", numBg: "bg-emerald-500", btn: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100", shadow: "shadow-emerald-200/50" },
      { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", numBg: "bg-amber-500", btn: "bg-amber-50 text-amber-600 hover:bg-amber-100", shadow: "shadow-amber-200/50" },
      { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", numBg: "bg-purple-500", btn: "bg-purple-50 text-purple-600 hover:bg-purple-100", shadow: "shadow-purple-200/50" },
      { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", numBg: "bg-rose-500", btn: "bg-rose-50 text-rose-600 hover:bg-rose-100", shadow: "shadow-rose-200/50" },
    ];

    const gradeDescriptions: Record<number, string> = {
      1: "Start exploring the basics and building foundation",
      2: "Strengthen concepts and build confidence",
      3: "Learn, practice and grow every day",
      4: "Expand knowledge and think beyond",
      5: "Master skills and prepare for the future",
    };

    const gradeDecorations: Record<number, string> = {
      1: "/images/Gemini_Generated_Image_g920mkg920mkg920.png",
      2: "/images/Gemini_Generated_Image_g920mkg920mkg920.png",
      3: "/images/Gemini_Generated_Image_g920mkg920mkg920.png",
      4: "/images/Gemini_Generated_Image_g920mkg920mkg920.png",
      5: "/images/Gemini_Generated_Image_g920mkg920mkg920.png",
    };

    return (
      <div className="flex flex-col flex-1 animate-view-in min-h-0 relative overflow-y-auto pb-6">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => { setSelectedSubject(null); onNavChange?.({}); }}
            className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors font-medium mb-4"
          >
            <ArrowLeft className="size-4" /> Back to Subjects
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="size-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
              {subjectData?.iconImage ? (
                <img src={subjectData.iconImage} alt={subjectData.name} className="size-10 object-contain" />
              ) : (
                <span className="text-3xl">{subjectData?.icon}</span>
              )}
            </div>
            <div>
              <h2 className="text-3xl 2xl:text-4xl font-semibold tracking-tight text-gray-800">{subjectData?.name}</h2>
              <p className="text-sm 2xl:text-base text-gray-500 mt-0.5">Select a grade to explore lessons and subjects</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 2xl:gap-5 relative">
          {grades.map((g, i) => {
            const isComingSoon = showComingSoon(selectedSubject!, g.id);
            const c = gradeColors[i] || gradeColors[0];
            const deco = gradeDecorations[g.level] || "📚";
            const totalLessons = g.subjects.reduce((a, s) => a + s.lessons.length, 0);
            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                key={g.id}
                className={`bg-white/80 backdrop-blur border ${c.border} rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                  if (isComingSoon) return;
                  setSelectedGrade(g.id);
                  onNavChange?.({ subjectId: selectedSubject || undefined, gradeId: g.id });
                }}
              >
                <div className="p-6 pb-4 flex flex-col items-center text-center">
                  {/* Number badge */}
                  <div className={`size-12 ${c.numBg} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${c.shadow} mb-3`}>
                    {g.level}
                  </div>

                  {/* Decoration */}
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-4xl">🎓</span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold ${c.text}`}>Grade {g.level}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed hidden sm:block">{gradeDescriptions[g.level]}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <BookOpen className="size-3.5" />
                      <span className="font-semibold">{g.subjects.length}</span>
                      <span className="hidden sm:inline">Subjects</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileText className="size-3.5" />
                      <span className="font-semibold">{totalLessons}</span>
                      <span className="hidden sm:inline">Lessons</span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="px-4 pb-4 mt-4">
                  <div className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${isComingSoon ? 'bg-gray-100 text-gray-400' : `${c.btn}`}`}>
                    {isComingSoon ? 'Coming Soon' : <>Explore Grade {g.level} <ArrowRight className="size-4" /></>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 shrink-0"
        >
          <span className="text-4xl">🏆</span>
          <div>
            <p className="text-sm font-semibold text-gray-700">Every grade is carefully designed to help students learn, practice and grow step by step.</p>
            <p className="text-sm text-gray-500 mt-0.5">Choose a grade to get started on an exciting learning journey!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 1: Show subject cards (carousel)
  const uniqueSubjects = allSubjects
    .filter((s) => allowedSubjectIds.includes(s.id))
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const subjectCardStyles: Record<string, { iconBg: string; iconText: string; nameText: string; tagBg: string; tagText: string; ring: string }> = {
    science: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", nameText: "text-emerald-600", tagBg: "bg-emerald-50", tagText: "text-emerald-600", ring: "ring-emerald-200" },
    hindi: { iconBg: "bg-purple-50", iconText: "text-purple-600", nameText: "text-purple-600", tagBg: "bg-purple-50", tagText: "text-purple-600", ring: "ring-purple-200" },
    social: { iconBg: "bg-orange-50", iconText: "text-orange-600", nameText: "text-orange-600", tagBg: "bg-orange-50", tagText: "text-orange-600", ring: "ring-orange-200" },
    english: { iconBg: "bg-blue-50", iconText: "text-blue-600", nameText: "text-blue-600", tagBg: "bg-blue-50", tagText: "text-blue-600", ring: "ring-blue-200" },
  };

  const getSubjectTotalLessons = (subjectId: string) =>
    grades.reduce((acc, g) => {
      const subj = g.subjects.find(gs => gs.id === subjectId);
      return acc + (subj ? subj.lessons.length : 0);
    }, 0);

  const nextSubject = () => setActiveSubjectIdx((prev) => (prev + 1) % uniqueSubjects.length);
  const prevSubject = () => setActiveSubjectIdx((prev) => (prev - 1 + uniqueSubjects.length) % uniqueSubjects.length);

  const getSlideStyle = (idx: number) => {
    const diff = idx - activeSubjectIdx;
    const wrapped = ((diff + uniqueSubjects.length + Math.floor(uniqueSubjects.length / 2)) % uniqueSubjects.length) - Math.floor(uniqueSubjects.length / 2);

    if (wrapped === 0) return { zIndex: 10, x: 0, scale: 1, opacity: 1, rotateY: 0, blur: 0 };
    if (wrapped === -1 || (wrapped === uniqueSubjects.length - 1 && uniqueSubjects.length === 3)) return { zIndex: 5, x: "-48%", scale: 0.82, opacity: 0.7, rotateY: 12, blur: 1 };
    if (wrapped === 1 || (wrapped === -(uniqueSubjects.length - 1) && uniqueSubjects.length === 3)) return { zIndex: 5, x: "48%", scale: 0.82, opacity: 0.7, rotateY: -12, blur: 1 };
    return { zIndex: 1, x: wrapped < 0 ? "-90%" : "90%", scale: 0.7, opacity: 0, rotateY: 0, blur: 2 };
  };

    return (
    <div className="flex flex-col flex-1 animate-view-in min-h-0">
      <div className="text-center shrink-0 mb-4">
        <h2 className="text-3xl 2xl:text-4xl font-semibold tracking-tight text-gray-800">Choose a Subject</h2>
        <p className="text-sm 2xl:text-base text-gray-500 mt-2">Pick a subject to see available grades and lessons</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-8 h-0.5 bg-gray-300 rounded-full" />
          <Star className="size-3 text-amber-400 fill-amber-400" />
          <div className="w-8 h-0.5 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative px-4 sm:px-8 lg:px-16">
        {/* Carousel */}
        <div className="relative w-full max-w-4xl h-72 sm:h-80 2xl:h-96" style={{ perspective: "1200px" }}>
          {uniqueSubjects.map((s, i) => {
            const c = subjectCardStyles[s.id] || subjectCardStyles.science;
            const totalLessons = getSubjectTotalLessons(s.id);
            const slide = getSlideStyle(i);
            const isActive = i === activeSubjectIdx;

            return (
              <motion.div
                key={s.id}
                animate={{
                  x: slide.x,
                  scale: slide.scale,
                  opacity: slide.opacity,
                  rotateY: slide.rotateY,
                  filter: `blur(${slide.blur}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 1,
                  opacity: { duration: 0.4 },
                  filter: { duration: 0.4 },
                }}
                style={{ zIndex: slide.zIndex }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <button
                  onClick={() => {
                    if (isActive) {
                      setSelectedSubject(s.id);
                      onNavChange?.({ subjectId: s.id });
                    } else {
                      setActiveSubjectIdx(i);
                    }
                  }}
                  className={`w-[85%] sm:w-[70%] max-w-md bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 2xl:p-10 text-center transition-all duration-500 ${isActive ? `shadow-2xl ring-2 ${c.ring}` : 'shadow-md border border-gray-100 cursor-default'}`}
                >
                  <div className={`mx-auto size-20 sm:size-28 2xl:size-32 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-5 transition-all duration-500 ${isActive ? `${c.iconBg} scale-100` : 'bg-gray-50 scale-90'}`}>
                    {s.iconImage ? (
                      <img src={s.iconImage} alt={s.name} className={`size-12 sm:size-16 2xl:size-20 object-contain transition-all duration-500 ${isActive ? '' : 'opacity-60'}`} />
                    ) : (
                      <span className={`text-4xl sm:text-6xl 2xl:text-7xl transition-all duration-500 ${isActive ? '' : 'opacity-60 grayscale'}`}>{s.icon}</span>
                    )}
                  </div>
                  <h3 className={`text-xl sm:text-3xl 2xl:text-4xl font-semibold mb-1 transition-colors duration-500 ${isActive ? c.nameText : 'text-gray-400'}`}>{s.name}</h3>
                  <p className={`text-sm sm:text-base 2xl:text-lg mb-4 transition-colors duration-500 ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>{s.description}</p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <span className={`text-sm font-semibold ${c.tagBg} ${c.tagText} px-4 py-2 rounded-full`}>
                        {totalLessons} Lessons
                      </span>
                      <span className={`text-sm font-semibold ${c.tagBg} ${c.tagText} px-4 py-2 rounded-full`}>
                        5 Grades
                      </span>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSubject}
          className="absolute left-0 sm:left-4 2xl:left-8 top-1/2 -translate-y-1/2 size-10 sm:size-12 2xl:size-14 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-white transition-all z-20"
        >
          <ArrowLeft className="size-4 sm:size-5 2xl:size-6 text-gray-600" />
        </button>
        <button
          onClick={nextSubject}
          className="absolute right-0 sm:right-4 2xl:right-8 top-1/2 -translate-y-1/2 size-10 sm:size-12 2xl:size-14 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-white transition-all z-20"
        >
          <ArrowLeft className="size-4 sm:size-5 2xl:size-6 text-gray-600 rotate-180" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-6">
          {uniqueSubjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSubjectIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === activeSubjectIdx ? 'w-8 h-2.5 bg-gray-800' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
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
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">All Lessons</h2>
          <p className="text-sm text-muted-foreground">{allLessons.length} lessons across Grades 1 – 5.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lessons…"
          className="h-9 px-3 w-64 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 px-4 py-2 border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-6">Lesson</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2">Grade</div>
          <div className="col-span-1 text-right">Quiz</div>
        </div>
        <ul className="divide-y divide-border">
          {filtered.map((l) => {
            const isComingSoon = showComingSoon(l.subjectId, l.gradeId);
            return (
              <li key={`${l.gradeId}-${l.subjectId}-${l.id}`}>
                <button
                  onClick={() => {
                    if (isComingSoon) return;
                    if (l.htmlPath) {
                      window.open(l.htmlPath, "_blank");
                    } else {
                      onOpenLesson({ gradeId: l.gradeId, subjectId: l.subjectId, lessonId: l.id });
                    }
                  }}
                  disabled={isComingSoon}
                  className="w-full grid grid-cols-1 sm:grid-cols-12 px-4 py-3 hover:bg-muted/40 transition-colors text-left items-center disabled:opacity-100 disabled:cursor-not-allowed disabled:hover:bg-transparent gap-1 sm:gap-0"
                >
                  <div className="col-span-6 min-w-0">
                    <div className="text-sm font-medium truncate flex items-center gap-2">
                      <FileText className="size-3.5 text-muted-foreground shrink-0" />
                      {l.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate ml-5">{l.summary}</div>
                  </div>
                  <div className="col-span-3 text-sm hidden sm:block">{l.subjectName}</div>
                  <div className="col-span-2 text-sm text-muted-foreground hidden sm:block">{l.gradeLabel}</div>
                  <div className="col-span-1 text-right">
                    {isComingSoon ? (
                      <span className="font-mono-ui text-[10px] text-orange-500 font-semibold">SOON</span>
                    ) : (
                      <span className="font-mono-ui text-[10px] text-muted-foreground">{l.quiz.length}Q</span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">No lessons match "{q}".</li>
          )}
        </ul>
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

  const uniqueSubjects = allSubjects
    .filter((s) => allowedSubjectIds.includes(s.id))
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const subjectIconMap: Record<string, string> = {
    science: "/images/scicon.png",
    hindi: "/images/hicon.png",
    social: "/images/sicon.png",
    english: "/images/englishicon1.png",
  };

  const totalLessons = grades.reduce((acc, g) => acc + g.subjects.reduce((a, s) => a + s.lessons.length, 0), 0);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartData, setChartData] = useState(
    grades.map((g) => ({
      name: `Grade ${g.level}`,
      subjects: 0,
      lessons: 0,
      targetSubjects: g.subjects.length,
      targetLessons: g.subjects.reduce((acc, s) => acc + s.lessons.length, 0),
    }))
  );

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !chartVisible) {
          setChartVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [chartVisible]);

  useEffect(() => {
    if (!chartVisible) return;
    const duration = 1000;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setChartData((prev) =>
        prev.map((d) => ({
          ...d,
          subjects: Math.round(d.targetSubjects * eased),
          lessons: Math.round(d.targetLessons * eased),
        }))
      );

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [chartVisible]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        <div className="relative bg-gradient-to-br from-[#FDF6EC] via-[#FEF3E2] to-[#FDE8D0] p-10 overflow-hidden transform-gpu" style={{ transformStyle: "preserve-3d" }}>
          {/* 3D floating orbs */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotateZ: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [6, -6, 6], rotateZ: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-10 w-56 h-56 bg-orange-200/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-10 left-1/2 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl"
          />

          <div className="relative flex items-center gap-10" style={{ transform: "translateZ(20px)" }}>
            <div className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl 2xl:text-4xl font-semibold text-[#2D2D2D] tracking-tight leading-tight"
              >
                Welcome back, Admin!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-[#6B6B6B] mt-3 text-lg 2xl:text-xl"
              >
                Manage curriculum, subjects and lessons for Grades 1 to 5.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-4 mt-6 flex-nowrap"
              >
                <button
                  onClick={() => onNavigate?.("subjects")}
                  className="bg-indigo-600 text-white px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Start Learning <BookOpen className="size-4" />
                </button>
                <button
                  onClick={() => onNavigate?.("grades")}
                  className="bg-white/80 backdrop-blur border border-gray-200 text-gray-600 px-7 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <GraduationCap className="size-4" /> View Grades
                </button>
              </motion.div>
            </div>

            {/* 3D Floating subject cards */}
            <div className="hidden md:flex items-end gap-3 shrink-0" style={{ perspective: "800px" }}>
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: 20 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, rotateY: -5, scale: 1.05 }}
                className="w-28 h-36 bg-gradient-to-b from-[#86EFAC] to-[#4ADE80] rounded-2xl overflow-hidden flex items-end justify-center shadow-xl shadow-green-500/20"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(-5deg) rotateX(2deg)" }}
              >
                <img src="/images/scicon.png" alt="Science" className="w-20 h-20 object-contain mb-2 drop-shadow-lg" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateY: 20 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, rotateY: -5, scale: 1.05 }}
                className="w-32 h-44 bg-gradient-to-b from-[#FDE047] to-[#EAB308] rounded-2xl overflow-hidden flex items-end justify-center shadow-xl shadow-yellow-500/20 -mt-4"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(0deg) rotateX(3deg)" }}
              >
                <img src="/images/hicon.png" alt="Hindi" className="w-24 h-24 object-contain mb-2 drop-shadow-lg" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: -20 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, rotateY: 5, scale: 1.05 }}
                className="w-28 h-36 bg-gradient-to-b from-[#FB923C] to-[#F97316] rounded-2xl overflow-hidden flex items-end justify-center shadow-xl shadow-orange-500/20"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(5deg) rotateX(2deg)" }}
              >
                <img src="/images/englishicon1.png" alt="English" className="w-20 h-20 object-contain mb-2 drop-shadow-lg" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: "1000px" }}>
        {[
          { label: "Grades", value: 5, icon: GraduationCap, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "Subjects", value: totalSubjects, icon: BookOpen, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
          { label: "Lessons", value: totalLessons, icon: FileText, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/20" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 ${s.shadow} transition-all duration-300`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`size-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon className="size-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Jump to Subjects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-gray-800">Quick Access</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">Navigate to subject content</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Science", icon: "/images/scicon.png", border: "border-green-300" },
            { name: "English", icon: "/images/englishicon1.png", border: "border-rose-300" },
            { name: "Hindi", icon: "/images/hicon.png", border: "border-orange-300" },
            { name: "Social Studies", icon: "/images/sicon.png", border: "border-blue-300" },
          ].map((s) => (
            <button
              key={s.name}
              onClick={() => onOpenSubject?.(s.name.toLowerCase().replace(" ", ""))}
              className={`bg-white border-2 ${s.border} rounded-xl p-5 text-left hover:shadow-md transition-all duration-200 group`}
            >
              <div className="size-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                <img src={s.icon} alt={s.name} className="size-9 object-contain" />
              </div>
              <div className="text-sm font-semibold text-gray-800">{s.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">View lessons</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Content distribution across grades</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-500">Subjects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-indigo-400" />
                <span className="text-gray-500">Lessons</span>
              </div>
            </div>
          </div>
          <div className="h-64" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                />
                <Bar dataKey="subjects" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} label={{ position: 'top', fontSize: 10, fill: '#3B82F6', fontWeight: 600 }} />
                <Bar dataKey="lessons" fill="#818CF8" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} label={{ position: 'top', fontSize: 10, fill: '#818CF8', fontWeight: 600 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Grade Overview */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-[#2D2D2D]">Grade Overview</h2>
        </div>
        <p className="text-sm text-[#6B6B6B] mb-5">Quick overview of all grades</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {grades.map((g, i) => {
            const colors = [
              { bg: "bg-[#FEF3C7]", border: "border-amber-200", iconBg: "bg-[#F97316]", text: "text-[#2D2D2D]" },
              { bg: "bg-[#ECFCCB]", border: "border-green-200", iconBg: "bg-[#16A34A]", text: "text-[#2D2D2D]" },
              { bg: "bg-[#DBEAFE]", border: "border-blue-200", iconBg: "bg-[#2563EB]", text: "text-[#2D2D2D]" },
              { bg: "bg-[#FEE2E2]", border: "border-red-200", iconBg: "bg-[#DC2626]", text: "text-[#2D2D2D]" },
              { bg: "bg-[#F3E8FF]", border: "border-purple-200", iconBg: "bg-[#9333EA]", text: "text-[#2D2D2D]" },
            ];
            const c = colors[i] || colors[0];
            return (
              <motion.button
                key={g.id}
                onClick={() => onNavigate?.("grades", { gradeId: g.id })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${c.bg} border ${c.border} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`size-14 ${c.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <GraduationCap className="size-7 text-white" />
                </div>
                <div className="text-lg font-bold text-[#2D2D2D]">Grade {g.level}</div>
                <div className="text-sm text-[#6B6B6B] mt-1">{g.subjects.length} Subjects</div>
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>
  );
}
