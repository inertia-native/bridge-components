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

### Native SDK compatibility

The Swift components target **`hotwire-native-ios` 1.2.0 or newer**.

1.2.0 ([2025-04-23](https://github.com/hotwired/hotwire-native-ios/releases/tag/1.2.0))
made `BridgeComponent.delegate` a weak optional. The components reach the hosting
view controller through `delegate?.destination`, which does not compile against
1.1.x — and the 1.1.x spelling `delegate.destination` does not compile against
1.2.0+. There is no source form that satisfies both, so this is a hard floor
rather than a recommendation.

Separately, `name` is overridden as `override nonisolated class var name`. The
base declaration is `nonisolated`, so an app built with
`SWIFT_DEFAULT_ACTOR_ISOLATION = MainActor` (the Xcode 26 default for new
projects) rejects a plain `override class var name` as an actor-isolation
mismatch. The `nonisolated` spelling is correct under either setting.

The Kotlin components are built against **`dev.hotwire:core` / `navigation-fragments`
1.2.8**. That is the version they have been compiled against, not a floor that has
been probed — older releases may well work.

They reach the toolbar through `fragment.view?.findViewById(R.id.toolbar)`, so
the host app's destination layout has to provide a toolbar with that id. This is
what Hotwire Native's own fragments give you; a custom destination layout may
not.

## Components

- **Alert** — a native confirmation dialog. ([contract](registry/alert/contract.md))
- **Button** — a native navigation-bar button. ([contract](registry/button/contract.md))
- **Haptic** — native haptic feedback. ([contract](registry/haptic/contract.md))

A component that draws native UI on mount ships an Inertia *component*
(`react.tsx`, `vue.vue`, `svelte.svelte`). One that draws nothing until it is
called — `alert` — has no markup to own, so its Inertia flavor is a hook /
composable instead (`react.tsx`, `vue.ts`, `svelte.js`).

## License

MIT
