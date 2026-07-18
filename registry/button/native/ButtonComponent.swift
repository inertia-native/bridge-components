import HotwireNative
import UIKit

/// Native counterpart of the `button` bridge component. Draws a navigation-bar
/// button from the web side's `connect` message and relays taps back by replying
/// to that same message.
///
/// Register once with `Hotwire.registerBridgeComponents([ButtonComponent.self])`.
final class ButtonComponent: BridgeComponent {
    override class var name: String { "button" }

    override func onReceive(message: Message) {
        guard message.event == "connect" else { return }
        handleConnectEvent(message: message)
    }

    private var viewController: UIViewController? {
        delegate.destination as? UIViewController
    }

    private func handleConnectEvent(message: Message) {
        guard let data: MessageData = message.data() else { return }

        let action = UIAction { [unowned self] _ in
            // Reply to "connect" — the web side treats this as the tap signal.
            self.reply(to: "connect")
        }
        let item = UIBarButtonItem(title: data.title, primaryAction: action)

        switch data.side {
        case "left":
            viewController?.navigationItem.leftBarButtonItem = item
        default:
            viewController?.navigationItem.rightBarButtonItem = item
        }
    }
}

private extension ButtonComponent {
    struct MessageData: Decodable {
        let title: String
        let side: String?
    }
}
