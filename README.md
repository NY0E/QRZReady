# QRZReady

Free, memorization-focused study tool for the FCC Amateur Radio license exams: Technician, General, and Extra.

**Live:** [qrzready.com](https://qrzready.com)

## Why it exists

Most ham exam prep throws all four answer choices at you from the first question. That works for people who already know some electronics; it buries everyone else. QRZReady starts you with one answer and adds wrong answers only as you prove you know the right one, so you build recall before you're asked to discriminate.

## How it works

**Learn mode** sorts every question into four stages based on your track record:

| Stage | Choices shown |
|---|---|
| First time | 1 (the correct answer) |
| Basic practice | 2 |
| Intermediate practice | 3 |
| Mastery | 4, like the real exam |

A question counts as mastered after 4 correct answers in a row; it then leaves your study set and a new one takes its place. Each study set mixes new, needs-practice, and needs-review questions, plus a few mastered ones for retention.

**Practice mode** (full-length practice exams) is planned and not built yet.

Other features:
- Current question pools pulled from [ham_radio_question_pool](https://github.com/NY0E/ham_radio_question_pool), my machine-readable copy of the official NCVEC pools. The Technician pool is the 2026-2030 cycle (409 questions, including the February 2026 errata and the new diagram questions).
- Accounts with saved progress, plus account data controls
- Installable as an app, and works offline
- Milestone celebrations and a 25-minute study-break reminder

## Measuring whether it works

The app logs study sessions, each answer attempt (including which wrong answers were shown), and self-reported exam passes. The goal is to test whether the graduated-choices method actually beats standard four-choice drilling, instead of assuming it does.

## Stack

Next.js 15, React, TypeScript, Tailwind CSS, Firebase (authentication and progress), Supabase (study analytics), and Serwist (offline support).

## How it was built

I'm not a software engineer. I built QRZReady by directing AI, in three phases:

- **June 2025:** I described what I wanted to Claude in chat, then pasted the code it wrote into GitHub one file at a time.
- **March 2026:** With AI help, I added the milestone system, the study-break timer, and the resources page.
- **August 2026:** I moved to Claude Code to update for the 2026-2030 question pool, render exam diagrams, make the app work offline, add privacy controls, and build the study logging that tests whether the method works.

AI writes code fast, but it doesn't check whether the code serves the point of the app. Two things I caught:

- **A bug that broke the core method.** Two of the four learning stages were quietly showing all four answers instead of the limited set, so the app wasn't testing the idea it was built on. Nothing crashed, so nothing flagged it; I noticed because I knew what the screen should look like.
- **A missing piece nobody asked for.** We'd built account signup without any privacy policy or terms anywhere on the site. I flagged it, and we added a privacy policy, terms of service, a 13+ age confirmation at signup, and self-service data export and deletion. The same pass removed an unused server route that was a security exposure.

## Running locally

```bash
npm install
npm run dev
```

Firebase and Supabase settings are read from environment variables in `.env.local`, which is not committed.
