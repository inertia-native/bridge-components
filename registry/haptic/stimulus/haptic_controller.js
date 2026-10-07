import { BridgeComponent, BridgeElement } from '@hotwired/hotwire-native-bridge'

// Plays native haptic feedback when the decorated element acts. In a regular
// browser (bridge not enabled) this controller does nothing and the element
// behaves as it always did.
//
//   <button data-controller="haptic" data-action="haptic#vibrate"
//           data-bridge-feedback="error">Delete</button>
//
// Adapted from joemasilotti/bridge-components (MIT), as is the Swift half.
export default class extends BridgeComponent {
  static component = 'haptic'

  vibrate() {
    if (!this.enabled) return

    const element = new BridgeElement(this.element)
    const feedback = element.bridgeAttribute('feedback') || 'success'

    // Fire-and-forget: native never answers, so no callback is registered.
    this.send('vibrate', { feedback })
  }
}
