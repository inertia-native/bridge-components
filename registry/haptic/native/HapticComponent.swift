import Foundation
import HotwireNative
import UIKit

/// Native counterpart of the `haptic` bridge component. Plays notification
/// feedback for the web side's `vibrate` message. Nothing is reported back.
///
/// Register once with `Hotwire.registerBridgeComponents([HapticComponent.self])`.
///
/// Follows joemasilotti/bridge-components (MIT).
final class HapticComponent: BridgeComponent {
    override nonisolated class var name: String { "haptic" }

    override func onReceive(message: Message) {
        guard let event = Event(rawValue: message.event) else {
            return
        }

        switch event {
        case .vibrate:
            handleVibrateEvent(message: message)
        }
    }

    // MARK: Private

    private func handleVibrateEvent(message: Message) {
        guard let data: MessageData = message.data() else { return }

        // An unrecognised feedback type plays success rather than nothing, per
        // the contract — a page built against a newer contract still feels
        // something on an older app.
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(data.feedbackType.uiKitType)
    }
}

// MARK: Events

private extension HapticComponent {
    enum Event: String {
        case vibrate
    }
}

// MARK: Message data

private extension HapticComponent {
    struct MessageData: Decodable {
        let feedback: String?

        var feedbackType: FeedbackType {
            FeedbackType(rawValue: feedback ?? "") ?? .success
        }
    }

    enum FeedbackType: String {
        case success
        case warning
        case error

        var uiKitType: UINotificationFeedbackGenerator.FeedbackType {
            switch self {
            case .success: .success
            case .warning: .warning
            case .error: .error
            }
        }
    }
}
