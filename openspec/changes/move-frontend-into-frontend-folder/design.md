# Design: Repository layout — frontend/ and backend/ at root

## Current layout

- **Root**: Frontend (src/, public/, index.html, package.json, Vite/ESLint/Vitest/Tailwind/TS configs), backend (backend/), openspec (openspec/), README, .gitignore, AGENTS.md.
- **backend/**: api/, bff/, global.json, README.md.

## Target layout

- **Root**: README.md, .gitignore, openspec/, AGENTS.md (optional workspace/agent file).
- **frontend/**: All frontend artifacts — src/, public/, index.html, package.json, lockfiles, vite.config.ts, vitest.config.ts, tailwind.config.ts, postcss.config.js, tsconfig*.json, components.json, eslint.config.js, .env.example.
- **backend/**: Unchanged — api/, bff/, global.json, README.md.

## Rationale

- **Symmetry**: Frontend and backend each have a single top-level directory; root is for project-wide docs and tooling (openspec), not app code.
- **Clarity**: New contributors see immediately that “frontend” and “backend” are separate trees; no mixing of Node and .NET at root.
- **Minimal root**: Reduces root clutter and keeps openspec as the only “meta” folder at root, which aligns with the requirement to keep openspec structure as-is.
- **No behavioral change**: Path alias `@/` still resolves to `src/` relative to the frontend root (i.e. frontend/src/); all configs use relative paths and continue to work once their files live inside frontend/.

## Trade-offs

- **Commands**: Developers must run `cd frontend` before `npm install` or `npm run dev`. This is documented in README and project.md; no root package.json is introduced to avoid maintaining two package.json files.
- **CI / scripts**: Any script that currently runs `npm run build` or `npm test` from the repo root must be updated to run from `frontend/` (or `cd frontend && npm run build`). This is an explicit task in the change.
- **Deploy docs**: Deployment guides that reference paths (e.g. “clone repo”, “npm run build”) must reference `frontend/` for the frontend build; README is the source of truth, and deploy docs can be updated in this change or a follow-up.

## Implementation notes

- Moving files is sufficient; no edits to the contents of vite.config.ts, tsconfig, vitest, or eslint are required, because they use `__dirname` or paths relative to the config file.
- index.html references `/src/main.tsx`; Vite serves from the directory that contains vite.config.ts, so with index.html and src/ both under frontend/, the same path continues to work.
- .gitignore patterns such as `node_modules` and `dist` are root-relative; they will still match `frontend/node_modules` and `frontend/dist`. No change to .gitignore is strictly required; optionally we can add a short comment that frontend dependencies and build output live under frontend/.
