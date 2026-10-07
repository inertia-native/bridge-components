# Haptic — bridge contract

**Native haptic feedback** — a tap you feel rather than see. The web side asks
for a feedback type; the native side decides what that feels like on its
platform.

- **Component name:** `haptic`
- **Fallback:** with no native adapter connected (regular browser), the web side
  falls back to `navigator.vibrate` where the browser has it, and does nothing
  where it does not.

## Messages

### `vibrate` — web → native

Plays one piece of feedback. Fire-and-forget.

```jsonc
{
  "feedback": "success"   // "success" | "warning" | "error", optional
}
```

### No reply

Native **never replies** to `vibrate`. There is nothing to report — the
feedback either played or the device cannot play it, and neither outcome changes
what the web side does next.

This makes `haptic` the cheapest component in the registry: the web side
registers no callback, so it has none to clean up.

## Compatibility rules

- **An unknown `feedback` plays `success`.** Native must not drop a message it
  does not recognise — a web side built against a newer contract sending
  `"impact"` to an older native half should still feel something.
- `feedback` is a *category*, not a waveform. What each one feels like is the
  native side's choice and differs by platform; iOS has a notification feedback
  generator with exactly these three, Android composes its own from what the
  device supports. Do not build web-side logic that assumes a particular
  duration or intensity.
- New feedback types must be additive, and old native halves will play them as
  `success` per the rule above.

## Platform notes

- **Simulators and emulators do not vibrate.** Neither does a device with system
  haptics switched off, or an iPhone in Low Power Mode. A component that appears
  to do nothing is usually the environment, not the wiring — log the message on
  the native side to tell them apart.
- Haptics on the web (`navigator.vibrate`) exist only on Android browsers, need
  a user gesture, and are a single buzz with no notion of type. The fallback is a
  courtesy, not a match.
