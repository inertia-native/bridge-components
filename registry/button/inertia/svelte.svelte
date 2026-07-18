<script>
  import { createEventDispatcher } from 'svelte'
  import { useBridgeComponent } from 'inertia-hotwire-native/svelte'

  /** Label shown on the native navigation-bar button. */
  export let title
  /** Which side of the navigation bar. Defaults to the trailing edge. */
  export let side = 'right'

  const dispatch = createEventDispatcher()
  const { supported, send } = useBridgeComponent('button')

  // Held in a `const` object so reading the id below does not make this
  // reactive block depend on itself.
  const registration = { id: null }

  // `supported` is a store; it flips when the native handshake completes. Register
  // on support and re-register when title/side change. Native replies to
  // "connect" on every tap.
  $: if ($supported) {
    // Drop the old callback before re-registering, so a title/side change does
    // not leave a second one behind and report every tap twice.
    window.HotwireNative?.web?.removeCallback(registration.id)
    registration.id = send('connect', { title, side }, () => dispatch('tap'))
  }
</script>

<!-- Web fallback: shown only when there is no native adapter (regular browser). -->
{#if !$supported}
  <slot />
{/if}
