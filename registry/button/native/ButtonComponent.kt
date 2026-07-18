// Replace with your app's package.
package com.example.bridge

import android.view.Menu
import android.view.MenuItem
import dev.hotwire.core.bridge.BridgeComponent
import dev.hotwire.core.bridge.BridgeDelegate
import dev.hotwire.core.bridge.Message
import dev.hotwire.navigation.destinations.HotwireDestination
import kotlinx.serialization.Serializable

/**
 * Native counterpart of the `button` bridge component. Adds a menu item to the
 * destination's toolbar from the web side's `connect` message and relays taps
 * back by replying to that same message.
 *
 * Register once with `Hotwire.registerBridgeComponents(BridgeComponentFactory("button", ::ButtonComponent))`.
 */
class ButtonComponent(
    name: String,
    private val delegate: BridgeDelegate<HotwireDestination>,
) : BridgeComponent<HotwireDestination>(name, delegate) {

    private var data: MessageData? = null

    override fun onReceive(message: Message) {
        when (message.event) {
            "connect" -> handleConnectEvent(message)
        }
    }

    private fun handleConnectEvent(message: Message) {
        val data = message.data<MessageData>() ?: return
        this.data = data

        // Ask the destination's fragment to (re)build its menu with this item.
        // The fragment forwards onCreateOptionsMenu/onOptionsItemSelected here.
        val fragment = delegate.destination.fragment
        fragment.requireActivity().invalidateOptionsMenu()
    }

    fun onMenuItemSelected(itemId: Int): Boolean {
        if (itemId != MENU_ITEM_ID) return false
        // Reply to "connect" — the web side treats this as the tap signal.
        replyTo("connect")
        return true
    }

    fun addItemToMenu(menu: Menu) {
        val data = data ?: return
        menu.add(Menu.NONE, MENU_ITEM_ID, Menu.NONE, data.title)
            .setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM)
    }

    @Serializable
    data class MessageData(
        val title: String,
        val side: String? = "right",
    )

    companion object {
        private const val MENU_ITEM_ID = 1001
    }
}
