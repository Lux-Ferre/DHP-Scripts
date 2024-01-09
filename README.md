
# Idle-Pixel Scripts

This repo holds all my public scripts for [Idle-Pixel](https://idle-pixel.com/).
To use them, install them into a script handling tool like Tampermonkey.
You should probably install them via [Greasy Fork](https://greasyfork.org/en/users/1030473-lux-ferre) which makes it a lot easier and keeps the automatically updated.

## Table of Contents
- [All the Gems!](#all-the-gems)
- [Custom Interactor](#custom-interactor)
- [Chat History](#chat-history)
- [Chat Markdown](#chat-markdown)
- [Clammy Vock](#clammy-vock)
- [Customs Framework Plugin](#customs-framework-plugin)
- [Easter 2023 Tracker](#easter-2023-tracker)
- [Config Backup](#config-backup)
- [Kaat Client](#kaat-client)
- [Kaat Host](#kaat-host)
- [Websocket Message Sender](#websocket-message-sender)
- [ModMod Fork](#modmod-fork)
- [Bait Thrower](#bait-thrower)
- [No More No Arrows](#no-more-no-arrows)
- [Notes Panel](#notes-panel)
- [Overview](#overview)
- [Pinger](#pinger)
- [Database Link Remover](#database-link-remover)
- [Loot Popup Suppressor](#loot-popup-suppressor)
- [Sigil Randomizer](#sigil-randomizer)
- [Spider Taunt](#spider-taunt)
- [Template](#template)
- [Armour Uncrafter](#armour-uncrafter)
- [Chat Highlighter](#chat-highlighter)



## All the Gems!
###### Filename: *all-the-gems.js*

#### Description
Adds a right click option to gem goblin bags to open all of them at once. Loot from each bag will be collated into a single loot popup.

#### IP+ Configs:
 - None

## Custom Interactor
###### Filename: *bot-interactor.js*

#### Description
Dev tool which adds a panel (linked at top of page) to conveniently use ``CUSTOM`` type websocket messages. Panel is responsive and will match theme to UI-Tweaks if it is present. Messages should follow the ACS format:
``CUSTOM=player~callbackId:plugin:command:payload``

<blockquote>
'callbackId' is handled by IP+<br>
'plugin' is taken from the plugin override input on send, or defaults to "interactor"<br>
'command' is taken from the command input on send<br>
'payload' is taken from the payload input on send<br>
</blockquote>

Note: If no payload is given, that part of the message will be omitted fully eg:
``CUSTOM=player~callbackId:plugin:command``

Received messages will be parsed on the assumption of the ACS format. If a message is received that does not follow this format it will be treated as if it was as follows:
``CUSTOM=player~callbackId:unknown:unknown:payload``

Although callbackId is handled by IP+, if not callbackId is present, it will be displayed as ``-1`` in the pseudo-console.

#### IP+ Configs:
 - receiver: string
   - Default account messages will be sent to.
- textareaLines: int
   - Number of lines in pseudo-console (<30 will shrink panel to match.)
- ignorePluginList: string
   - Comma separated list of plugins to ignore in pseudo-console.
- defaultCommandList: string
   - Comma separated list of commands to populate the commands dropdown with.
- pluginOverride: string
   - Default plugin name to override "interactor" with.
- rememberCommand: bool
   - Retain last sent command in pseudo-console.

## Chat History
###### Filename: *chat-hist.js*

#### Description
On login, this script sends a request to LuxBot requesting the most recent messages from chat and displays them, allowing players to see what was said before they logged in. The current number of messages LuxBot will return is 5.

#### IP+ Configs:
 - None

## Chat Markdown
###### Filename: *chat-markdown.js*

This chat modification script adds some minor support for markdown. At present, it adds support for codeblocks with double backtick  \`\`code block\`\` ; and bold text with double asterisk \*\*bold text \*\*.

Note: These are implemented using ``<code>`` and ``<strong>`` HTML elements so will display differently in different browsers.

#### IP+ Configs:
 - None

## Clammy Vock
###### Filename: *clammy-vock.js*

#### Description
A script which replaces the word "Clammy" with a random 2-part nickname starting with "C" and rhyming with "Rock" in your chat messages when you click "Send". This is a joke based on how often CammyRock's username is misspelled.

#### IP+ Configs:
 - None

## Customs Framework Plugin
###### Filename: *customs-plugin.js*

#### Description
Extension to IP+ that adds static methods for handling custom websocket messages. It is designed to make using customs in the Anwin Custom Standard format easier.

The ACS format is: ``CUSTOM=recipient:callbackId:plugin:command:payload``

##### Parser

``Customs.parseCustom(player, content, callbackId)``

Returns a single object of the form:

```
{
	player: player,
	callbackId: callbackId,
	anwinFormatted: true,
	plugin: plugin,
	command: command,
	payload: payload
}
```

Note: If message is *not* in the ACS format, the returned object will be of the form:

```
{
	player: player,
	callbackId: callbackId,
	anwinFormatted: false,
	plugin: "unknown",
	command: "unknown",
	payload: content
}
```

##### Sender

``Customs.sendBasicCustom(recipient, plugin, command, payload)``

This method will create an IP+ custom object and pass it on to ``IdlePixelPlus.sendCustomMessage()``

If the advanced features of ``IdlePixelPlus.sendCustomMessage()`` are needed (ie callback functions), that method will have to be called directly instead.

#### IP+ Configs:
 - None

## Easter 2023 Tracker
###### Filename: *easter-2023.js*

#### Description
This script adds a panel for tracking which eggs you have crafted for the Easter 2023 event, making it easier to know which you have left to try. Additionally, it has audio and popup notifications for the bunny used to trigger the event so you don't miss it while looking at another tab/window.

#### IP+ Configs:
 - None

## Config Backup
###### Filename: *idlepixelplus-backup.js*

#### Description
Provides a panel based UI giving access to the Idle-Pixel Plus plugin configs. Dynamically generates text boxes for each plugin that will be populated by the localstorage config data, allowing them to easily be copied out. Additionally, adds a restore feature that will take the config data and reapply it.

The Greasy Fork page contains a table of UI-Tweaks themes including pastebin links with to apply them via this script.

#### IP+ Configs:
 - None

## Kaat Client
###### Filename: *kaat-client.js*

#### Description
Companion script for Kaat Host. All features of this script are accessible via a fully responsive panel. There are two main parts, one that is available to all players, and one that is only available when running alongside the host.

The main part provides realtime visuals on the state of the pet with progress bars showing its 4 stats.

The hidden part allows the host to update the pet's configs.

#### IP+ Configs:
 - None


## Kaat Host
###### Filename: *kaat-host.js*

#### Description
Created for Kaat to run on her ᓚᘏᗢ account.
Tamagotchi style community game. It has 3 primary stats and 1 secondary stat which lower over time and can be raised by the community via chat commands.
Most values and reply strings are stored in localstorage to be edited via the Kaat Client companion script.

#### IP+ Configs:
 - kaatAccount: string
	 - Name of the account to be running the game.
 - blacklist: string
	 - Comma separated list of accounts to ignore chat commands from.


## Websocket Message Sender
###### Filename: *message-sender.js*

#### Description
A simple UI wrapper for sending websocket messages.

#### IP+ Configs:
 - None

## ModMod Fork
###### Filename: *modmod.js*

#### Description
Forked from Anwinity's ModMod moderation tool.
Advanced features require LuxBot communication.

Adds a context menu for chat, allowing for quick access to moderation tools (original feature). Adds a panel which contains most other features.
 - Lists online mods (accounts running this script)
 - Has quick links to off-game moderation tools
 - Has a chat box with toggleable alerts:
	 - Login events (for accounts running this script)
	 - Automatic moderation actions taken by one of the bots
	 - @mods mentions in main chat
	 - Moderation actions taken via the context menu

#### IP+ Configs:
 - bot: string
	 - Account name running the bot for advanced features
- modstuffPlayerIDURL: string
	- URL for .csv containing ID>username map
- modstuffUsername: string
	- Username to access map
- modstuffPassword: string
	- Password to access map
- loginColour: colour picker
	- Background colour for login events in mod chat
- automodColour
	- Background colour for automod events in mod chat
- atPingColour
	- Background colour for @mod pings in mod chat
- contextColour
	- Background colour for context menu events in mod chat

## Bait Thrower
###### Filename: *multi-bait.js*

#### Description
Replaces the vanilla popup for using bait with one that allows throwing multiples. All the loot from the batch is collated into a single popup.

#### IP+ Configs:
 - None

## No More No Arrows
###### Filename: *no-no-arrows.js*

#### Description
Simple script that suppresses the toast alerting the player that they are attempting to use a bow with no arrows.

#### IP+ Configs:
 - None

## Notes Panel
###### Filename: *note-panel.js*

#### Description
Adds a panel for keeping notes. Notes are saved in localStorage

#### IP+ Configs:
 - None

## Overview
###### Filename: *overview.js*

#### Description
Adds a new panel containing most game functions in one place. Panel is fully responsive (via Bootstrap) and modular, with the number of panels per row customizable by the player.

#### IP+ Configs:
 - colNum: int
	 - Number of modules per row
- farmingEnabled
- gatheringEnabled
- mineralsEnabled
- woodcuttingEnabled
- smeltingEnabled
- cookingEnabled
- brewingEnabled
- fishingEnabled
- machineryEnabled
	- Toggles for related modules.

## Pinger
###### Filename: *pinger.js*

#### Description
Joke script that adds a chat command ``/ping <player>``.
The player is then given an alert that they have been pinged.

#### IP+ Configs:
 - None

## Database Link Remover
###### Filename: *remove-links.js*

#### Description
Simple script which suppresses the feature that turns chat keywords into links. These links are useful for new players but mostly just clutter in chat for experienced players.
Note: This purely client side so will only suppressed the links being created for the player with the script.

#### IP+ Configs:
 - None

## Loot Popup Suppressor
###### Filename: *remove-loot.js*

#### Description
With the addition of the loot log, popups are no longer required to show players what they have gained. This script overrides the vanilla loot handling method with one that retains the loot logging feature while removing the popup.

#### IP+ Configs:
- None

## Sigil Randomizer
###### Filename: *sigil-randomizer.js*

#### Description
Randomly changes your chat sigil after every message.

#### IP+ Configs:
- activeNames: string
- Comma separated list of accounts to use the randomizer on.
- randomizerEnabled: boolean
- Toggle to enable/disable the randomization.

## Spider Taunt
###### Filename: *spiderTaunt.js*

#### Description
Joke script that taunts players who die to a spider in 1-life hardcore mode. This is facilitated by LuxBot which is tracking player death statistics and will send a custom message containing the current spider kill count each time there is a kill.

#### IP+ Configs:
- None

## Template
###### Filename: *template.js*

#### Description
Dev tool. This is the empty frame of an IP+ plugin containing all the on event methods handled by IP+. Additionally, it uses ``@require`` to use the [custom message handling framework extension](#customs-framework-plugin).

#### IP+ Configs:
- A blank config is present as an example.

## Armour Uncrafter
###### Filename: *uncrafter.js*

#### Description
Adds a right-click option to the needle that mass uncrafts all armour.

#### IP+ Configs:
- keepBat: boolean
- keepLizard: boolean
- keepBear: boolean
- keepReaper: boolean
- keepCroc: boolean
- Toggles for whether or not to keep a single piece of each piece of the relevant armour set.


## Chat Highlighter
###### Filename: *word-highlighting.js*

#### Description
Highlights and notifies the user if trigger words are used in chat. Can also highlight messages from specified users.

#### IP+ Configs:
- wordList: string
- Comma separated list of words to trigger the highlighting.
- ignoreWordList: string
- Comma separated words which, if present, will suppress highlighting.
- ignoreNameList: string
- Comma separated list of people to suppress highlighting from.
- soundsEnabled: boolean
- Toggle to enable/disable audio notifications.
- ignoreCase: boolean
- Toggle to enable/disable case sensitivity in trigger words.
- notificationsEnabled: boolean
- Toggle to enable/disable popup notifications.
- considerSpaces: boolean
- Toggle to enable/disable spaces in trigger words.
- activeName: string
- Account which will broadcast notifications.
- friendList: string
- Comma separated list of account names to highlight messages from.
- colourWordHighlight: colour picker
- Background colour of trigger word highlighted messages.
- colourFriendHighlight: colour picker
- Background colour of messages highlighted for the username.
