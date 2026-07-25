# Alert — bridge contract

A **native confirmation dialog**. The web side asks for an alert and gets told
only when the confirming action was tapped; the native side draws a
`UIAlertController` (iOS) / `AlertDialog` (Android).

- **Component name:** `alert`
- **Fallback:** with no native adapter connected (regular browser), the web side
  falls back to `window.confirm`, so the calling page behaves the same either
  way.

## Messages

### `show` — web → native

Presents the alert. Sent once per confirmation, not on connect.

```jsonc
{
  "title": "Are you sure?",             // string, required — headline
  "description": "This cannot be undone.", // string, optional — body text
  "destructive": true,                  // bool, optional, default false
  "confirm": "Delete",                  // string, optional, default "OK"
  "dismiss": "Cancel"                   // string, optional, default "Cancel"
}
```

`destructive` asks for the platform's destructive styling on the confirming
action — `.destructive` on iOS, a red-tinted positive button on Android.

### `show` reply — native → web

Native **replies to the `show` message only when the confirming action is
tapped**. Dismissing the alert — the dismiss action, tapping outside it, or a
hardware back press — sends nothing at all.

The reply carries no data; it is the confirmation signal itself.

## Compatibility rules

- `title` is the only required field; native must tolerate every other field
  being absent and supply the defaults above.
- **A dismissal is silence, not a reply.** A web side that registers a callback
  per `show` therefore leaves one behind on every dismissed alert. The registry
  components drop the previous callback before each `show`, so at most one is
  outstanding; a hand-written web side has to do the same or the bridge's
  callback map grows for as long as the page is mounted.
- Native must not reply more than once to a single `show` — the reply is a
  one-shot answer, unlike `button`'s `connect`, which replies on every tap.
- New fields must be optional with a native-side default, so a copied web
  component built against an older contract keeps working against a newer native
  package. Never repurpose or remove an existing field.

## Credits

The contract and the native implementations follow
[joemasilotti/bridge-components](https://github.com/joemasilotti/bridge-components)
(MIT), so an app already shipping that Swift/Kotlin half can drive this web side
unchanged.
