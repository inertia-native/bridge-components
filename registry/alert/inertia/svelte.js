import { get } from 'svelte/store'
import { useBridgeComponent } from 'inertia-hotwire-native/svelte'

/**
 * Presents a native confirmation dialog inside Hotwire Native, and falls back to
 * `window.confirm` in a regular browser — so a caller never has to branch on
 * `supported`. That is returned (as the store the bindings hand back) for pages
 * that would rather render their own dialog than use the browser one.
 *
 * A plain function rather than a component: unlike `button`, this component
 * draws nothing until it is asked to, so there is no markup for an SFC to own.
 *
 * @returns {{ supported: import('svelte/store').Readable<boolean>, show: (options: { title: string, description?: string, destructive?: boolean, confirm?: string, dismiss?: string }, onConfirm?: () => void) => void }}
 */
export function useBridgeAlert() {
  const { supported, send } = useBridgeComponent('alert')

  // A dismissed alert is answered with silence, so its callback is never
  // invoked and would sit in the bridge's map until the page unmounts. Dropping
  // the previous one before each show keeps at most one outstanding.
  let pendingId = null

  const show = (options, onConfirm) => {
    const { title, description, destructive = false, confirm = 'OK', dismiss = 'Cancel' } = options

    // Read the store imperatively: `show` is called from an event handler, not
    // from a reactive block that could subscribe to it.
    if (!get(supported)) {
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
