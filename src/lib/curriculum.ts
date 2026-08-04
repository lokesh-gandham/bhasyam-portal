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
  htmlPath?: string;
};

export type Subject = {
  id: string;
  name: string;
  description?: string;
  icon: string; // emoji or image path
  iconImage?: string; // optional image path for subject icons
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

const mkLesson = (id: string, title: string, summary: string, points: string[], htmlPath?: string): Lesson => ({
  id,
  title,
  summary,
  content: points,
  quiz: mkQuiz(title),
  htmlPath,
});

const scienceHtmlPath = (grade: number, lesson: number): string => {
  const g = `Grade${grade}`;
  const l = lesson;
  if (grade === 1) return `/subjects/science/${g}/${g}_chapter${l}/${g}_Lesson${l}.html`;
  if (grade === 2) {
    if (l === 1) return `/subjects/science/${g}/grade${g.toLowerCase().replace('grade', '')}_chapter${l}/${g}_lesson${l}.html`;
    if (l === 2) return `/subjects/science/${g}/${g}_chapter${l}/${g}_lesson${l}.html`;
    if (l === 3) return `/subjects/science/${g}/grade${g.toLowerCase().replace('grade', '')}_chapter${l}/${g}_chapter${l}.html`;
    return `/subjects/science/${g}/${g}_chapter${l}/${g}_lesson${l}.html`;
  }
  if (grade === 3) {
    if (l === 3) return `/subjects/science/${g}/${g}_chapter${l}/${g}_lesson${l}.html`;
    return `/subjects/science/${g}/${g}_chapter${l}/${g}_Lesson${l}.html`;
  }
  if (grade === 4) return `/subjects/science/${g}/${g}_lesson${l}/grade${l < 10 ? '4' : '4'}_lesson${l}.html`;
  if (grade === 5) return `/subjects/science/${g}/${g}_chapter${l}/${g}_lesson${l}.html`;
  return `/subjects/science/${g}/${g}_chapter${l}/${g}_Lesson${l}.html`;
};

const hindiHtmlPath = (grade: number, lesson: number): string | undefined => {
  const paths: Record<number, Record<number, string>> = {
    1: {
      1: "/subjects/hindi/Grade1/Grade1_chapter1/Grade1_Chapter1.html",
      2: "/subjects/hindi/Grade1/Grade1_chapter2/Grade1_Chapter2.html",
      3: "/subjects/hindi/Grade1/Grade1_chapter3/Grade1_Chapter3.html",
      4: "/subjects/hindi/Grade1/Grade1_chapter4/Grade1_Chapter4.html",
    },
    2: {
      1: "/subjects/hindi/Grade2/Grade2_chapter1/Grade2_Chapter1.html",
      2: "/subjects/hindi/Grade2/Grade2_chapter2/Grade2_Chapter2.html",
      3: "/subjects/hindi/Grade2/Grade2_chapter3/Grade2_Chapter3.html",
      4: "/subjects/hindi/Grade2/Grade2_chapter4/Grade2_Chapter4.html",
    },
    3: {
      1: "/subjects/hindi/Grade3/Grade3_chapter1/Grade3_Chapter1.html",
      2: "/subjects/hindi/Grade3/Grade3_chapter2/grade3_chapter2.html",
      3: "/subjects/hindi/Grade3/Grade3_chapter3/Grade3_chapter3.html",
      4: "/subjects/hindi/Grade3/Grade3_chapter4/Grade3_Lesson4.html",
    },
    4: {
      1: "/subjects/hindi/Grade4/Grade4_chapter1/Grade4_Lesson1.html",
      3: "/subjects/hindi/Grade4/Grade4_chapter3/Grade4_lesson3.html",
      4: "/subjects/hindi/Grade4/Grade4_chapter4/Grade4_Lesson4.html",
    },
    5: {
      1: "/subjects/hindi/Grade5/Grade5_chapter1/Grade5_lesson1.html",
      2: "/subjects/hindi/Grade5/Grade5_chapter2/Grade5_lesson2.html",
      3: "/subjects/hindi/Grade5/Grade5_chapter3/Grade5_lesson3.html",
      4: "/subjects/hindi/Grade5/Grade5_chapter4/Grade5_Lesson4.html",
    },
  };
  return paths[grade]?.[lesson];
};

const socialHtmlPath = (grade: number, lesson: number): string | undefined => {
  if (grade === 1 || grade === 2) return undefined;
  if (grade === 3) {
    const paths: Record<number, string> = {
      1: "/subjects/social/Grade3/Grade3_Lesson1/grade3_lesson1.html",
      2: "/subjects/social/Grade3/Grade3_Lesson2/grade3_lesson2.html",
      3: "/subjects/social/Grade3/Grade3_Lesson3/grade3_lesson3.html",
      4: "/subjects/social/Grade3/Grade3_Lesson4/grade3_chapter4.html",
    };
    return paths[lesson];
  }
  if (grade === 4) {
    const paths: Record<number, string> = {
      1: "/subjects/social/Grade4/Grade4_chapter1/Grade4_lesson1.html",
      2: "/subjects/social/Grade4/Grade4_chapter2/Grade4_Lesson2.html",
      3: "/subjects/social/Grade4/Grade4_chapter3/Grade4_Lesson3.html",
    };
    return paths[lesson];
  }
  if (grade === 5) {
    const paths: Record<number, string> = {
      1: "/subjects/social/Grade5/Grade5_chapter1/grade5_lesson1.html",
      2: "/subjects/social/Grade5/Grade5_chapter2/grade5_lesson2.html",
      3: "/subjects/social/Grade5/Grade5_chapter3/Grade5_chapter3.html",
      4: "/subjects/social/Grade5/Grade5_chapter4/Grade5_lesson4.html",
    };
    return paths[lesson];
  }
  return undefined;
};

const subjectsFor = (grade: number): Subject[] => [
  {
    id: "science",
    name: "Science",
    description: "Explore & experiment",
    icon: "🔬",
    iconImage: "/images/scicon.png",
    color: "bg-emerald-500/10 text-emerald-700",
    lessons: [
      mkLesson(`g${grade}-sci-1`, "Living & Non-living", "What makes something alive?", [
        "Features of living things",
        "Examples of non-living things",
        "Plants and animals around us",
      ], scienceHtmlPath(grade, 1)),
      mkLesson(`g${grade}-sci-2`, "Our Body", "Parts of the body and their work.", [
        "Sense organs",
        "Healthy habits",
        "Food we eat",
      ], scienceHtmlPath(grade, 2)),
      mkLesson(`g${grade}-sci-3`, "Plants & Animals", "Types of plants and animals around us.", [
        "Parts of a plant",
        "Herbivores and carnivores",
        "Domestic vs wild animals",
      ], scienceHtmlPath(grade, 3)),
      mkLesson(`g${grade}-sci-4`, "Weather & Seasons", "Understanding weather patterns.", [
        "Types of weather",
        "Seasons of the year",
        "How weather affects daily life",
      ], scienceHtmlPath(grade, 4)),
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "अक्षर और कहानियाँ",
    icon: "📝",
    iconImage: "/images/hicon.png",
    color: "bg-orange-500/10 text-orange-700",
    lessons: [
      mkLesson(`g${grade}-hin-1`, "वर्ण और शब्द", "हिंदी वर्णमाला और शब्दों का परिचय।", [
        "स्वर और व्यंजन",
        "शब्दों का निर्माण",
        "वाक्य बनाना",
      ], hindiHtmlPath(grade, 1)),
      mkLesson(`g${grade}-hin-2`, "सरल गद्यांश", "छोटे गद्यांश पढ़कर प्रश्नों के उत्तर देना।", [
        "मुख्य विचार पहचानना",
        "विवरण खोजना",
        "शब्दों के अर्थ समझना",
      ], hindiHtmlPath(grade, 2)),
      mkLesson(`g${grade}-hin-3`, "कहानी पढ़ना", "छोटी कहानियाँ पढ़ना और समझना।", [
        "कहानी के पात्र",
        "घटनाओं का क्रम",
        "कहानी से सीख",
      ], hindiHtmlPath(grade, 3)),
      mkLesson(`g${grade}-hin-4`, "सरल कविता", "सरल कविताएँ पढ़ना और उनका आनंद लेना।", [
        "कविता की लय",
        "शब्दों का चयन",
        "कविता का भाव",
      ], hindiHtmlPath(grade, 4)),
    ],
  },
  ...(grade < 3 ? [{
    id: "social",
    name: "Social Studies" as string,
    description: "People & places" as string,
    icon: "🌏",
    iconImage: "/images/sicon.png",
    color: "bg-indigo-500/10 text-indigo-700",
    lessons: [] as Lesson[],
  }] : []),
  ...(grade >= 3 ? [{
    id: "social",
    name: "Social Studies" as string,
    description: "People & places" as string,
    icon: "🌏",
    iconImage: "/images/sicon.png",
    color: "bg-indigo-500/10 text-indigo-700",
    lessons: [
      mkLesson(`g${grade}-soc-1`, "Our Country India", "States, capitals and symbols.", [
        "National symbols",
        "Major states",
        "Festivals of India",
      ], socialHtmlPath(grade, 1)),
      mkLesson(`g${grade}-soc-2`, "Our Families", "Understanding family and community.", [
        "Types of families",
        "Roles in a family",
        "Community helpers",
      ], socialHtmlPath(grade, 2)),
      mkLesson(`g${grade}-soc-3`, "Maps & Directions", "Basic map reading skills.", [
        "Cardinal directions",
        "Reading simple maps",
        "Landmarks and locations",
      ], socialHtmlPath(grade, 3)),
      mkLesson(`g${grade}-soc-4`, "Our Helpers", "People who help us in the community.", [
        "Doctors and teachers",
        "Police and firefighters",
        "Farmers and shopkeepers",
      ], socialHtmlPath(grade, 4)),
    ],
  }] : []),
  {
    id: "english",
    name: "English",
    description: "Words & stories",
    icon: "📖",
    iconImage: "/images/englishicon1.png",
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
      mkLesson(`g${grade}-eng-3`, "Verbs and Sentences", "Action words and building sentences.", [
        "Action verbs",
        "Simple vs compound sentences",
        "Punctuation basics",
      ]),
      mkLesson(`g${grade}-eng-4`, "Writing Practice", "Basic writing skills and creativity.", [
        "Writing a paragraph",
        "Describing a picture",
        "Letter writing basics",
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
