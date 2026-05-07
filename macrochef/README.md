# MacroChef

MacroChef is a responsive web MVP for calorie tracking, macro goals, recipe sharing, and social accountability. Users can register, verify email, log foods, track daily macros, post recipes, like/save/comment, add friends, and manage privacy-aware profiles.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- SMTP email verification
- bcrypt password hashing
- JWT sessions in secure HTTP-only cookies
- Zod validation
- Vercel-compatible hosting setup

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/macrochef?schema=macrochef_api"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/macrochef?schema=macrochef_api"
DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5432/macrochef?schema=macrochef_api"
JWT_SECRET="replace_with_a_very_long_random_secret_at_least_32_chars"
JWT_EXPIRES_IN="7d"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
SMTP_FROM="MacroChef <noreply@example.com>"
SMTP_SKIP_SEND="true"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

For a separate Postgres schema, add `?schema=macrochef_api` to `DATABASE_URL`.

For Neon or the Vercel Marketplace Neon integration, use the pooled connection string for `DATABASE_URL` and the direct/unpooled connection string for `DIRECT_URL` or `DATABASE_URL_UNPOOLED`.

## Install Dependencies

```bash
npm install
```

## Set Up Postgres

Use a local Postgres database or a hosted provider. The easiest Vercel path is the Neon Postgres integration from the Vercel Marketplace.

Local example:

```bash
createdb macrochef
```

Then set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/macrochef?schema=macrochef_api"
```

GitHub is not a database host. Store the code in GitHub, but use hosted Postgres for app data.

## Set Up Postgres on Vercel

Vercel Postgres is now handled through Marketplace Postgres integrations. Use Neon unless you already prefer another provider.

Dashboard flow:

1. Push this repo to GitHub.
2. Import the project into Vercel.
3. In the Vercel project dashboard, go to **Storage** or **Marketplace**.
4. Add **Neon**.
5. Choose **Create New Neon Account** if you want billing and setup handled through Vercel.
6. Connect it to the MacroChef project.
7. Wait a minute or two for provisioning.
8. Check **Settings → Environment Variables** and confirm Vercel added database variables.

Expected variables include:

```bash
DATABASE_URL
DATABASE_URL_UNPOOLED
POSTGRES_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_HOST
```

MacroChef reads `DATABASE_URL` at runtime. Prisma migrations use `DIRECT_URL`, `DATABASE_URL_UNPOOLED`, or `POSTGRES_URL_NON_POOLING`, in that order.

Local sync after linking the Vercel project:

```bash
npx vercel link
npx vercel env pull .env.local
npm run prisma:migrate
npm run prisma:generate
```

Production migration command:

```bash
npx prisma migrate deploy
```

## Set Up Neon

1. Create or log in to a Neon account.
2. Create a new project, choose a region close to your users, and keep the default Postgres database unless you want a custom name.
3. In the Neon project dashboard, click **Connect** and copy both connection strings:
   - Pooled connection for `DATABASE_URL`; the hostname includes `-pooler`.
   - Direct connection for `DIRECT_URL`; use this for Prisma migrations.
4. Add `?schema=macrochef_api` to each URL if Neon did not include it already and you want MacroChef isolated in that schema.
5. Put both values in `.env.local`.
6. Run:

```bash
npm run prisma:migrate
npm run prisma:generate
```

Example shape:

```bash
DATABASE_URL="postgresql://user:password@ep-name-pooler.region.aws.neon.tech/dbname?sslmode=require&schema=macrochef_api"
DIRECT_URL="postgresql://user:password@ep-name.region.aws.neon.tech/dbname?sslmode=require&schema=macrochef_api"
```

## Prisma

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

If `SMTP_SKIP_SEND=true`, verification codes are printed in the dev server logs instead of being emailed.

## Seed/Test Data

No seed script is included yet. The fastest path is:

1. Register a user.
2. Read the verification code from the dev server logs when `SMTP_SKIP_SEND=true`.
3. Verify email and create food logs, recipes, and friend requests through the UI.

## Deploy to Vercel

1. Create a hosted Postgres database.
2. Add all environment variables in Vercel Project Settings.
3. Set `NEXT_PUBLIC_APP_URL` to the production URL.
4. Set `SMTP_SKIP_SEND=false` and configure real SMTP credentials.
5. Deploy from GitHub or run `vercel`.
6. Run Prisma migrations against the production database before opening the app to users.

## Package Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Known Limitations

- Password reset is intentionally a coming-soon stub.
- There is no seed script yet.
- Recipe images use user-provided URLs.
- Feed pagination is MVP-level and filters before slicing a bounded result set.
- Email deliverability depends on the SMTP provider and domain configuration.
