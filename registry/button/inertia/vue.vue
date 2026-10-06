<script setup lang="ts">
import { watch } from 'vue'
import { useBridgeComponent } from 'inertia-native/vue'

// Renders a native navigation-bar button inside Hotwire Native. In a regular
// browser (no native adapter) it renders the default slot as a normal control.
const props = withDefaults(
  defineProps<{
    /** Label shown on the native navigation-bar button. */
    title: string
    /** Which side of the navigation bar. Defaults to the trailing edge. */
    side?: 'left' | 'right'
  }>(),
  { side: 'right' }
)

const emit = defineEmits<{ tap: [] }>()

const { supported, send, restored } = useBridgeComponent('button')

// Register on support (arrives after the async handshake) and re-register when
// the title/side change, or when the web view comes back from a native screen
// (`restored`, Android), since native may have dropped the button. Native
// replies to "connect" on every tap.
watch(
  () => [supported.value, props.title, props.side, restored.value] as const,
  (_value, _old, onCleanup) => {
    if (!supported.value) return
    const id = send('connect', { title: props.title, side: props.side }, () => emit('tap'))
    // Drop the old callback before re-registering, so a title/side change does
    // not leave a second one behind and report every tap twice.
    onCleanup(() => window.HotwireNative?.web?.removeCallback(id))
  },
  { immediate: true }
)
</script>

<template>
  <slot v-if="!supported" />
</template>
