# GitHub + Vercel Deployment

## Repository

Recommended repository:

- `AngadMandal/labmedix`

## Vercel

1. Push this project to the GitHub repository.
2. In Vercel, choose `Add New Project`.
3. Import `AngadMandal/labmedix`.
4. Framework preset: `Next.js`.
5. Add a free Postgres database from the Vercel Marketplace.
6. Deploy.

## Important runtime note

The current app uses a local SQLite file for persistence in local development. That is fine on your computer, but Vercel production requires an external persistent database for a true live multi-user system.

Recommended free production database options:

- `Neon Postgres`
- `Supabase Postgres`
- `Turso`

Recommended choice for this project:

- `Neon` through the `Vercel Marketplace`

Official references:

- Vercel Marketplace storage integrations: [Vercel Docs](https://vercel.com/docs/marketplace-storage)
- Neon on Vercel Marketplace: [Vercel Neon Integration](https://vercel.com/marketplace/neon/)
- Import GitHub repository into Vercel: [Vercel Import Docs](https://vercel.com/docs/getting-started-with-vercel/import)
- GitHub deployment integration details: [Vercel for GitHub](https://vercel.com/docs/concepts/git/vercel-for-github)

## What is already ready

- GitHub-ready source structure
- Next.js app for Vercel
- Role-based dashboards
- Server-side permission checks for admin/staff actions
- Website editor and staff-permission UI
- Role resolution by staff email for demo login

## What still needs to be connected for full production persistence on Vercel

- Replace local SQLite storage with a hosted database connection
- Add production login/password storage
- Add production file storage for report PDFs if needed

## Minimal go-live checklist

1. Create or connect `AngadMandal/labmedix` on GitHub.
2. Import it into Vercel.
3. Add `Neon` from the Vercel Marketplace.
4. Copy the database connection string into Vercel environment variables.
5. Update the app runtime from local SQLite to the hosted Postgres connection.
6. Redeploy.
