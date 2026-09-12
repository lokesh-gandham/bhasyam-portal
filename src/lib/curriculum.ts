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
      2: "/subjects/hindi/Grade4/Grade4_chapter2/Grade4_Lesson2.html",
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
  const paths: Record<number, Record<number, string>> = {
    3: {
      1: "/subjects/social/Grade3/Grade3_Lesson1/grade3_lesson1.html",
      2: "/subjects/social/Grade3/Grade3_Lesson2/grade3_lesson2.html",
      3: "/subjects/social/Grade3/Grade3_Lesson3/grade3_lesson3.html",
      4: "/subjects/social/Grade3/Grade3_Lesson4/grade3_chapter4.html",
    },
    4: {
      1: "/subjects/social/Grade4/Grade4_chapter1/Grade4_lesson1.html",
      2: "/subjects/social/Grade4/Grade4_chapter2/Grade4_Lesson2.html",
      3: "/subjects/social/Grade4/Grade4_chapter3/Grade4_Lesson3.html",
      4: "/subjects/social/Grade4/Grade4_chapter4/Grade4_Lesson4.html",
    },
    5: {
      1: "/subjects/social/Grade5/Grade5_chapter1/grade5_lesson1.html",
      2: "/subjects/social/Grade5/Grade5_chapter2/grade5_lesson2.html",
      3: "/subjects/social/Grade5/Grade5_chapter3/Grade5_chapter3.html",
      4: "/subjects/social/Grade5/Grade5_chapter4/Grade5_lesson4.html",
    },
  };
  return paths[grade]?.[lesson];
};

const mathsHtmlPath = (grade: number, lesson: number): string | undefined => {
  const paths: Record<number, Record<number, string>> = {
    1: {
      1: "/subjects/maths/Grade1/Lesson1/newindex.html",
      2: "/subjects/maths/Grade1/Lesson2/newindex.html",
      3: "/subjects/maths/Grade1/Lesson3/newindex.html",
      4: "/subjects/maths/Grade1/Lesson4/newindex.html",
      5: "/subjects/maths/Grade1/Lesson5/newindex.html",
    },
    2: {
      1: "/subjects/maths/Grade2/Grade2_chapter1/maths-fun-kids-menu.html",
      2: "/subjects/maths/Grade2/Grade2_chapter2/maths-adventure-zone.html",
      3: "/subjects/maths/Grade2/Grade2_chapter3/Grade2_chapter3.html",
      4: "/subjects/maths/Grade2/Grade2_chapter4/newindex.html",
      5: "/subjects/maths/Grade2/Grade2_chapter5/multiply-and-conquer.html",
    },
    3: {
      1: "/subjects/maths/Grade3/Grade3_Lesson1/newindex.html",
      2: "/subjects/maths/Grade3/Grade3_Lesson2/Grade3_Lesson2.html",
      3: "/subjects/maths/Grade3/Grade3_Lesson3/Grade3_Lesson3.html",
      4: "/subjects/maths/Grade3/Grade3_Lesson4/newindex.html",
      5: "/subjects/maths/Grade3/Grade3_Lesson5/newindex.html",
    },
    4: {
      1: "/subjects/maths/Grade4/chapter-1/newindex.html",
      2: "/subjects/maths/Grade4/chapter-2/index.html",
      3: "/subjects/maths/Grade4/chapter-3/index.html",
      4: "/subjects/maths/Grade4/chapter-4/newindex.html",
      5: "/subjects/maths/Grade4/chapter-5/newindex.html",
    },
    5: {
      1: "/subjects/maths/Grade5/Lesson1/newindex.html",
      2: "/subjects/maths/Grade5/Lesson2/grade5_lesson2.html",
      3: "/subjects/maths/Grade5/Lesson3/grade5_lesson3.html",
      4: "/subjects/maths/Grade5/lesson4/Grade5_chapter4.html",
      5: "/subjects/maths/Grade5/Lesson5/grade5_lesson5.html",
    },
  };
  return paths[grade]?.[lesson];
};

const mathsLessonsFor = (grade: number): Lesson[] => {
  if (grade === 5) {
    return [
      mkLesson(`g${grade}-mat-1`, "Numbers", "Place value, Roman numerals and rounding off.", [
        "Place and face value",
        "Roman numerals",
        "Rounding off numbers",
      ], mathsHtmlPath(grade, 1)),
      mkLesson(`g${grade}-mat-2`, "Addition", "Solving and finding missing values in addition.", [
        "Addition mission",
        "Find the value",
        "Missing digit arcade",
      ], mathsHtmlPath(grade, 2)),
      mkLesson(`g${grade}-mat-3`, "Multiplication & Division", "Multiplication and division properties.", [
        "Multiplication property quest",
        "Multiply the following",
        "Division truth scanner",
      ], mathsHtmlPath(grade, 3)),
      mkLesson(`g${grade}-mat-4`, "Geometry", "Lines, symmetry and transformations.", [
        "Meet the lines",
        "Symmetry and rotations",
        "Patterns and transformations",
      ], mathsHtmlPath(grade, 4)),
      mkLesson(`g${grade}-mat-5`, "Prime & Composite Numbers", "Identifying prime and composite numbers.", [
        "Prime and composite numbers",
        "Fill in the blanks",
        "Multiple choice quiz",
      ], mathsHtmlPath(grade, 5)),
    ].filter((l) => l.htmlPath);
  }

  if (grade === 4) {
    return [
      mkLesson(`g${grade}-mat-1`, "Numbers", "Place value, Roman numerals and rounding off.", [
        "Six-rod abacus and place value",
        "Roman numerals",
        "Rounding to the nearest 10 and 100",
      ], mathsHtmlPath(grade, 1)),
      mkLesson(`g${grade}-mat-2`, "Addition & Subtraction", "Properties and practice of addition and subtraction.", [
        "Properties of addition",
        "Subtraction practice",
        "Missing digits quiz",
      ], mathsHtmlPath(grade, 2)),
      mkLesson(`g${grade}-mat-3`, "Multiplication & Division", "Multiplying and dividing by tens.", [
        "Multiplication properties",
        "Division properties",
        "Quotient and remainder",
      ], mathsHtmlPath(grade, 3)),
      mkLesson(`g${grade}-mat-4`, "Geometry & Patterns", "Lines, shapes, symmetry and patterns.", [
        "Lines, rays and curves",
        "Angles and solids",
        "Symmetry and patterns",
      ], mathsHtmlPath(grade, 4)),
      mkLesson(`g${grade}-mat-5`, "Factors & Multiples", "Multiples, factors and prime numbers.", [
        "Multiples and factors",
        "Divisibility rules",
        "Prime and composite numbers",
      ], mathsHtmlPath(grade, 5)),
    ].filter((l) => l.htmlPath);
  }

  if (grade === 3) {
    return [
      mkLesson(`g${grade}-mat-1`, "Numbers", "Place value, comparing and Roman numerals.", [
        "Place value and forms",
        "Comparing and ordering numbers",
        "Roman numerals and rounding",
      ], mathsHtmlPath(grade, 1)),
      mkLesson(`g${grade}-mat-2`, "Addition", "Adding numbers and finding sums.", [
        "Finding the following",
        "Fill in the boxes",
        "Addition practice",
      ], mathsHtmlPath(grade, 2)),
      mkLesson(`g${grade}-mat-3`, "Subtraction", "Subtraction concepts through activities.", [
        "Choose an activity",
        "Fill in the boxes",
        "Matching practice",
      ], mathsHtmlPath(grade, 3)),
      mkLesson(`g${grade}-mat-4`, "Multiplication & Patterns", "Multiplication facts and number patterns.", [
        "Addition and fact practice",
        "Patterns and sequences",
        "Multiplication marvels",
      ], mathsHtmlPath(grade, 4)),
      mkLesson(`g${grade}-mat-5`, "Shapes & Symmetry", "Recognising shapes and lines of symmetry.", [
        "Shape recognition",
        "Patterns and visual reasoning",
        "Symmetry",
      ], mathsHtmlPath(grade, 5)),
    ].filter((l) => l.htmlPath);
  }

  if (grade === 2) {
    return [
      mkLesson(`g${grade}-mat-1`, "Numbers", "Forming, ordering and comparing numbers.", [
        "Forming numbers",
        "Ordering and sorting numbers",
        "Number games",
      ], mathsHtmlPath(grade, 1)),
      mkLesson(`g${grade}-mat-2`, "Numbers up to 1000", "Place value and patterns with bigger numbers.", [
        "Counting with the abacus",
        "Joining the dots by number pattern",
        "Matching numbers",
      ], mathsHtmlPath(grade, 2)),
      mkLesson(`g${grade}-mat-3`, "Addition", "Adding numbers with pictures and puzzles.", [
        "Joining the dots",
        "Finding the sum",
        "Fill the boxes",
      ], mathsHtmlPath(grade, 3)),
      mkLesson(`g${grade}-mat-4`, "Subtraction", "Understanding and practising subtraction.", [
        "Understand subtraction",
        "Practice subtraction",
        "Subtraction games",
      ], mathsHtmlPath(grade, 4)),
      mkLesson(`g${grade}-mat-5`, "Multiplication", "Discovering multiplication through play.", [
        "Discover multiplication",
        "Multiplication practice",
        "Multiplication games",
      ], mathsHtmlPath(grade, 5)),
    ].filter((l) => l.htmlPath);
  }

  return [
    mkLesson(`g${grade}-mat-1`, "Shapes & Comparisons", "Comparing sizes, distances and quantities.", [
      "Big and small, far and near",
      "Heavy and light, thick and thin",
      "Many and less, matching shapes",
    ], mathsHtmlPath(grade, 1)),
    mkLesson(`g${grade}-mat-2`, "Numbers 1 to 9", "Counting, ordering and naming numbers.", [
      "Counting with the abacus",
      "Number line and ordinal numbers",
      "Matching numbers to names",
    ], mathsHtmlPath(grade, 2)),
    mkLesson(`g${grade}-mat-3`, "Addition", "Adding numbers using pictures and beads.", [
      "Counting on with the abacus",
      "Addition on the number line",
      "Fun addition games",
    ], mathsHtmlPath(grade, 3)),
    mkLesson(`g${grade}-mat-4`, "Subtraction", "Taking away and finding the difference.", [
      "Subtraction with the abacus",
      "Number line subtraction",
      "Fill in the missing number",
    ], mathsHtmlPath(grade, 4)),
    mkLesson(`g${grade}-mat-5`, "Numbers up to 20", "Place value, face value and comparing numbers.", [
      "Numbers before, after and between",
      "Greater and smaller numbers",
      "Place value and face value",
    ], mathsHtmlPath(grade, 5)),
  ].filter((l) => l.htmlPath);
};

const englishHtmlPath = (grade: number, lesson: number): string | undefined => {
  const paths: Record<number, Record<number, string>> = {
    1: {
      1: "/subjects/english/Grade1/grade1_lesson1/Grade1_Lesson1.html",
      2: "/subjects/english/Grade1/grade1_lesson2/Grade1_Lesson2.html",
      3: "/subjects/english/Grade1/grade1_lesson3/grade1_lesson3.html",
      4: "/subjects/english/Grade1/grade1_lesson4/grade1_lesson4.html",
    },
    // Grade 2 order: Chapter 1 → Poem → Chapter 2 → Chapter 3 → Chapter 4
    2: {
      1: "/subjects/english/Grade2/Grade2_chapter1/Grade2_chapter1.html",
      2: "/subjects/english/Grade2/Grade2_Poem/grade2_lesson22.html",
      3: "/subjects/english/Grade2/Grade2_chapter2/grade2_lesson2.html",
      4: "/subjects/english/Grade2/Grade2_chapter3/Grade2_chapter3.html",
      5: "/subjects/english/Grade2/Grade2_chapter4/Grade2_Lesson4.html",
    },
    3: {
      1: "/subjects/english/Grade3/Grade3_chapter1/Grade3_Lesson1.html",
      2: "/subjects/english/Grade3/Grade3_chapter2/Grade3_lesson2.html",
      3: "/subjects/english/Grade3/Grade3_chapter3/Grade3_lesson3.html",
      4: "/subjects/english/Grade3/Grade3_chapter4/Grade3_Lesson4.html",
    },
    4: {
      1: "/subjects/english/Bhashyam_English_Grade4/grade4_lesson1/grade4_lesson1.html",
      2: "/subjects/english/Bhashyam_English_Grade4/grade4_lesson2/grade4_lesson2.html",
      3: "/subjects/english/Bhashyam_English_Grade4/grade4_lesson3/grade4_lesson3.html",
      4: "/subjects/english/Bhashyam_English_Grade4/grade4_lesson4/grade4_lesson4.html",
    },
    5: {
      1: "/subjects/english/Grade5/Grade5_Lesson1/Grade5_chapter1.html",
      2: "/subjects/english/Grade5/Grade5_Lesson2/Grade5_chapter2.html",
      3: "/subjects/english/Grade5/Grade5_Lesson3/Grade5_chapter3.html",
      4: "/subjects/english/Grade5/Grade5_Lesson4/Grade5_chapter4.html",
    },
  };
  return paths[grade]?.[lesson];
};

const englishLessonsFor = (grade: number): Lesson[] => {
  if (grade === 2) {
    return [
      mkLesson(`g${grade}-eng-1`, "Chapter 1", "Interactive English assessments for Chapter 1.", [
        "Reading and vocabulary",
        "Grammar practice",
        "Word skills",
      ], englishHtmlPath(grade, 1)),
      mkLesson(`g${grade}-eng-poem`, "Poem", "Interactive English assessments for the poem.", [
        "Choose the correct options",
        "Word meanings",
        "Rhyming words",
      ], englishHtmlPath(grade, 2)),
      mkLesson(`g${grade}-eng-2`, "Chapter 2", "Interactive English assessments for Chapter 2.", [
        "Reading and vocabulary",
        "Grammar practice",
        "Word skills",
      ], englishHtmlPath(grade, 3)),
      mkLesson(`g${grade}-eng-3`, "Chapter 3", "Interactive English assessments for Chapter 3.", [
        "Reading and vocabulary",
        "Grammar practice",
        "Word skills",
      ], englishHtmlPath(grade, 4)),
      mkLesson(`g${grade}-eng-4`, "Chapter 4", "Interactive English assessments for Chapter 4.", [
        "Reading and vocabulary",
        "Grammar practice",
        "Word skills",
      ], englishHtmlPath(grade, 5)),
    ].filter((l) => l.htmlPath);
  }

  return [
    mkLesson(`g${grade}-eng-1`, "Chapter 1", "Interactive English assessments for Chapter 1.", [
      "Reading and vocabulary",
      "Grammar practice",
      "Word skills",
    ], englishHtmlPath(grade, 1)),
    mkLesson(`g${grade}-eng-2`, "Chapter 2", "Interactive English assessments for Chapter 2.", [
      "Reading and vocabulary",
      "Grammar practice",
      "Word skills",
    ], englishHtmlPath(grade, 2)),
    mkLesson(`g${grade}-eng-3`, "Chapter 3", "Interactive English assessments for Chapter 3.", [
      "Reading and vocabulary",
      "Grammar practice",
      "Word skills",
    ], englishHtmlPath(grade, 3)),
    mkLesson(`g${grade}-eng-4`, "Chapter 4", "Interactive English assessments for Chapter 4.", [
      "Reading and vocabulary",
      "Grammar practice",
      "Word skills",
    ], englishHtmlPath(grade, 4)),
  ].filter((l) => l.htmlPath);
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
    ].filter((l) => l.htmlPath),
  },
  {
    id: "social",
    name: "Social Studies",
    description: "People & places",
    icon: "🌏",
    iconImage: "/images/sicon.png",
    color: "bg-indigo-500/10 text-indigo-700",
    lessons: [
      mkLesson(`g${grade}-soc-1`, "Our Community", "People, places and life around us.", [
        "Family and neighbourhood",
        "Helpers in our community",
        "Places we visit",
      ], socialHtmlPath(grade, 1)),
      mkLesson(`g${grade}-soc-2`, "Our Earth", "Land, water and directions.", [
        "Shape of the Earth",
        "Landforms and water bodies",
        "Directions and maps",
      ], socialHtmlPath(grade, 2)),
      mkLesson(`g${grade}-soc-3`, "Our Country", "India — people, culture and regions.", [
        "States and capitals",
        "Festivals and culture",
        "Unity in diversity",
      ], socialHtmlPath(grade, 3)),
      mkLesson(`g${grade}-soc-4`, "Civics & Society", "Rules, rights and responsibilities.", [
        "Good citizens",
        "Local government",
        "Caring for our environment",
      ], socialHtmlPath(grade, 4)),
    ],
  },
  {
    id: "english",
    name: "English",
    description: "Words & stories",
    icon: "📖",
    iconImage: "/images/englishicon1.png",
    color: "bg-rose-500/10 text-rose-700",
    lessons: englishLessonsFor(grade),
  },
  {
    id: "maths",
    name: "Maths",
    description: "Numbers & puzzles",
    icon: "🔢",
    color: "bg-sky-500/10 text-sky-700",
    lessons: mathsLessonsFor(grade),
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
