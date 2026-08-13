# Midnight Academy UI

# MIDNIGHT ACADEMY — Product Specification

This document outlines the product specification for Midnight Academy.

---

## PRODUCT SUMMARY

Build a complete, production-quality web application UI called **Midnight Academy**.

Tagline: **"Read. Understand. Explain. Improve."**

Midnight Academy is NOT an English proficiency platform and NOT a traditional interview-answering platform. It is an **AI-powered technical question comprehension and digestibility training platform**.

It helps students improve their ability to correctly understand technical questions — from DSA, Aptitude, DBMS, Operating Systems, Computer Networks, OOP, and Programming — **before** attempting to solve them.

Core loop: a student is shown a question for a limited time. They must understand it. When time runs out, the question disappears. The student explains what they understood, in their own words, with no question visible. AI evaluates their understanding and returns:

1. Understanding score

2. Detailed feedback

3. Actual/correct answer

4. Missed concepts or constraints

5. Areas to improve

It is explicitly **not**: an English learning platform, a generic quiz platform, a coding practice platform, or an interview answer generator.

Prioritize: clarity > decoration · focus > complexity · premium > flashy · information hierarchy > excessive cards.

---

## DESIGN DIRECTION

Modern, premium, intelligent, academic/technical. Professional, futuristic-but-not-sci-fi, calm, focused, minimal.

**Avoid:** generic school/LMS styling, excessive gradients, cartoon illustrations, excessive glassmorphism, excessive neon, overly colorful dashboards, cluttered layouts, generic chatbot look.

**Palette**

- Background: `#070B14` (deep midnight navy)

- Primary surface: `#0D1320`

- Secondary surface: `#111827`

- Border: subtle blue-gray

- Primary accent: electric/icy blue

- Secondary accent: soft violet

- Primary text: white/near-white

- Secondary text: muted blue-gray

- Success: restrained green · Warning: amber · Error: red

- Use accents sparingly

**Typography:** Inter, Geist, or Manrope. Large bold page titles → medium section headings → clear body text → small muted metadata.

**Logo:** minimal abstract "M" combined with a subtle moon/knowledge symbol. No childish graduation-cap icon.

**Cards:** subtle borders, soft elevation, moderate radius, restrained shadows. Not every element should be a card. Generous whitespace, strong hierarchy.

**[NEW] Reusable component:** build the 5-axis comprehension breakdown (Objective Understanding, Constraint Recognition, Input/Output Understanding, Concept Identification, Problem Interpretation) as ONE shared component/pattern, reused identically on the student dashboard, the result screen, and admin analytics — same visual language every time, not three different chart styles.

**Responsive:** desktop is primary; support laptop, tablet, mobile. Desktop dashboards use full width with multi-column layout, not a narrow centered app. Test-taking screens prioritize focus/readability over decoration on every breakpoint — the "hide the question" mechanic must hold up on mobile (no flash of the question on rotate/resize/refresh).

---

## APPLICATION STRUCTURE

### 1. Landing Page

Navbar: logo + "Midnight Academy" (left) · How It Works / Features / About / Login / Get Started (right).

Hero headline: **"Don't Solve Yet. Understand First."**

Sub: "Midnight Academy trains students to accurately understand technical questions before attempting to solve them."

CTAs: "Start Learning" (primary), "See How It Works" (secondary).

Hero visual: an elegant product-style visualization of Question → Think → Explain → AI Evaluation → Improve, with subtle glow/animation — not a generic illustration.

Sections:

- "Why Question Understanding Matters" — students often know the concept but lose marks from misreading requirements, constraints, terminology, input/output expectations, edge conditions.

- "How Midnight Academy Works" — 01 Read, 02 Explain, 03 Evaluate, 04 Improve.

- "Built for Technical Thinking" — DSA, Aptitude, DBMS, OS, Computer Networks, OOP, Programming.

- "Your Thinking. Measured." — sample analytics (the 5-axis metrics).

- Final CTA: "Train Your Understanding."

- Footer: logo, tagline, nav, copyright.

**[NEW]** Add a short FAQ or "Is this cheating-proof?" mini-section addressing academic-integrity concerns, since instructors/admins are a buyer persona too.

### 2. Authentication

Centered panel on dark background. Logo. Heading "Welcome to Midnight Academy," sub "Choose your workspace." Two clear paths: **Student** ("Practice and improve your technical question understanding") and **Admin** ("Create, manage and evaluate technical tests"). Then email/password fields, "Continue" button, forgot password, remember me. Minimal screen.

**[NEW]** Add a first-time-user micro-onboarding step right after signup (3-slide or single-screen explainer): "Here's why the question disappears" — sets expectations before the first test so the mechanic doesn't feel like a bug.

### 3. Student Dashboard

Single scrollable page, clean top navbar (no permanent complex sidebar).

Navbar: logo (left) · Dashboard / Practice / History / Progress (center) · Notifications / avatar / name / profile menu (right).

- Hero: "Good evening, Alex." / "Ready to sharpen the way you understand problems?" / large primary CTA **[ TAKE TEST ]**

- Performance overview: Tests Taken, Average Understanding, Best Score, Current Streak

- "Your Comprehension Profile" — the shared 5-axis component, weak areas subtly highlighted

- "AI Insights" — plain-language strength/weakness observation + one targeted recommendation + "Practice Weak Area" CTA

- "Recent Tests" — clickable rows: Test Name, Category, Questions, Score, Date, Status (cap at ~3-5 with a "View all" link to the full History page)

- "Progress Over Time" — line chart of understanding score across past tests

- "Recommended For You" — 3-4 recommended practice sets based on weak areas

**[NEW] Empty state:** a first-time student with zero tests taken should see an inviting empty dashboard state (no fake zeros), steering straight to "Take Test" or "Browse Practice."

### 4. [NEW] Practice Library / Browse

Because not every entry point should require a test code. A page (from "Practice" nav) to browse open/self-serve practice sets by category (DSA, Aptitude, DBMS, OS, Networks, OOP, Programming), filterable by difficulty. Each item: title, category tag, difficulty, question count, estimated time, "Start" action. This is where "Recommended For You" and weak-area drill-downs actually link to.

### 5. [NEW] Full History Page

Dedicated page behind the "History" nav item: complete, filterable/sortable list of all past attempts (by category, date range, score range). Each row opens the full result screen (Section 9 below) for that attempt.

### 6. [NEW] Full Progress/Analytics Page

Dedicated page behind "Progress" nav: the 5-axis trend broken out over time, per-category performance comparison (e.g., strong in DBMS, weak in OS), and a longer-range version of the line chart. This is where the dashboard's compact chart earns a "real" home.

### 7. [NEW] Student Profile / Settings

Editable profile info, notification preferences, and an accessibility/accommodation setting (e.g., extended reading time) — accessible from the profile menu.

### 8. Test Instructions + Test Code

Header "Midnight Academy." Heading "Enter Your Test." Input **[ ENTER TEST CODE ]**, "Continue" button.

After a valid code, show test info (Name, Category, Question count, Time per question, Difficulty), then "Before You Begin" with the 6 numbered instructions from the original spec, the notice ("This test evaluates how well you understand technical questions, not just whether you can solve them"), and **"START TEST."**

**[NEW] Error/edge states on this screen:**

- Invalid/expired code → clear inline error, no dead end (link back to Practice Library)

- Code for a test already completed by this student → explain and route to that result

- Code for a test not yet active / already closed → explain window/availability

### 9. Test Question Screen

Distraction-free. No dashboard chrome. Only: test progress, timer, question, minimal controls.

Top: "MIDNIGHT ACADEMY" · "Question 03 / 10" · progress bar · prominent timer (e.g. 00:38).

Question card: question text, Category (e.g. "DSA / Arrays"), Difficulty. Never show the answer.

Footer note: "You have limited time to understand this question." Button: **"I UNDERSTAND."**

On timer expiry, auto-transition to the response stage; the question must not remain visible or reappear.

**[NEW]** Disable copy/select on the question text and detect tab-switch/window-blur during this stage (log it quietly for the admin's integrity view — don't shame the student in the UI).

### 10. Student Understanding Response

Dedicated screen. "Question 03 / 10." Heading: **"What did you understand?"** Sub: "Explain the question in your own words. Do not solve it." Large textarea, placeholder "Describe what you think the question is asking...", optional response timer, character count. Buttons: **"SUBMIT UNDERSTANDING"** (primary), "Clear" (secondary). The original question must never be shown on this screen. Smooth transition to the next question after submission.

**[NEW]** Handle a browser refresh or connection drop mid-response gracefully — recover the draft text (local state), never re-reveal the question as a side effect of recovery.

### 11. Final AI Result

Hero: "Test Complete" / "Here's how well you understood the problems." Large score (e.g. 82%) labeled "Technical Comprehension Score," count-up animation.

5-axis breakdown (shared component). "AI Overview" — plain-language summary. "What You Missed" — list of missed concepts/constraints. "AI Feedback" — concise, educational (never judgmental) tone.

"Actual Answers" — per question: student's submitted understanding, score (e.g. 7/10), feedback, and the actual answer, **clearly visually separated** from the evaluation. "Recommended Next Steps." Buttons: **[ PRACTICE WEAK AREAS ]**, **[ BACK TO DASHBOARD ]**.

**[NEW]** Add a subtle "Flag this evaluation" action per question, feeding the admin's review queue (Section 15) — gives students recourse if they think the AI scored them wrong.

### 12. AI Evaluation Loading State

After the final question: "Analyzing your understanding..." with animated stages — Understanding your responses, Checking key concepts, Detecting missed constraints, Comparing interpretations, Preparing your feedback — then "Your results are ready."

### 13. Admin Dashboard

Same design language, single scrollable page. Navbar: "Midnight Academy · Admin" · Dashboard / Tests / Create Test / Students / Analytics (center) · Profile.

Hero: "Admin Dashboard" / "Create meaningful technical comprehension assessments." Primary CTA **[ + CREATE TEST ]**.

Cards: Total Tests, Active Tests, Total Students, Completed Attempts.

"Test Performance" — average comprehension score by test (chart). "Recent Tests" table: Test, Category, Questions, Participants, Average Score, Status (Draft/Active/Completed), Actions. "Recent Activity" feed (new test created, N students completed X, Y published).

### 14. Create Test

Step-based flow.

**Step 1 — Test Details:** Name, Category, Difficulty, Number of Questions, Time per Question.

**Step 2 — Question Source:** "Add Questions" with two large options, **Upload PDF** ("Import questions from a PDF") and **Upload TXT** ("Import questions from a text file"), plus "Create Manually." After upload, show a processing state: "Analyzing your questions..." with stages — Extracting content, Detecting questions, Identifying concepts, Detecting constraints, Preparing reference answers.

### 15. Question Review

AI-generated questions are never auto-published. Heading "Review Questions." Per question: text, Detected Category, Topic, Difficulty, Expected Concepts, Important Constraints, Actual Answer — all editable. Actions: **[ EDIT ]**, **[ APPROVE ]**, **[ DELETE ]**. Top progress indicator: "8 / 10 Questions Approved." Button: **"CONTINUE."**

**[NEW]** Add bulk actions (Approve All, Reject All flagged) for admins reviewing large uploads.

### 16. Publish Test

Summary: Test Name, Questions, Category, Difficulty, Time. Button **"PUBLISH TEST."** Success screen: "Test Published," a generated unique Test Code (e.g. `DSA-X7K29`), a large **"COPY TEST CODE"** button with a copy-confirmation microinteraction, and "Share this code with students to let them join the test."

### 17. [NEW] Test Detail / Management (Admin)

Opened from a row in "Recent Tests." Shows full test metadata, per-question analytics (which question had the lowest average understanding score — this is a key differentiator, surfacing *where* students misread things), participant list with individual scores, and actions: Edit, Duplicate, Pause/Activate, Archive.

### 18. [NEW] Question Bank (Admin)

Reusable, tagged library of approved questions across all tests (searchable by category/topic/difficulty), so admins aren't re-uploading from scratch every time. Reachable from "Tests" or a "Question Bank" nav item.

### 19. [NEW] Student Detail (Admin)

Opened from the "Students" nav / a participant list. One student's full attempt history, comprehension trend, and category-level strengths/weaknesses — the admin-side mirror of the student's own Progress page.

### 20. [NEW] Evaluation Review Queue (Admin)

Where flagged evaluations (from Section 11) land. Shows the question, the student's answer, the AI's score/feedback, and lets the admin confirm or override the score with a note.

---

## GLOBAL UX PRINCIPLES

1. Student test experience must be distraction-free.

2. Never show the original question while the student is explaining their understanding — including after refresh/resize.

3. Clearly, visually distinguish Question / Student Understanding / AI Evaluation / Actual Answer at all times.

4. AI feedback is educational, never judgmental, in tone.

5. Scores are visually understandable (count-ups, clear color coding — success/warning/error used sparingly and consistently).

6. Use progressive disclosure for detail-heavy sections (History, per-question breakdowns).

7. Don't overwhelm the student dashboard — cap "Recent Tests" and link out to the full History page.

8. Admin workflows prioritize clarity and speed (bulk actions, clear status states).

9. Consistent spacing, typography, buttons, cards, and hierarchy throughout.

10. Subtle, tasteful transitions between test stages — never jarring.

11. **[NEW]** Every dead-end (invalid code, closed test, empty history, zero-state dashboard) has a clear next action, never a blank screen.

12. **[NEW]** Anti-integrity basics are present but invisible in normal use: disabled copy/select on the live question, tab-switch/blur detection logged for admins, one attempt per code per student.

## MICROINTERACTIONS

Page transitions, button hover states, timer progression, progress bar animation, score count-up, chart animations, AI evaluation loading sequence, test-completion animation, copy-code confirmation, upload-processing animation. Do not over-animate — restraint is part of the brand.

---

## ARCHITECTURE NOTES

Build this as one cohesive product under a shared design system (color tokens, typography scale, spacing scale, and the shared 5-axis comprehension component) rather than as loosely related screens. Student-facing and admin-facing areas should feel like the same product, not two different apps.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
