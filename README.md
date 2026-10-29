# Portfolio Site

[![CI](https://github.com/samad-a/portfolio-site/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/samad-a/portfolio-site/actions/workflows/ci.yml)

My personal portfolio: a retro pixel-art site where the sky turns from day to
night as you scroll. It brings together my experience, projects, case studies
and a blog, and doubles as a showcase of how I build and ship a production web
app: typed content, automated tests, CI and preview deploys for every change.

The site is being built in public, one phase at a time. Each phase lands on its
own branch and merges into `main` by pull request.

## Stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js (App Router) + React                      |
| Language     | TypeScript (strict mode)                          |
| Styling      | Tailwind CSS                                      |
| Code quality | ESLint, Prettier, Husky + lint-staged, commitlint |
| Hosting      | Vercel                                            |

Coming in later phases: MDX and Zod for content, Vitest, React Testing Library
and Playwright for tests, and GitHub Actions for CI.

## Local setup

You need Node.js 20.9 or later.

```bash
git clone git@github.com:samad-a/portfolio-site.git
cd portfolio-site
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

`npm install` also sets up the Git hooks. Before each commit they lint, format
and type-check the staged files, and commit messages must follow
[Conventional Commits](https://www.conventionalcommits.org/), for example
`feat(nav): add mobile menu`.

### Environment variables

The contact form sends email with [Resend](https://resend.com). To try it
locally, copy `.env.example` to `.env.local` and add a Resend API key. On
Vercel, set the same variables under Settings > Environment Variables. Without
a key, the form shows a friendly error and the rest of the site works.

## Scripts

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server                    |
| `npm run build`        | Build for production                    |
| `npm run start`        | Serve the production build              |
| `npm run lint`         | Lint with ESLint                        |
| `npm run typecheck`    | Type-check with TypeScript              |
| `npm run format`       | Format all files with Prettier          |
| `npm run format:check` | Check formatting without changing files |
