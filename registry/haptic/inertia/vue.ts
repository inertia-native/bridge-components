import { useBridgeComponent } from 'inertia-hotwire-native/vue'

export type HapticFeedback = 'success' | 'warning' | 'error'

// Rough web equivalents, in milliseconds. The native side has real haptics and
// picks its own feel — this only exists so the call does something in an
// Android browser.
const WEB_PATTERNS: Record<HapticFeedback, number[]> = {
  success: [12],
  warning: [12, 80, 12],
  error: [30, 80, 30],
}

/**
 * Plays native haptic feedback inside Hotwire Native, and falls back to
 * `navigator.vibrate` in browsers that have it — so a caller never has to branch
 * on `supported`. That is returned for pages that want to hide a control which
 * would do nothing.
 *
 * Nothing is ever reported back, so there is no callback to clean up.
 */
export function useBridgeHaptic() {
  const { supported, send } = useBridgeComponent('haptic')

  const vibrate = (feedback: HapticFeedback = 'success') => {
    if (supported.value) {
      send('vibrate', { feedback })
      return
    }

    // Absent on iOS Safari and on desktop; present but gesture-gated on
    // Android. Nothing to do when it is missing.
    navigator.vibrate?.(WEB_PATTERNS[feedback] ?? WEB_PATTERNS.success)
  }

  return { supported, vibrate }
}
