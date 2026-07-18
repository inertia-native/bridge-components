<script setup lang="ts">
import { watch } from 'vue'
import { useBridgeComponent } from 'inertia-hotwire-native/vue'

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

const { supported, send } = useBridgeComponent('button')

// Register on support (arrives after the async handshake) and re-register when
// the title/side change. Native replies to "connect" on every tap.
watch(
  () => [supported.value, props.title, props.side] as const,
  () => {
    if (!supported.value) return
    send('connect', { title: props.title, side: props.side }, () => emit('tap'))
  },
  { immediate: true }
)
</script>

<template>
  <slot v-if="!supported" />
</template>
