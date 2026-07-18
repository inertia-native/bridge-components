import { BridgeComponent, BridgeElement } from '@hotwired/hotwire-native-bridge'

// Adds a button to the native navigation bar. In a regular browser (bridge not
// enabled) this controller does nothing and the element stays as-is.
//
//   <a href="/save" data-controller="button" data-bridge-title="Save">Save</a>
//
export default class extends BridgeComponent {
  static component = 'button'

  connect() {
    super.connect()
    this.#connectComponent()
  }

  #connectComponent() {
    if (!this.enabled) return

    const element = new BridgeElement(this.element)
    const title = element.title
    const side = element.bridgeAttribute('side') || 'right'

    // Native replies to "connect" on each tap; forward it as a click.
    this.send('connect', { title, side }, () => {
      this.element.click()
    })
  }
}
