# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Production build (Next.js standalone output)
npm run lint             # ESLint via Next.js
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run DB migrations in dev
npm run prisma:studio    # Open Prisma Studio GUI
npm run seed             # Seed database with initial data
```

No test suite is configured.

## Architecture

**Stack:** Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL + TailwindCSS + next-intl

### Routing

All public pages live under `src/app/[locale]/` with locales `en | th | ru | zh` (always-prefixed, default: `en`). The admin panel is at `src/app/admin/` — protected by middleware JWT check (NextAuth, credentials-based, JWT strategy, 24h TTL). Unauthenticated `/admin/*` requests redirect to `/admin/login`.

`src/middleware.ts` handles both i18n routing and admin auth guard. API routes and admin routes bypass locale middleware.

### Content Entities & Localization

Each main content type (Post, Event, Sermon, Page) has a companion `*Translation` model in Prisma for per-locale text fields. Content lifecycle uses `ContentStatus` enum: `DRAFT | PUBLISHED | SCHEDULED | ARCHIVED`.

Database models: Post, Event, EventRsvp, Sermon, Page, StaffMember, PrayerRequest, NewsletterSubscriber, AdminUser, Donation, ContactSubmission, SiteSetting.

### Key Directories

- `src/app/api/` — REST API routes (CRUD for all entities; admin-only routes check session role)
- `src/components/admin/` — TipTap-based CRUD editors for posts/events/sermons/pages
- `src/components/ui/` — Primitive UI components
- `src/lib/` — Singletons and utilities: `prisma.ts` (Prisma client), `auth.ts` (NextAuth config), `stripe.ts`, `nodemailer.ts`, `translate.ts` (Google Cloud Translate), `rate-limit.ts`
- `src/i18n/routing.ts` — Locale list and routing config
- `messages/{locale}.json` — UI string translations (separate from DB content translations)
- `prisma/schema.prisma` — Full DB schema
- `prisma/seed.ts` — Database seeder

### Payments

Stripe (card) and PromptPay QR (Thai) are both supported. Stripe webhook handler is at `src/app/api/donate/webhook/`.

### Deployment

Docker multi-stage build → standalone Next.js output. `docker-compose.yml` runs: PostgreSQL 16, Next.js app, Nginx reverse proxy, Certbot (SSL), Umami analytics. Prisma migrations run automatically on container start (`prisma migrate deploy`).

### Environment Variables

See `.env.example` for the full list. Key vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_TRANSLATE_API_KEY`, `SMTP_*`, `NEXT_PUBLIC_APP_URL`.
