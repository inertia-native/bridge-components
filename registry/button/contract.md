# Button — bridge contract

A button rendered in the **native navigation bar**. The web side registers a
title; the native side draws a `UIBarButtonItem` (iOS) / toolbar menu item
(Android); a tap is relayed back to the web side.

- **Component name:** `button`
- **Fallback:** with no native adapter connected (regular browser), the web side
  renders its normal control and this component does nothing.

## Messages

### `connect` — web → native

Registers (or re-registers) the bar button. Sent on connect, whenever the
title or side changes, and again on `native:restore` (Android, back from a
native screen), so native must replace an existing button rather than add a
second one.

```jsonc
{
  "title": "Save",        // string, required — button label
  "side": "right"         // "left" | "right", optional, default "right"
}
```

### `connect` reply — native → web

Native **replies to the same `connect` message** every time the bar button is
tapped. There is no separate event — the reply *is* the tap signal. The web side
runs its tap handler (Inertia: `onTap` / `@tap`; Stimulus: `element.click()`).

## Compatibility rules

- `title` is the only required field; native must tolerate a missing `side`.
- `side` is a hint, not a guarantee. Android toolbar menu items always sit at the
  end of the bar, so the Kotlin component ignores it and a `"left"` button still
  appears on the right. Do not build layout logic on the web side that assumes
  the button landed where you asked.
- New fields must be optional with a native-side default, so a copied web
  component built against an older contract keeps working against a newer native
  package. Never repurpose or remove an existing field.
