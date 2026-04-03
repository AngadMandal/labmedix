# LabMedix Digital Healthcare System

LabMedix is a professional clinic and diagnostics web platform built as a single role-based application. This repository includes:

- A public-facing website for appointments, lab bookings, services, and report access
- Role-based dashboards for admin, patient, doctor, lab, and booking/reporting teams
- Real SQLite-backed create/update flows for appointments, lab orders, bills, and reports
- A Prisma schema prepared as a future production-model reference

## Stack

- Next.js App Router
- TypeScript
- Built-in Node SQLite runtime for local persistence
- Cookie-based demo authentication

## Getting Started

1. Install Node.js 24+ and npm.
2. From this folder, run `npm install`.
3. Start the dev server with `npm run dev`.
4. Open `http://localhost:3000`.

## Deployment

- GitHub target repo: `AngadMandal/labmedix`
- Vercel target: import the GitHub repo into Vercel
- Deployment guide: see `DEPLOY_GITHUB_VERCEL.md`

## Demo Accounts

- Admin: `admin@labmedix.in`
- Website Editor: `editor@labmedix.in`
- Doctor: `doctor@labmedix.in`
- Lab: `lab@labmedix.in`
- Patient: `patient@labmedix.in`
- Operations: `operations@labmedix.in`

Use any password in the current demo flow. The app assigns the role by the email you choose.

## Included Routes

- `/` public website
- `/about`
- `/doctors`
- `/services`
- `/book-appointment`
- `/book-test`
- `/reports`
- `/contact`
- `/faq`
- `/login`
- `/admin`
- `/patient`
- `/doctor`
- `/lab`
- `/operations`

## Notes

- The running app uses a persistent SQLite database stored in `data/labmedix.db`.
- Public booking forms and dashboard update actions write directly to the database.
- `prisma/schema.prisma` remains in the repo as a future migration reference.
