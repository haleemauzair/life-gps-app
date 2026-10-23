import { LifeGPSRoute } from '../types/route';

export const SAMPLE_JOURNEY_ROUTE: LifeGPSRoute = {
  id: 'sample-journey-ai-internship',
  createdAt: '2026-10-23T07:00:00.000Z',
  updatedAt: '2026-10-23T07:00:00.000Z',
  modelUsed: 'Sample Preview (Click "Find My Route" or "Recalculate" for live Gemma 4 generation)',
  isSample: true,
  recalculationCount: 0,
  input: {
    goal: 'Get my first internship in applied AI or machine learning by next semester.',
    currentSituation:
      'Second-year computer science student. Comfortable with Python basics and introductory data structures, but no portfolio projects or prior internship experience.',
    biggestObstacle:
      'Overwhelmed by how many frameworks and math papers exist—not sure what small project would actually matter to an internship reviewer, and I only have 5 hours a week outside classes.',
    timeAvailable: '5 hours per week',
    additionalContext: 'Cannot afford paid bootcamps or cloud GPU credits; need to use free tools and my laptop.',
  },
  destination: {
    statedGoal: 'Get my first internship in applied AI or machine learning by next semester.',
    concreteDestination:
      'Build one well-documented, end-to-end applied AI project using free tiers, pair it with a focused 1-page technical resume, and submit 15 targeted internship applications.',
    clarityNote:
      'Landing an early-stage AI internship rarely requires inventing a new model from scratch. Reviewers look for evidence that you can take a real dataset or API, solve a specific problem cleanly in Python, evaluate where it fails, and explain your trade-offs.',
    estimatedHorizon: '8–10 weeks at 5 hours per week',
  },
  currentLocation: {
    summary:
      'You are a second-year CS student with working Python fundamentals and data structures knowledge, operating on a strict 5-hour weekly budget and zero budget for paid courses or compute.',
    strengths: [
      'Existing foundation in Python and introductory data structures',
      'Realistic awareness of your 5-hour weekly schedule outside university coursework',
      'Clear target timeline aiming for the upcoming semester hiring window',
    ],
    uncertainties: [
      'Which specific applied AI role type (ML engineering vs. data science vs. AI application engineering) best fits local or remote openings',
      'No public GitHub repository or deployed demo showing applied problem-solving yet',
      'Application deadlines and eligibility rules vary by region and company size',
    ],
  },
  nextTurn: {
    id: 'sample-next-turn',
    headline: 'Audit 3 real entry-level AI internship listings for shared skills',
    action:
      'Open an internship board you actually have access to, find 3 entry-level AI, data science, or ML software engineering internship postings, and write down the exact tools and responsibilities that appear in at least two of them.',
    timeNeeded: '30 minutes',
    whyFirst:
      'Instead of guessing what to learn from twenty open tabs, looking at three real listings anchors your project choice in what employers in your target market actually ask for.',
    definitionOfDone:
      'A short note containing links to 3 real internship postings and a bulleted list of 4–5 recurring technical skills.',
  },
  milestones: [
    {
      id: 'sample-ms-1',
      stepNumber: 1,
      title: 'Map target role requirements and pick one narrow problem',
      description:
        'Review 3–5 real internship descriptions to separate "nice-to-have research buzzwords" from core engineering requirements (Python, API integration, data cleaning, evaluation). Select one small problem you can solve in two weeks.',
      whyItMatters:
        'Prevents tutorial purgatory and ensures your limited 5 hours per week go toward skills that show up on screening rubrics.',
      connectionToNext:
        'Gives you a concrete project specification so you can start coding immediately in Milestone 2.',
      estimatedTime: 'Week 1 (5 hours total)',
      deliverable: '1-paragraph project scope + list of 3 target internship listings.',
    },
    {
      id: 'sample-ms-2',
      stepNumber: 2,
      title: 'Build a working baseline pipeline using free tools',
      description:
        'Using Python, Google Colab free tier, or open-source local libraries (scikit-learn / Hugging Face / Gemini free API tier), build the simplest working version of your project that processes real input and produces measurable output.',
      whyItMatters:
        'A small finished pipeline beats an ambitious unfinished framework every time.',
      connectionToNext:
        'Once the baseline runs end-to-end, you can evaluate errors and package it for human reviewers in Milestone 3.',
      estimatedTime: 'Weeks 2–4 (15 hours total)',
      deliverable: 'Working Python script or notebook pushed to a public GitHub repository.',
    },
    {
      id: 'sample-ms-3',
      stepNumber: 3,
      title: 'Add error analysis and a clear 2-minute README',
      description:
        'Test your project on 20 edge-case inputs, document where it succeeds and where it fails, and write a clean README with architecture diagram, setup steps, and sample output screenshots.',
      whyItMatters:
        'Recruiters and engineers rarely clone repositories to run them; they read your README and look for thoughtful evaluation of failure cases.',
      connectionToNext:
        'Provides the exact metrics and technical talking points needed for your resume bullets in Milestone 4.',
      estimatedTime: 'Weeks 5–6 (10 hours total)',
      deliverable: 'Polished GitHub README with evaluation metrics table and screenshots.',
    },
    {
      id: 'sample-ms-4',
      stepNumber: 4,
      title: 'Translate project into resume bullets and run weekly application batches',
      description:
        'Format a 1-page technical resume highlighting your CS coursework and your documented AI project. Apply to 3–5 verified roles per week and track responses in a simple spreadsheet.',
      whyItMatters:
        'Consistent, targeted applications give your work a real chance to be seen without burning out your coursework schedule.',
      connectionToNext:
        'Positions you for technical screening interviews with a project you know inside and out.',
      estimatedTime: 'Weeks 7–9 (15 hours total)',
      deliverable: '1-page PDF resume + application tracker with 15 submitted applications.',
    },
  ],
  sevenDayPlan: [
    {
      id: 'sample-day-1',
      dayNumber: 1,
      dayLabel: 'Day 1',
      title: 'Audit 3 real internship descriptions',
      action:
        'Complete your Next Turn: find 3 real internship postings and list the 4–5 skills that appear most often.',
      timeEstimate: '35 mins',
      definitionOfDone: 'Saved text file with 3 job links and 5 common technical skills.',
      isRestOrLightDay: false,
    },
    {
      id: 'sample-day-2',
      dayNumber: 2,
      dayLabel: 'Day 2',
      title: 'Choose one concrete dataset or problem',
      action:
        'Pick one small, specific problem (e.g., classifying campus course feedback or summarizing syllabus PDFs with evaluation metrics) that uses at least two skills from your Day 1 list.',
      timeEstimate: '45 mins',
      definitionOfDone: 'Written 4-sentence problem statement: input, method, evaluation metric, and output.',
      isRestOrLightDay: false,
    },
    {
      id: 'sample-day-3',
      dayNumber: 3,
      dayLabel: 'Day 3',
      title: 'Coursework focus & rest day',
      action:
        'Step away from internship prep today to stay on top of your university assignments.',
      timeEstimate: '0 mins (Rest day)',
      definitionOfDone: 'No Life GPS tasks required today.',
      isRestOrLightDay: true,
    },
    {
      id: 'sample-day-4',
      dayNumber: 4,
      dayLabel: 'Day 4',
      title: 'Initialize clean GitHub repository & environment',
      action:
        'Create a new GitHub repo, set up a free Google Colab notebook or local virtual environment, and commit an initial README stating your project goal.',
      timeEstimate: '45 mins',
      definitionOfDone: 'Public GitHub repo link with initial commit and `requirements.txt`.',
      isRestOrLightDay: false,
    },
    {
      id: 'sample-day-5',
      dayNumber: 5,
      dayLabel: 'Day 5',
      title: 'Load and inspect 10 sample inputs',
      action:
        'Write a short Python script to load 10 real examples of your input data and print summary statistics or edge cases.',
      timeEstimate: '60 mins',
      definitionOfDone: 'Script runs cleanly and prints 10 sample records without errors.',
      isRestOrLightDay: false,
    },
    {
      id: 'sample-day-6',
      dayNumber: 6,
      dayLabel: 'Day 6',
      title: 'Build the simplest baseline function',
      action:
        'Write a baseline function (even a simple rule-based, TF-IDF, or single-prompt script) that produces predictions on your 10 sample inputs and saves the output to a CSV.',
      timeEstimate: '90 mins',
      definitionOfDone: 'Output CSV file committed to your repository with baseline results.',
      isRestOrLightDay: false,
    },
    {
      id: 'sample-day-7',
      dayNumber: 7,
      dayLabel: 'Day 7',
      title: 'Light review & week 2 checkpoint',
      action:
        'Spend 15 minutes reviewing what worked this week and noting the single bottleneck to fix next week, then rest.',
      timeEstimate: '15 mins',
      definitionOfDone: '3 bullet points added to README under "Next Steps".',
      isRestOrLightDay: true,
    },
  ],
  roadblocks: [
    {
      id: 'sample-rb-1',
      obstacle: 'Getting stuck in math or framework rabbit holes before writing any code',
      whyItHappens:
        'AI advice online often mixes PhD-level research papers with undergraduate software engineering roles, making beginners feel they must read 50 papers before building anything.',
      alternateRoute:
        'Time-box reading to 20 minutes per session. Start by using an existing pre-trained model or standard library (`scikit-learn` or a free API tier) and focus your engineering effort on data quality, testing, and clear evaluation.',
      verificationNote:
        'Check specific internship listings to verify whether they require custom model training or applied Python/API engineering.',
    },
    {
      id: 'sample-rb-2',
      obstacle: 'Zero budget for paid courses, certifications, or cloud GPUs',
      whyItHappens:
        'Many commercial platforms market expensive certificates or GPU-heavy projects as mandatory.',
      alternateRoute:
        'Use university coursework, official library documentation, Kaggle/Colab free tiers, or lightweight CPU-friendly datasets. Hiring managers evaluate working GitHub code far more than paid certificate badges.',
      verificationNote:
        'Verify current free-tier usage limits on Google Colab, Kaggle, or any API before designing a large dataset run.',
    },
    {
      id: 'sample-rb-3',
      obstacle: 'Midterm exams cut your available time from 5 hours to 1 hour in a given week',
      whyItHappens:
        'Academic semesters have uneven workloads, and rigid plans collapse during exam weeks.',
      alternateRoute:
        'Switch to a "maintenance week": pause new feature coding and spend 45 minutes documenting what you already built or submitting 2 applications. Use the "Recalculate my route" button whenever your weekly hours drop.',
      verificationNote:
        'Always verify application closing dates directly on company career pages so you prioritize time-sensitive listings first.',
    },
  ],
  progressIndicators: [
    {
      id: 'sample-pi-1',
      metric: 'Verified commits & evaluation artifacts',
      tangibleOutput:
        '1 public repository containing runnable Python code, a sample output CSV, and a README documenting both accuracy and failure cases.',
      cadence: 'Check at the end of Week 4 and Week 6',
    },
    {
      id: 'sample-pi-2',
      metric: 'Targeted applications submitted',
      tangibleOutput:
        '3 to 5 tailored internship applications submitted per week once your baseline project is live on GitHub.',
      cadence: 'Weekly starting in Week 7',
    },
  ],
  navigatorNote:
    'Having five hours a week and a zero-dollar budget is a real constraint, not a personal shortcoming. You do not need to learn every AI framework at once—one focused, honest project that runs cleanly and explains its trade-offs will move you much further than twenty open tabs.',
};
