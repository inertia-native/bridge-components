import { useCallback, useRef } from 'react'
import { useBridgeComponent } from 'inertia-hotwire-native/react'

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

export interface BridgeAlert {
  /** Whether the connected native app draws the alert. */
  supported: boolean
  /** Present the alert; `onConfirm` runs only if it was confirmed. */
  show(options: BridgeAlertOptions, onConfirm?: () => void): void
}

/**
 * Presents a native confirmation dialog inside Hotwire Native, and falls back to
 * `window.confirm` in a regular browser — so a caller never has to branch on
 * `supported`. That is returned for pages that would rather render their own
 * dialog than use the browser one.
 */
export function useBridgeAlert(): BridgeAlert {
  const { supported, send } = useBridgeComponent('alert')

  // A dismissed alert is answered with silence, so its callback is never
  // invoked and would sit in the bridge's map until the page unmounts. Dropping
  // the previous one before each show keeps at most one outstanding.
  const pendingId = useRef<string | null>(null)

  const show = useCallback(
    (options: BridgeAlertOptions, onConfirm?: () => void) => {
      const {
        title,
        description,
        destructive = false,
        confirm = 'OK',
        dismiss = 'Cancel',
      } = options

      if (!supported) {
        if (window.confirm([title, description].filter(Boolean).join('\n\n'))) onConfirm?.()
        return
      }

      if (pendingId.current) window.HotwireNative?.web?.removeCallback(pendingId.current)

      pendingId.current = send('show', { title, description, destructive, confirm, dismiss }, () => {
        pendingId.current = null
        onConfirm?.()
      })
    },
    [supported, send]
  )

  return { supported, show }
}
