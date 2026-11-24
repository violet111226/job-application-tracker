# ApplyTrack

ApplyTrack is a responsive job application tracker built with Next.js 16 App Router, React, TypeScript, Tailwind CSS, and Lucide icons.

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the dashboard.

## Dashboard features

- Track application statuses, companies, and follow-up reminders.
- Add and remove applications; search by company or role, filter by status, and sort by application date.
- Switch between dashboard, applications, companies, follow-ups, and settings views.
- Choose light or dark mode and use the responsive mobile navigation.
- Application records and the theme preference are stored in the current browser using local storage.

The initial dashboard uses clearly labeled sample records. This frontend does not connect to a backend or Supabase; browser data is local to the current device.

## Checks

```bash
npm run lint
npm run build
```
