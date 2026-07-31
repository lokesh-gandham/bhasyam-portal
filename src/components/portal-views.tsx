import { useEffect, useState } from "react";
import { ChevronRight, ArrowLeft, GraduationCap, BookOpen, FileText } from "lucide-react";
import { grades, allSubjects, allLessons, type Lesson, type Subject, type Grade } from "@/lib/curriculum";

type Nav = {
  gradeId?: string;
  subjectId?: string;
  lessonId?: string;
  mode?: "read";
};

function Crumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3" />}
          {it.onClick ? (
            <button onClick={it.onClick} className="hover:text-foreground hover:underline">
              {it.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{it.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function LessonReader({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
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
      <div className="mt-3 text-sm">{subject.name}</div>
      {gradeLabel && (
        <div className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
          {gradeLabel}
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">{subject.lessons.length} lessons</div>
      <div className="mt-3 text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Open <ChevronRight className="size-3" />
      </div>
    </button>
  );
}

function GradeCard({ grade, onOpen }: { grade: Grade; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-card border border-border rounded-lg p-5 hover:shadow-sm hover:border-primary/40 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
          <GraduationCap className="size-6" />
        </div>
        <span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
          Level 0{grade.level}
        </span>
      </div>
      <div className="mt-3 text-base">{grade.label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{grade.subjects.length} subjects available</div>
      <div className="mt-3 flex -space-x-1">
        {grade.subjects.slice(0, 5).map((s) => (
          <span
            key={s.id}
            className={`size-6 rounded-full border-2 border-card ${s.color} text-[11px] flex items-center justify-center`}
            title={s.name}
          >
            {s.icon}
          </span>
        ))}
      </div>
    </button>
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
      <div key={`subject-${subject.id}`} className="space-y-6 pt-8 animate-view-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-20 mb-4">
            {subject.iconImage ? (
              <img src={subject.iconImage} alt={subject.name} className="size-20 object-contain" />
            ) : (
              <span className="text-6xl">{subject.icon}</span>
            )}
          </div>
          <h2 className="text-3xl tracking-tight">{grade!.label} - {subject.name}</h2>
          <p className="text-sm text-muted-foreground mt-2">Complete all lessons to master this subject</p>
          <p className="text-sm text-muted-foreground mt-1">{subject.lessons.length} Total Lessons</p>
        </div>
        <div>
          <button
            onClick={() => setNavTracked({ gradeId: grade!.id })}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        </div>
        <div className="space-y-4">
          {subject.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setNavTracked({ gradeId: grade!.id, subjectId: subject.id, lessonId: l.id })}
              className="w-full bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-5 hover:shadow-sm hover:border-primary/40 transition-all group"
            >
              <span className="size-12 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium flex-1 text-left">Lesson {i + 1}</span>
              <span className="text-sm text-white font-medium inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
                Open <ChevronRight className="size-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (grade) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 mb-3 bg-primary/10 rounded-full">
            <GraduationCap className="size-8 text-primary" />
          </div>
          <h2 className="text-2xl tracking-tight">{grade.label} - Subjects</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose a subject to explore lessons</p>
        </div>
        <div>
          <button
            onClick={() => setNavTracked({})}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {grade.subjects.filter((s) => allowedSubjectIds.includes(s.id)).map((s) => (
            <button
              key={s.id}
              onClick={() => setNavTracked({ gradeId: grade.id, subjectId: s.id })}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-sm hover:border-primary/40 transition-all group"
            >
              <div className="size-16 flex items-center justify-center mb-4">
                {s.iconImage ? (
                  <img src={s.iconImage} alt={s.name} className="size-16 object-contain" />
                ) : (
                  <span className="text-4xl">{s.icon}</span>
                )}
              </div>
              <div className="text-lg">{s.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
              <div className="text-xs text-primary font-medium inline-flex items-center gap-1 mt-4 group-hover:gap-2 transition-all">
                Explore <ChevronRight className="size-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-20 mb-4">
          <GraduationCap className="size-12 text-primary" />
        </div>
        <h2 className="text-3xl tracking-tight">Grades</h2>
        <p className="text-sm text-muted-foreground mt-2">Select a grade to explore its subjects and lessons</p>
        <p className="text-sm text-muted-foreground mt-1">{grades.length} Total Grades</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {grades.map((g) => (
          <button
            key={g.id}
            onClick={() => setNavTracked({ gradeId: g.id })}
            className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-sm hover:border-primary/40 transition-all group"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Grade</div>
            <div className="text-3xl tracking-tight mt-2">{g.level}</div>
            <div className="text-xs text-primary font-medium inline-flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
              Open <ChevronRight className="size-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LessonList({ lessons, onOpen }: { lessons: Lesson[]; onOpen: (l: Lesson) => void }) {
  return (
    <div className="space-y-4">
      {lessons.map((l, i) => (
        <button
          key={l.id}
          onClick={() => onOpen(l)}
          className="w-full bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-5 hover:shadow-sm hover:border-primary/40 transition-all group"
        >
          <span className="size-12 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-medium flex-1 text-left">Lesson {i + 1}</span>
          <span className="text-sm text-white font-medium inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
            Open <ChevronRight className="size-4" />
          </span>
        </button>
      ))}
    </div>
  );
}

const allowedSubjectIds = ["english", "hindi", "science", "social"];

export function SubjectsView({ onOpenLesson }: { onOpenLesson: (path: { gradeId: string; subjectId: string; lessonId: string }) => void }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const subject = allSubjects.find((s) => s.id === selectedSubject && s.gradeId === selectedGrade);

  // Step 3: Show lessons
  if (subject) {
    const gradeLabel = grades.find((g) => g.id === selectedGrade)?.label;
    return (
    <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-20 mb-4">
            {subject.iconImage ? (
              <img src={subject.iconImage} alt={subject.name} className="size-20 object-contain" />
            ) : (
              <span className="text-6xl">{subject.icon}</span>
            )}
          </div>
          <h2 className="text-3xl tracking-tight">{gradeLabel} - {subject.name}</h2>
          <p className="text-sm text-muted-foreground mt-2">Complete all lessons to master this subject</p>
          <p className="text-sm text-muted-foreground mt-1">{subject.lessons.length} Total Lessons</p>
        </div>
        <div>
          <button
            onClick={() => setSelectedGrade(null)}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        </div>
        <div className="space-y-4">
          {subject.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => onOpenLesson({ gradeId: subject.gradeId, subjectId: subject.id, lessonId: l.id })}
              className="w-full bg-card border border-border rounded-2xl px-6 py-5 flex items-center gap-5 hover:shadow-sm hover:border-primary/40 transition-all group"
            >
              <span className="size-12 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium flex-1 text-left">Lesson {i + 1}</span>
              <span className="text-sm text-white font-medium inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors">
                Open <ChevronRight className="size-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Show grades for selected subject
  if (selectedSubject) {
    const subjectData = allSubjects.find((s) => s.id === selectedSubject);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 mb-3">
            {subjectData?.iconImage ? (
              <img src={subjectData.iconImage} alt={subjectData.name} className="size-16 object-contain" />
            ) : (
              <span className="text-5xl">{subjectData?.icon}</span>
            )}
          </div>
          <h2 className="text-2xl tracking-tight">{subjectData?.name} - Grades</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose a grade to explore subjects and lessons</p>
          <p className="text-sm text-muted-foreground mt-1">5 Total Grades</p>
        </div>
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {grades.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-sm hover:border-primary/40 transition-all group"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Grade</div>
            <div className="text-3xl tracking-tight mt-2">{g.level}</div>
              <div className="text-xs text-primary font-medium inline-flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                Open <ChevronRight className="size-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 1: Show subject cards
  const uniqueSubjects = allSubjects
    .filter((s) => allowedSubjectIds.includes(s.id))
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  return (
    <div className="space-y-4">
      <div className="text-center">
          <h2 className="text-xl tracking-tight">Subjects</h2>
        <p className="text-sm text-muted-foreground">Select a subject to explore its grades and lessons.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueSubjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className="text-left bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/40 transition-all group"
          >
            <div className="size-16 flex items-center justify-center mb-4">
              {s.iconImage ? (
                <img src={s.iconImage} alt={s.name} className="size-16 object-contain" />
              ) : (
                <span className="text-5xl">{s.icon}</span>
              )}
            </div>
            <div className="text-lg">{s.name}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
            <div className="text-xs text-primary font-medium inline-flex items-center gap-1 mt-4 group-hover:gap-2 transition-all">
              Explore <ChevronRight className="size-3" />
            </div>
          </button>
        ))}
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
        <div className="grid grid-cols-12 px-4 py-2 border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-6">Lesson</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2">Grade</div>
          <div className="col-span-1 text-right">Quiz</div>
        </div>
        <ul className="divide-y divide-border">
          {filtered.map((l) => (
            <li key={`${l.gradeId}-${l.subjectId}-${l.id}`}>
              <button
                onClick={() => onOpenLesson({ gradeId: l.gradeId, subjectId: l.subjectId, lessonId: l.id })}
                className="w-full grid grid-cols-12 px-4 py-3 hover:bg-muted/40 transition-colors text-left items-center"
              >
                <div className="col-span-6 min-w-0">
                  <div className="text-sm font-medium truncate flex items-center gap-2">
                    <FileText className="size-3.5 text-muted-foreground shrink-0" />
                    {l.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate ml-5">{l.summary}</div>
                </div>
                <div className="col-span-3 text-sm">{l.subjectName}</div>
                <div className="col-span-2 text-sm text-muted-foreground">{l.gradeLabel}</div>
                <div className="col-span-1 text-right font-mono-ui text-[10px] text-muted-foreground">
                  {l.quiz.length}Q
                </div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">No lessons match "{q}".</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function OverviewView({ onOpenSubject }: { onOpenSubject?: (subjectId: string) => void } = {}) {
  const totalSubjects = allSubjects.filter((s) => allowedSubjectIds.includes(s.id)).length / 5;
  const stats = [
    { label: "Grades", value: "5", delta: "1 – 5", icon: GraduationCap, iconBg: "bg-primary/10 text-primary" },
    { label: "Subjects", value: String(totalSubjects), delta: "per grade", icon: BookOpen, iconBg: "bg-violet-500/10 text-violet-600" },
  ];

  const uniqueSubjects = allSubjects
    .filter((s) => allowedSubjectIds.includes(s.id))
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl tracking-tight">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Bhasyam Assessment CMS — Curriculum for Grades 1 – 5</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-4xl tracking-tight">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.delta}</div>
                </div>
              </div>
              <div className={`size-10 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="size-5" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="size-4" />
          </div>
          <div className="text-base">Jump into a subject</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uniqueSubjects.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpenSubject?.(s.id)}
              className="rounded-xl border border-border p-5 flex flex-col items-center gap-3 hover:shadow-sm hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="size-16 flex items-center justify-center">
                {s.iconImage ? (
                  <img src={s.iconImage} alt={s.name} className="size-16 object-contain" />
                ) : (
                  <span className="text-4xl">{s.icon}</span>
                )}
              </div>
              <div className="text-sm text-center">{s.name}</div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">5 grades</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
