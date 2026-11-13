# Skynet

Build and deploy a website just by describing it — no coding required.

Skynet is a professional website builder for non-technical users. You log in,
describe what kind of site you want in plain language (for example, "a bakery
website with online ordering"), and a team of AI agents researches, plans,
designs, builds, tests, secures, and deploys it for you. No coding, no design
tools, and no server setup are ever needed.

## What Skynet does for you

- **Log in** — create an account and manage all your websites in one place
- **Describe in plain words** — tell Skynet what kind of site you want
- **Watch agents build it** — specialist agents handle layout, design, code,
  content, testing, security, and SEO
- **Get a live website** — your site is online with a real web address
- **No technical skills needed** — no coding, no design tools, no server setup

## Try it in 30 seconds

```bash
# 1. Install dependencies
npm run install:all

# 2. Start the engine (backend orchestration service)
npm run dev:engine   # http://localhost:3001

# 3. Start the web UI (what non-coders use)
npm run dev:web      # http://localhost:3000
```

Then open `http://localhost:3000`, log in, and describe the website you have
in mind. Skynet's agents will take it from there.

## What's inside

```
Skynet/
├─ README.md        # this file
├─ skynet.json      # project configuration
├─ engine/          # the orchestration service (Express + TypeScript)
├─ web/             # the screen non-technical users use (Next.js + Tailwind)
└─ templates/       # ready-made website designs to start from
```

## Architecture

- **Web UI** (`web/`): Next.js App Router, React, Tailwind CSS. Login, project
  dashboard, brief submission, and project status pages.
- **Engine** (`engine/`): Express HTTP API. Project store, brief intake,
  department delegation, quality gates, and deploy-gate checks.
- **Workflow** (from the reference project): intake → requirements → product
  strategy → UX → UI → (database → backend) → frontend → content → (QA,
  security, SEO) → project manager → devops deploy.

## Design system

The UI follows the **"Cracktro Scroller — Approachable"** visual world: an
emissive black void ground, a single signal-amber accent reserved for the
primary action, clean readable sans-serif type (Archivo, self-hosted), depth
expressed through brightness and tone rather than boxes or rules, and a
three-depth CSS dust field drifting behind the content.

| Artifact | What it holds |
|----------|---------------|
| `PRODUCT.md` | Durable product truth (users, purpose, positioning, principles) |
| `DESIGN.md` | The visual system: tokens, type ramp, named rules, components, do's & don'ts |
| `.impeccable/design.json` | Machine-readable sidecar — colour ramps, shadows, motion, components |
| `.impeccable/surfaces/homepage.md` | The direction contract for the landing surface |
| `.impeccable/review/` | Review captures at 1440 and 390 |

`DESIGN.md` and the sidecar are generated from the built code, so they describe
what actually shipped rather than what was planned.

## Comp fidelity pipeline (optional)

The build shipped **code-led** because image generation was quota-blocked, so
the decision comp was never rendered and the finish review's verdict covered
the scored fixes rather than the whole surface. Once a quota window opens:

```bash
# 1. generate the decision comp (one image call — needs the image tool)
#    path: .impeccable/mocks/decision/cracktro-safe.webp
#    refs: .impeccable/mocks/worlds/operate-c-cracktro-scroller-queue-{board,hero}.webp
#    prompt: the exact text in .impeccable/mocks/decision/cracktro-safe.webp.json

# 2. the rest is automated
scripts/comp-fidelity.sh          # sidecar → build-phase → comp-spec grid → comp-diff
```

`scripts/comp-watcher.sh` runs the same flow unattended: it waits for the quota
window, watches for the comp to land, and drives the measurement pipeline as
soon as it appears.

## License

MIT
