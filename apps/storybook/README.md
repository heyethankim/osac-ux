# @osac/storybook

A Storybook of the **golden patterns** — the canonical way this product builds a list
page, a card, a status label, an error state.

It runs **completely standalone**: no cluster, no `FULFILLMENT_API_URL`, no `oc` login,
no network. Every story is served by `createMockConnectTransport`, the same in-memory
Connect router the Vitest suite uses.

```bash
pnpm --filter @osac/storybook storybook        # dev server on http://localhost:6006
pnpm --filter @osac/storybook build-storybook  # static build into apps/storybook/dist
```

Start at the **Introduction** page in the sidebar.

## Layout

```
apps/storybook/
├── .storybook/
│   ├── main.ts          framework, addons, and the @osac/ui-components alias
│   ├── preview.tsx      PatternFly CSS, global decorators, theme/contrast/role toolbar
│   ├── decorators.tsx   withTheme (product theming) + withProviders (mock API tree)
│   ├── types.ts         the `parameters.osac` contract
│   └── preview.css      canvas surface, mirrors app-frontend/src/index.css
└── stories/
    ├── Introduction.mdx          what a golden pattern is, how to read the book
    ├── patterns/                 page- and composition-level patterns (GP-*)
    ├── primitives/               single components
    └── fixtures/                 deterministic protobuf fixtures + failure transports
```

## Conventions

**Stories render the real components.** Never a replica or a simplified copy — the whole
point is that what you see is what ships. Page patterns render the actual page component
and are driven from the transport boundary.

**Never call `t()` in a story.** `libs/i18n/i18next.config.ts` extracts from
`{libs,apps}/*/src/**`, and `pnpm lint` fails when `locales/en/translation.json` is out
of sync. Stories live in `stories/`, outside that glob, which keeps them out of the
translation file — but a `t()` call is still a trap waiting for the day someone moves
them. Copy that belongs to a component comes from the component.

**Fixtures are deterministic.** Fixed dates and ids, so a story can be screenshotted,
diffed and reviewed. No `Date.now()`.

**Per-story wiring goes in `parameters.osac`** — see `.storybook/types.ts`.

## Keeping it honest

| Command | What it covers |
| --- | --- |
| `pnpm typecheck` | Includes this package — `tsc --noEmit` over `.storybook/` and `stories/` |
| `pnpm --filter @osac/storybook lint` | ESLint over this package (the root `pnpm lint` globs only `*/src/**`) |
| `pnpm --filter @osac/storybook build-storybook` | Proves every story module still resolves and compiles |

> **`typecheck` currently reports one inherited error.** GP-3 imports the VM
> provisioning wizard, which pulls in
> `libs/ui-components/src/components/catalogProvision/wizard/adapters/computeInstance/VmInstanceTypeStep.tsx:224`.
> That line passes `validated` to PatternFly 6's `FormGroup`, which no longer
> accepts it. The error is pre-existing — it is one of the 42 that
> `@osac/ui-components`'s own `typecheck` already reports — and it is a real
> bug, not just a type complaint: the field's invalid state never renders (see
> Introduction, finding F13). Deleting that one prop clears both. It was left
> in place here to keep this change to the Storybook.

The a11y panel runs axe on every story. Treat a clean run as a floor: most WCAG 2.2 AA
criteria are manual, and the Introduction page lists the checks axe cannot make for you.

### React is pinned

`react` and `react-dom` are pinned to the exact same version here. With a caret range,
pnpm resolved a newer `react` than `react-dom` for this package alone and every story
died on React's "Incompatible React versions" guard. If you bump one, bump both.

### Not shipped

Storybook is a development tool. It is not in the `Containerfile`, not in the production
build, and nothing in `apps/app-frontend` imports it. Telemetry is disabled.
