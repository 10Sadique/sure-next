# Contributing to Sure Next 🤝

Thank you for your interest in contributing to **Sure Next**! We welcome contributions from developers of all experience levels to help build the best modern, open-source personal finance and wealth management platform.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Tech Stack Overview](#tech-stack-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Development Guidelines](#development-guidelines)
  - [UI Components & Headless Primitives](#ui-components--headless-primitives)
  - [Icons](#icons)
  - [Forms & Inputs](#forms--inputs)
  - [Server Actions & Database](#server-actions--database)
  - [SSR & Hydration Safety](#ssr--hydration-safety)
- [Git & Commit Workflow](#git--commit-workflow)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [License](#license)

---

## 📜 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors, regardless of experience level, gender, sexual orientation, disability, personal appearance, race, nationality, or religion. Please be respectful and constructive in all discussions, issues, and pull requests.

---

## 🛠️ Tech Stack Overview

- **Framework:** [Next.js](https://nextjs.org) 16 (App Router with `src/` directory, Turbopack)
- **UI Components:** [shadcn](https://ui.shadcn.com) powered by **Base UI** (`@base-ui/react`) & Tailwind CSS v4
- **Icon Library:** [Hugeicons](https://hugeicons.com) (`@hugeicons/core-free-icons` and `@hugeicons/react`)
- **Authentication:** [Better-Auth](https://better-auth.com)
- **Database & ORM:** PostgreSQL running locally with Docker Compose, managed via [Prisma](https://prisma.io) 7
- **Charts & Data Visualization:** [Recharts](https://recharts.org)

---

## 🏁 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org) >= 20.x
- [npm](https://www.npmjs.com) >= 10.x
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (to run PostgreSQL locally)
- [Git](https://git-scm.com)

### Local Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/sure-next.git
   cd sure-next
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   The default values in `.env.example` are pre-configured to work out-of-the-box with the local Docker PostgreSQL instance.

4. **Start PostgreSQL Container:**
   ```bash
   docker compose up -d
   ```

5. **Sync Database Schema:**
   ```bash
   npx prisma db push
   ```

6. **Seed Realistic Sample Data (Optional):**
   ```bash
   npx prisma db seed
   ```
   *Demo credentials:* `user@example.com` / `Password1!`

7. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Development Guidelines

### UI Components & Headless Primitives
- We use **Base UI** (`@base-ui/react`) as our headless foundation rather than Radix UI.
- Reusable UI elements live in [`src/components/ui/`](src/components/ui/).
- Follow existing patterns in `src/components/ui/` when adding or modifying components.

### Icons
- **Hugeicons** is the designated icon library for this project (`@hugeicons/core-free-icons`).
- Always use the unified icon wrapper component:
  ```tsx
  import { BankIcon } from "@hugeicons/core-free-icons"
  import { Icon } from "@/components/ui/icon"

  <Icon icon={BankIcon} size={16} className="text-primary" />
  ```
- Do not import icons from `lucide-react`.

### Forms & Inputs
- Always use the design system's form controls:
  - `<Input />` from `@/components/ui/input`
  - `<Select />` from `@/components/ui/select`
  - `<DatePicker />` from `@/components/ui/date-picker`
- Avoid raw/native `<select>` tags or native `<input type="date">`.

### Server Actions & Database
- Data mutations are handled via Next.js Server Actions in [`src/actions/index.ts`](src/actions/index.ts).
- Revalidate paths after mutations (`revalidatePath("/", "layout")`).
- Keep Prisma queries in [`src/lib/data.ts`](src/lib/data.ts) for clean separation of concerns.

### SSR & Hydration Safety
- Never use locale-dependent `toLocaleString()` directly during initial SSR rendering, as differences between server and client environments cause React hydration mismatches. Use deterministic number formatting or client-side mounted state.
- Keep HTML nesting valid (e.g. only `<li>` elements inside `<ol>` / `<ul>`).

---

## 🔀 Git & Commit Workflow

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. Follow [Conventional Commits](https://www.conventionalcommits.org):
   - `feat:` New features or capabilities
   - `fix:` Bug fixes
   - `refactor:` Code restructuring without changing functionality
   - `docs:` Documentation improvements
   - `chore:` Dependency updates or tooling changes

---

## 🚀 Submitting a Pull Request

Before submitting your pull request, please verify that your changes pass all local checks:

```bash
# 1. Typecheck
npx tsc --noEmit

# 2. Production build check
npm run build
```

When creating your PR:
1. Provide a clear title and description explaining **what** changed and **why**.
2. Reference any related issues (e.g., `Fixes #12`).
3. Include screenshots or screen recordings for UI changes.

---

## 📄 License

By contributing to Sure Next, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
