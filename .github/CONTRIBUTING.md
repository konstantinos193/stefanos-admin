# Contributing to Stefanos Admin

First off — thank you for considering contributing to the admin panel. Whether you are fixing a typo, squashing a bug, or adding yet another tab to the settings page, we appreciate it. Genuinely.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold it. Please report unacceptable behavior to **conduct@smholdings.gr**.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/stefanos-admin.git
   cd stefanos-admin
   ```
3. **Install dependencies**:
   ```bash
   yarn install
   ```
4. **Start the dev server**:
   ```bash
   yarn dev
   ```
5. **Make sure the backend is running** on `http://localhost:3001`. Without it, the admin panel is a beautiful collection of empty tables and loading spinners.

If the dev server starts without errors, congratulations — you are already ahead of most first-time setups.

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes
3. Run the linter and type checker:
   ```bash
   yarn lint
   yarn type-check
   ```
4. Test your changes locally (on desktop **and** mobile — yes, the sidebar collapses and yes, it needs to work)
5. Commit your changes (see [Commit Messages](#commit-messages))
6. Push to your fork and open a Pull Request

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). This is not optional. Your future self will thank you.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. (not CSS — Tailwind handles that) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `ci` | CI/CD configuration changes |

### Examples

```
feat(dashboard): add revenue chart to stats section
fix(auth): resolve token persistence on page refresh
docs(readme): update deployment instructions for Vercel
chore(deps): bump next from 16.1.4 to 16.1.6
refactor(settings): extract webhook form into separate component
feat(sidebar): add cleaning management navigation item (sidebar grows longer)
```

## Pull Requests

### Before Opening a PR

- [ ] Your code builds without errors (`yarn build`)
- [ ] Linting passes (`yarn lint`)
- [ ] Type checking passes (`yarn type-check`)
- [ ] You have tested on both desktop and mobile viewports
- [ ] You have not committed `console.log` statements (we all do it, just clean them up)
- [ ] Your branch is up to date with `main`

### PR Guidelines

- **One PR per feature or fix.** Do not bundle unrelated changes. We are not reviewing a novel.
- **Write a clear description.** Explain *what* changed and *why*. Screenshots are welcome for UI changes — this is an admin panel, visuals matter.
- **Keep PRs small.** Under 400 lines of diff is ideal. Over 1000 and reviewers start skimming. You know they do.
- **Link related issues** using `Closes #123` or `Fixes #456`.
- **Be responsive to feedback.** Reviews are a conversation, not a verdict.

## Code Style

- **TypeScript** — Strict mode. No `any` unless you have a very good reason and a written apology.
- **Tailwind CSS** — Utility classes. No inline styles. No CSS modules unless absolutely necessary. The `globals.css` file is not a dumping ground.
- **Components** — Functional components only. No class components. It is not 2018.
- **Naming** — PascalCase for components, camelCase for functions and variables, SCREAMING_SNAKE_CASE for constants.
- **Imports** — Absolute imports via `@/` alias. Group them: external packages first, then internal modules.
- **Formatting** — Prettier handles it. Do not fight Prettier. You will lose.
- **Icons** — Use Lucide React. If you need an icon that does not exist in Lucide, reconsider your design choices.

### File Organization

```
src/components/feature-name/
  FeatureName.tsx          # Main component
  FeatureNameTable.tsx     # Table component (there is always a table)
  FeatureNameForm.tsx      # Form component (there is always a form)

src/lib/api/
  feature-name.ts          # API client for the feature

src/app/feature-name/
  page.tsx                 # Next.js page
  layout.tsx               # Layout (if needed)
```

### API Layer

All API calls go through `src/lib/api/`. Each module uses the shared `apiRequest` function from `config.ts`. Do not make raw `fetch` calls from components. We have a system. Respect the system.

## Reporting Bugs

Found a bug? In an admin panel with 20 sections and 14 settings tabs, we are not surprised. But we are grateful you are telling us.

### Before Reporting

- Check the [existing issues](../../issues) to avoid duplicates
- Make sure you are on the latest version of `main`
- Verify the backend is running and accessible — half of all "frontend bugs" are the backend being down
- Try reproducing in an incognito window (browser extensions cause more bugs than developers do)

### Bug Report Should Include

1. **Summary** — What happened?
2. **Steps to Reproduce** — How do we make it happen again?
3. **Expected Behavior** — What should have happened?
4. **Actual Behavior** — What actually happened?
5. **Screenshots** — If it is a UI bug, show us. This is an admin panel — we live and die by the UI.
6. **Environment** — Browser, OS, screen size, Node version

## Suggesting Features

Have an idea? We would love to hear it. The sidebar has room for at least three more items before we need to add a second scrollbar.

- Open an issue with a clear title and description
- Describe the problem your feature would solve
- Explain your proposed solution
- Note any alternatives you have considered

We cannot promise we will build everything, but we read everything.

---

## Questions?

If something in this guide is unclear, open an issue or reach out. We do not bite. The linter might, though.

---

Thank you for contributing. Seriously. Open source runs on people like you and mass-produced coffee.
