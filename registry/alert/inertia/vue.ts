import { useBridgeComponent } from 'inertia-hotwire-native/vue'

export interface BridgeAlertOptions {
  /** Headline of the alert. */
  title: string
  /** Body text under the title. */
  description?: string
  /** Draw the confirming action in the platform's destructive style. */
  destructive?: boolean
  /** Label of the confirming action. */
  confirm?: string
  /** Label of the dismissing action. */
  dismiss?: string
}

/**
 * Presents a native confirmation dialog inside Hotwire Native, and falls back to
 * `window.confirm` in a regular browser — so a caller never has to branch on
 * `supported`. That is returned for pages that would rather render their own
 * dialog than use the browser one.
 *
 * A composable rather than a component: unlike `button`, this component draws
 * nothing until it is asked to, so there is no markup for an SFC to own.
 */
export function useBridgeAlert() {
  const { supported, send } = useBridgeComponent('alert')

  // A dismissed alert is answered with silence, so its callback is never
  // invoked and would sit in the bridge's map until the page unmounts. Dropping
  // the previous one before each show keeps at most one outstanding.
  let pendingId: string | null = null

  const show = (options: BridgeAlertOptions, onConfirm?: () => void) => {
    const {
      title,
      description,
      destructive = false,
      confirm = 'OK',
      dismiss = 'Cancel',
    } = options

    if (!supported.value) {
      if (window.confirm([title, description].filter(Boolean).join('\n\n'))) onConfirm?.()
      return
    }

    if (pendingId) window.HotwireNative?.web?.removeCallback(pendingId)

    pendingId = send('show', { title, description, destructive, confirm, dismiss }, () => {
      pendingId = null
      onConfirm?.()
    })
  }

  return { supported, show }
}
