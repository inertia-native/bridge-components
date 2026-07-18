# Button — bridge contract

A button rendered in the **native navigation bar**. The web side registers a
title; the native side draws a `UIBarButtonItem` (iOS) / toolbar menu item
(Android); a tap is relayed back to the web side.

- **Component name:** `button`
- **Fallback:** with no native adapter connected (regular browser), the web side
  renders its normal control and this component does nothing.

## Messages

### `connect` — web → native

Registers (or re-registers) the bar button. Sent on connect and whenever the
title or side changes.

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
- New fields must be optional with a native-side default, so a copied web
  component built against an older contract keeps working against a newer native
  package. Never repurpose or remove an existing field.
