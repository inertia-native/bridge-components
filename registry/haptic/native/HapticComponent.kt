// Replace with your app's package.
package com.example.bridge

import android.os.Build
import android.util.Log
import android.view.HapticFeedbackConstants
import androidx.fragment.app.Fragment
import dev.hotwire.core.bridge.BridgeComponent
import dev.hotwire.core.bridge.BridgeDelegate
import dev.hotwire.core.bridge.Message
import dev.hotwire.navigation.destinations.HotwireDestination
import kotlinx.serialization.Serializable

/**
 * Native counterpart of the `haptic` bridge component. Plays haptic feedback for
 * the web side's `vibrate` message. Nothing is reported back.
 *
 * Register once with
 * `Hotwire.registerBridgeComponents(BridgeComponentFactory("haptic", ::HapticComponent))`.
 *
 * Uses `View.performHapticFeedback`, so no `VIBRATE` permission is needed and
 * the device's own haptic settings are respected. `CONFIRM` and `REJECT` arrived
 * in API 30; below that both fall back to constants that have always existed.
 */
class HapticComponent(
    name: String,
    private val delegate: BridgeDelegate<HotwireDestination>
) : BridgeComponent<HotwireDestination>(name, delegate) {

    private val fragment: Fragment
        get() = delegate.destination.fragment

    override fun onReceive(message: Message) {
        when (message.event) {
            "vibrate" -> handleVibrateEvent(message)
            else -> Log.w("HapticComponent", "Unknown event for message: $message")
        }
    }

    private fun handleVibrateEvent(message: Message) {
        val data = message.data<MessageData>() ?: return
        val view = fragment.view ?: return

        // An unrecognised feedback type plays success rather than nothing, per
        // the contract.
        val feedback = FeedbackType.from(data.feedback)
        view.performHapticFeedback(feedback.constant)
    }

    private enum class FeedbackType(val constant: Int) {
        SUCCESS(
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                HapticFeedbackConstants.CONFIRM
            } else {
                HapticFeedbackConstants.VIRTUAL_KEY
            }
        ),
        WARNING(HapticFeedbackConstants.LONG_PRESS),
        ERROR(
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                HapticFeedbackConstants.REJECT
            } else {
                HapticFeedbackConstants.LONG_PRESS
            }
        );

        companion object {
            fun from(value: String?) = when (value) {
                "warning" -> WARNING
                "error" -> ERROR
                else -> SUCCESS
            }
        }
    }

    @Serializable
    data class MessageData(
        val feedback: String? = null
    )
}
