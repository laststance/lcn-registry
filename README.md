# LCN Registry

Open React hooks distributed as a shadcn custom registry.

The first registry item, `lifecycle-effects`, installs explicit React 19+
effect hooks into your project's configured hooks directory.

## Install

Install directly from the public registry item:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/laststance/lcn-registry/main/public/r/lifecycle-effects.json
```

Or register a namespace in `components.json`:

```json
{
  "registries": {
    "@lcn-registry": "https://raw.githubusercontent.com/laststance/lcn-registry/main/public/r/{name}.json"
  }
}
```

Then install by name:

```bash
npx shadcn@latest add @lcn-registry/lifecycle-effects
```

Before installing, inspect the exact code payload:

```bash
npx shadcn@latest view https://raw.githubusercontent.com/laststance/lcn-registry/main/public/r/lifecycle-effects.json
```

## Lifecycle Effects

`lifecycle-effects` adds:

- `useInitialEffect`: mount-only effects.
- `useUpdateEffect`: post-mount update effects, with empty deps rejected at the type level.
- `useUnmountEffect`: unmount-only cleanup using React 19 `useEffectEvent`.
- `useRenderEffect`: every render, or mount plus non-empty dependency changes.
- `useCycleEffect`: a semantic alias for `useEffect`.

React 19+ is required because `useUnmountEffect` and `useUpdateEffect` use
`useEffectEvent` to call the latest callback without forcing dependency churn.

## Development

```bash
pnpm install
pnpm registry:build
pnpm registry:check
pnpm typecheck
pnpm validate
```

The generated registry item lives in `public/r/lifecycle-effects.json`.
Review that JSON in pull requests because it is the exact payload consumed by
the shadcn CLI.
