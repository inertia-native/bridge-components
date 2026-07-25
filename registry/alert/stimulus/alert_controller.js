import { BridgeComponent, BridgeElement } from '@hotwired/hotwire-native-bridge'

// Puts a native confirmation dialog in front of an element's own action. In a
// regular browser (bridge not enabled) the element behaves as it always did.
//
//   <a href="/posts/1" data-turbo-method="delete"
//      data-controller="alert" data-action="alert#show"
//      data-bridge-title="Delete post?"
//      data-bridge-description="This cannot be undone."
//      data-bridge-destructive="true"
//      data-bridge-confirm="Delete">Delete</a>
//
export default class extends BridgeComponent {
  static component = 'alert'

  // Guards the re-dispatch below: the click we replay must reach the element's
  // own handlers instead of coming back here and asking again.
  #confirming = true

  show(event) {
    if (!this.enabled || !this.#confirming) return

    event.stopImmediatePropagation()
    event.preventDefault()
    this.#showAlert()
  }

  #showAlert() {
    const element = new BridgeElement(this.element)

    const title = element.title || 'Are you sure?'
    const description = element.bridgeAttribute('description')
    const destructive = element.bridgeAttribute('destructive') === 'true'
    const confirm = element.bridgeAttribute('confirm') || 'OK'
    const dismiss = element.bridgeAttribute('dismiss') || 'Cancel'

    // Native answers only a confirmation; a dismissal sends nothing back.
    this.send('show', { title, description, destructive, confirm, dismiss }, () => {
      this.#confirming = false
      this.element.click()
      this.#confirming = true
    })
  }
}
