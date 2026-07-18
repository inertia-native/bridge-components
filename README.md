# Hotwire Bridge Components

Copy-paste [Hotwire Native](https://native.hotwired.dev) **bridge components** for
JS-framework and Stimulus apps, with matching native (Swift / Kotlin) counterparts.

Think shadcn/ui, but for the native bridge: you don't install a component
package — you copy the source into your app and own it. The only runtime
dependency is the bridge plumbing you already have.

## The model

One **component-first registry** is the single source of truth. Each component
is authored once across every dimension, and that same source feeds every
distribution channel.

```
registry/<component>/
├── contract.md                 # source of truth: the message protocol
├── inertia/                     # web — for inertia-hotwire-native apps
│   ├── react.tsx
│   ├── vue.vue
│   └── svelte.svelte
├── stimulus/                    # web — for classic Hotwire/Stimulus apps
│   └── <component>_controller.js
└── native/                      # ONE native impl, shared by every web flavor
    ├── <Component>Component.swift
    └── <Component>Component.kt
```

| Layer | Source of truth | Distribution |
| --- | --- | --- |
| Contract | `registry/<c>/contract.md` | — (spec both sides implement) |
| Web (Inertia ×3, Stimulus) | `registry/<c>/{inertia,stimulus}/` | docs copy-paste |
| Native (Swift, Kotlin) | `registry/<c>/native/` | docs copy-paste |

### Why native is shared

A native bridge component talks to the web side by **component name and events**
only — it has no idea whether the web is Inertia-React or a Stimulus controller.
So `ButtonComponent.swift` is written once and reused by every web flavor. The
per-component `contract.md` is what keeps all sides compatible; keep contracts
**additive** (add events, never break existing ones).

### Runtime dependencies (not copied)

The components are thin; the plumbing they stand on stays an external dependency:

- **Inertia flavors** → [`inertia-hotwire-native`](https://github.com/zumkorn/inertia-hotwire-native)
  (`useBridgeComponent`).
- **Stimulus flavor** → [`@hotwired/hotwire-native-bridge`](https://github.com/hotwired/hotwire-native-bridge)
  (`BridgeComponent`).
- **Native** → the Hotwire Native iOS / Android SDK (`BridgeComponent` base class).

This repo itself publishes nothing to npm. It is a registry + docs site.

## Components

- **Button** — a native navigation-bar button. ([contract](registry/button/contract.md))

## License

MIT
