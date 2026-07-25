import { useMemo, useState } from "react";
import { ChevronRight, ArrowLeft, BookOpen, GraduationCap, FileText, CheckCircle2, XCircle, Play } from "lucide-react";
import { grades, allSubjects, allLessons, type Lesson, type Subject, type Grade } from "@/lib/curriculum";

type Nav = {
  gradeId?: string;
  subjectId?: string;
  lessonId?: string;
  mode?: "read" | "quiz";
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

function LessonReader({ lesson, onStartQuiz, onBack }: { lesson: Lesson; onStartQuiz: () => void; onBack: () => void }) {
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
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {lesson.quiz.length} question quiz • Test your understanding
          </div>
          <button
            onClick={onStartQuiz}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Play className="size-3.5" /> Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function Quiz({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => lesson.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => answers.reduce((acc, a, i) => acc + (a === lesson.quiz[i].answer ? 1 : 0), 0),
    [answers, lesson.quiz],
  );

  const done = answers.every((a) => a !== null);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono-ui">Quiz</div>
          <h2 className="text-lg font-semibold tracking-tight mt-0.5">{lesson.title}</h2>
        </div>
        <button
          onClick={onExit}
          className="h-8 px-3 rounded-md border border-border text-xs hover:bg-muted inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="size-3.5" /> Exit
        </button>
      </div>

      {submitted ? (
        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono-ui">Score</div>
              <div className="text-2xl font-semibold">
                {score} <span className="text-muted-foreground text-base">/ {lesson.quiz.length}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {score === lesson.quiz.length ? "Excellent! 🎉" : score >= lesson.quiz.length / 2 ? "Good try!" : "Keep practicing!"}
            </div>
          </div>
          <div className="space-y-3">
            {lesson.quiz.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{q.q}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Correct answer: <span className="text-foreground">{q.options[q.answer]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAnswers(lesson.quiz.map(() => null));
                setSubmitted(false);
              }}
              className="h-9 px-4 rounded-md border border-border text-sm hover:bg-muted"
            >
              Retake
            </button>
            <button
              onClick={onExit}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Finish
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-5">
          {lesson.quiz.map((q, i) => (
            <div key={i} className="space-y-2">
              <div className="text-sm font-medium">
                <span className="text-muted-foreground font-mono-ui text-xs mr-2">Q{i + 1}</span>
                {q.q}
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[i] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        const next = [...answers];
                        next[i] = oi;
                        setAnswers(next);
                      }}
                      className={`h-10 px-3 rounded-md border text-sm text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="font-mono-ui text-[10px] text-muted-foreground mr-2">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {answers.filter((a) => a !== null).length} of {lesson.quiz.length} answered
            </div>
            <button
              disabled={!done}
              onClick={() => setSubmitted(true)}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
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
        {subject.icon}
      </div>
      <div className="mt-3 text-sm font-semibold">{subject.name}</div>
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
      <div className="mt-3 text-base font-semibold">{grade.label}</div>
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

export function GradesView() {
  const [nav, setNav] = useState<Nav>({});

  const grade = grades.find((g) => g.id === nav.gradeId);
  const subject = grade?.subjects.find((s) => s.id === nav.subjectId);
  const lesson = subject?.lessons.find((l) => l.id === nav.lessonId);

  if (lesson && nav.mode === "quiz") {
    return (
      <div className="space-y-4">
        <Crumbs
          items={[
            { label: "Grades", onClick: () => setNav({}) },
            { label: grade!.label, onClick: () => setNav({ gradeId: grade!.id }) },
            { label: subject!.name, onClick: () => setNav({ gradeId: grade!.id, subjectId: subject!.id }) },
            { label: lesson.title, onClick: () => setNav({ gradeId: grade!.id, subjectId: subject!.id, lessonId: lesson.id, mode: "read" }) },
            { label: "Quiz" },
          ]}
        />
        <Quiz lesson={lesson} onExit={() => setNav({ gradeId: grade!.id, subjectId: subject!.id, lessonId: lesson.id, mode: "read" })} />
      </div>
    );
  }

  if (lesson) {
    return (
      <div className="space-y-4">
        <Crumbs
          items={[
            { label: "Grades", onClick: () => setNav({}) },
            { label: grade!.label, onClick: () => setNav({ gradeId: grade!.id }) },
            { label: subject!.name, onClick: () => setNav({ gradeId: grade!.id, subjectId: subject!.id }) },
            { label: lesson.title },
          ]}
        />
        <LessonReader
          lesson={lesson}
          onStartQuiz={() => setNav({ ...nav, mode: "quiz" })}
          onBack={() => setNav({ gradeId: grade!.id, subjectId: subject!.id })}
        />
      </div>
    );
  }

  if (subject) {
    return (
      <div className="space-y-4">
        <Crumbs
          items={[
            { label: "Grades", onClick: () => setNav({}) },
            { label: grade!.label, onClick: () => setNav({ gradeId: grade!.id }) },
            { label: subject.name },
          ]}
        />
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center justify-center size-12 rounded-lg ${subject.color} text-2xl`}>
            {subject.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{subject.name}</h2>
            <p className="text-sm text-muted-foreground">{grade!.label} · {subject.lessons.length} lessons</p>
          </div>
        </div>
        <LessonList
          lessons={subject.lessons}
          onOpen={(l) => setNav({ gradeId: grade!.id, subjectId: subject.id, lessonId: l.id, mode: "read" })}
        />
      </div>
    );
  }

  if (grade) {
    return (
      <div className="space-y-4">
        <Crumbs items={[{ label: "Grades", onClick: () => setNav({}) }, { label: grade.label }]} />
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{grade.label} · Subjects</h2>
          <p className="text-sm text-muted-foreground">Pick a subject to see its lessons.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grade.subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} onOpen={() => setNav({ gradeId: grade.id, subjectId: s.id })} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Grades 1 – 5</h2>
        <p className="text-sm text-muted-foreground">Select a grade to explore its subjects and lessons.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {grades.map((g) => (
          <GradeCard key={g.id} grade={g} onOpen={() => setNav({ gradeId: g.id })} />
        ))}
      </div>
    </div>
  );
}

function LessonList({ lessons, onOpen }: { lessons: Lesson[]; onOpen: (l: Lesson) => void }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <ul className="divide-y divide-border">
        {lessons.map((l, i) => (
          <li key={l.id}>
            <button
              onClick={() => onOpen(l)}
              className="w-full px-4 py-3 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="font-mono-ui text-xs text-muted-foreground w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.title}</div>
                <div className="text-xs text-muted-foreground truncate">{l.summary}</div>
              </div>
              <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                {l.quiz.length} Q
              </span>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SubjectsView({ onOpenLesson }: { onOpenLesson: (path: { gradeId: string; subjectId: string; lessonId: string }) => void }) {
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const filtered = gradeFilter === "all" ? allSubjects : allSubjects.filter((s) => s.gradeId === gradeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Subjects</h2>
          <p className="text-sm text-muted-foreground">All subjects across Grades 1 – 5.</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
          <button
            onClick={() => setGradeFilter("all")}
            className={`px-3 h-7 rounded text-xs font-medium ${
              gradeFilter === "all" ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            All
          </button>
          {grades.map((g) => (
            <button
              key={g.id}
              onClick={() => setGradeFilter(g.id)}
              className={`px-3 h-7 rounded text-xs font-medium ${
                gradeFilter === g.id ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              G{g.level}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((s) => (
          <SubjectCard
            key={`${s.gradeId}-${s.id}`}
            subject={s}
            gradeLabel={s.gradeLabel}
            onOpen={() => {
              const first = s.lessons[0];
              if (first) onOpenLesson({ gradeId: s.gradeId, subjectId: s.id, lessonId: first.id });
            }}
          />
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

export function OverviewView() {
  const totalLessons = allLessons.length;
  const totalSubjects = allSubjects.length;
  const stats = [
    { label: "Grade Levels", value: "5", delta: "1 – 5", tone: "text-emerald-600" },
    { label: "Subjects", value: String(totalSubjects), delta: "5 per grade", tone: "text-emerald-600" },
    { label: "Lessons", value: String(totalLessons), delta: "with quizzes", tone: "text-emerald-600" },
    { label: "Enrolled Students", value: "1,842", delta: "+56", tone: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bhasyam Assessment CMS · Curriculum for Grades 1 – 5.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className={`font-mono-ui text-[11px] ${s.tone}`}>{s.delta}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="size-4 text-primary" />
            <div className="text-sm font-semibold">Jump into a grade</div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {grades.map((g) => (
              <div key={g.id} className="rounded-md border border-border p-2 text-center">
                <div className="text-lg font-semibold">{g.level}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Grade</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-4 text-primary" />
            <div className="text-sm font-semibold">Popular subjects</div>
          </div>
          <ul className="space-y-2">
            {grades[0].subjects.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-sm">
                <span className={`size-6 rounded ${s.color} inline-flex items-center justify-center text-xs`}>
                  {s.icon}
                </span>
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
