export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  quiz: QuizQuestion[];
};

export type Subject = {
  id: string;
  name: string;
  icon: string; // emoji
  color: string; // tailwind bg class
  lessons: Lesson[];
};

export type Grade = {
  id: string;
  label: string;
  level: number;
  subjects: Subject[];
};

const mkQuiz = (topic: string): QuizQuestion[] => [
  {
    q: `Which of the following best describes ${topic}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 1,
  },
  {
    q: `Pick the correct example related to ${topic}.`,
    options: ["Example 1", "Example 2", "Example 3", "Example 4"],
    answer: 2,
  },
  {
    q: `${topic} is most useful for…`,
    options: ["Cooking", "Learning", "Sleeping", "Running"],
    answer: 1,
  },
];

const mkLesson = (id: string, title: string, summary: string, points: string[]): Lesson => ({
  id,
  title,
  summary,
  content: points,
  quiz: mkQuiz(title),
});

const subjectsFor = (grade: number): Subject[] => [
  {
    id: "math",
    name: "Mathematics",
    icon: "➗",
    color: "bg-blue-500/10 text-blue-700",
    lessons: [
      mkLesson(`g${grade}-math-1`, `Numbers up to ${grade * 100}`, "Reading, writing and comparing numbers.", [
        "Place value of digits",
        "Comparing two numbers",
        "Ascending and descending order",
      ]),
      mkLesson(`g${grade}-math-2`, "Addition & Subtraction", "Everyday word problems and mental math.", [
        "Regrouping while adding",
        "Borrowing while subtracting",
        "Story sums",
      ]),
      mkLesson(`g${grade}-math-3`, "Shapes & Patterns", "Recognise 2D and 3D shapes around us.", [
        "Circles, squares, triangles",
        "Cubes, spheres, cones",
        "Repeating patterns",
      ]),
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    color: "bg-rose-500/10 text-rose-700",
    lessons: [
      mkLesson(`g${grade}-eng-1`, "Nouns and Pronouns", "Naming people, places and things.", [
        "Common vs proper nouns",
        "He, she, it, they",
        "Using pronouns in sentences",
      ]),
      mkLesson(`g${grade}-eng-2`, "Reading Comprehension", "Read a short story and answer questions.", [
        "Skim for the main idea",
        "Find details in the passage",
        "Guess word meanings",
      ]),
    ],
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    color: "bg-emerald-500/10 text-emerald-700",
    lessons: [
      mkLesson(`g${grade}-sci-1`, "Living & Non-living", "What makes something alive?", [
        "Features of living things",
        "Examples of non-living things",
        "Plants and animals around us",
      ]),
      mkLesson(`g${grade}-sci-2`, "Our Body", "Parts of the body and their work.", [
        "Sense organs",
        "Healthy habits",
        "Food we eat",
      ]),
    ],
  },
  {
    id: "evs",
    name: "EVS",
    icon: "🌱",
    color: "bg-amber-500/10 text-amber-700",
    lessons: [
      mkLesson(`g${grade}-evs-1`, "My Family & Neighbourhood", "People and places around us.", [
        "Family members",
        "Helpers in our locality",
        "Being a good neighbour",
      ]),
    ],
  },
  {
    id: "social",
    name: "Social Studies",
    icon: "🌏",
    color: "bg-indigo-500/10 text-indigo-700",
    lessons: [
      mkLesson(`g${grade}-soc-1`, "Our Country India", "States, capitals and symbols.", [
        "National symbols",
        "Major states",
        "Festivals of India",
      ]),
    ],
  },
];

export const grades: Grade[] = [1, 2, 3, 4, 5].map((n) => ({
  id: `grade-${n}`,
  label: `Grade ${n}`,
  level: n,
  subjects: subjectsFor(n),
}));

export const allSubjects = grades.flatMap((g) =>
  g.subjects.map((s) => ({ ...s, gradeId: g.id, gradeLabel: g.label })),
);

export const allLessons = grades.flatMap((g) =>
  g.subjects.flatMap((s) =>
    s.lessons.map((l) => ({
      ...l,
      subjectId: s.id,
      subjectName: s.name,
      gradeId: g.id,
      gradeLabel: g.label,
    })),
  ),
);
