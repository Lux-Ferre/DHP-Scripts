
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
[Details](markdown/all_the_gems.md)

#### Description
Adds a right click option to gem goblin bags to open all of them at once. Loot from each bag will be collated into a single loot popup.


## Custom Interactor
[Details](markdown/custom_interactor.md)

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


## Chat History
[Details](markdown/chat_history.md)

#### Description
On login, this script sends a request to LuxBot requesting the most recent messages from chat and displays them, allowing players to see what was said before they logged in. The current number of messages LuxBot will return is 5.


## Chat Markdown
[Details](markdown/chat_markdown.md)

#### Description
This chat modification script adds some minor support for markdown. At present, it adds support for codeblocks with double backtick  \`\`code block\`\` ; and bold text with double asterisk \*\*bold text \*\*.

Note: These are implemented using ``<code>`` and ``<strong>`` HTML elements so will display differently in different browsers.


## Clammy Vock
[Details](markdown/clammy_vock.md)

#### Description
A script which replaces the word "Clammy" with a random 2-part nickname starting with "C" and rhyming with "Rock" in your chat messages when you click "Send". This is a joke based on how often CammyRock's username is misspelled.


## Customs Framework Plugin
[Details](markdown/customs_ipp_library.md)

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


## Easter 2023 Tracker
[Details](markdown/easter_2023.md)

#### Description
This script adds a panel for tracking which eggs you have crafted for the Easter 2023 event, making it easier to know which you have left to try. Additionally, it has audio and popup notifications for the bunny used to trigger the event so you don't miss it while looking at another tab/window.


## Config Backup
[Details](markdown/ipp_config_backup.md)

#### Description
Provides a panel based UI giving access to the Idle-Pixel Plus plugin configs. Dynamically generates text boxes for each plugin that will be populated by the localstorage config data, allowing them to easily be copied out. Additionally, adds a restore feature that will take the config data and reapply it.

The Greasy Fork page contains a table of UI-Tweaks themes including pastebin links with to apply them via this script.


## Kaat Client
[Details](markdown/kaat_client.md)

#### Description
Companion script for Kaat Host. All features of this script are accessible via a fully responsive panel. There are two main parts, one that is available to all players, and one that is only available when running alongside the host.

The main part provides realtime visuals on the state of the pet with progress bars showing its 4 stats.

The hidden part allows the host to update the pet's configs.


## Kaat Host
[Details](markdown/kaat_host.md)

#### Description
Created for Kaat to run on her ᓚᘏᗢ account.
Tamagotchi style community game. It has 3 primary stats and 1 secondary stat which lower over time and can be raised by the community via chat commands.
Most values and reply strings are stored in localstorage to be edited via the Kaat Client companion script.


## Websocket Message Sender
#### Description
A simple UI wrapper for sending websocket messages.


## ModMod Fork
[Details](markdown/modmod.md)

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


## Bait Thrower
[Details](markdown/multi_bait_thrower.md)

#### Description
Replaces the vanilla popup for using bait with one that allows throwing multiples. All the loot from the batch is collated into a single popup.


## No More No Arrows
[Details](markdown/no_more_no_arrows.md)

#### Description
Simple script that suppresses the toast alerting the player that they are attempting to use a bow with no arrows.


## Notes Panel
[Details](markdown/notes_panel.md)

#### Description
Adds a panel for keeping notes. Notes are saved in localStorage


## Overview
[Details](markdown/overview.md)

#### Description
Adds a new panel containing most game functions in one place. Panel is fully responsive (via Bootstrap) and modular, with the number of panels per row customizable by the player.


## Pinger
[Details](markdown/pinger.md)

#### Description
Joke script that adds a chat command ``/ping <player>``.
The player is then given an alert that they have been pinged.


## Database Link Remover
[Details](markdown/remove_links.md)

#### Description
Simple script which suppresses the feature that turns chat keywords into links. These links are useful for new players but mostly just clutter in chat for experienced players.
Note: This purely client side so will only suppressed the links being created for the player with the script.


## Loot Popup Suppressor
[Details](markdown/remove_loot.md)

#### Description
With the addition of the loot log, popups are no longer required to show players what they have gained. This script overrides the vanilla loot handling method with one that retains the loot logging feature while removing the popup.


## Sigil Randomizer
[Details](markdown/sigil_randomizer.md)

#### Description
Randomly changes your chat sigil after every message.


## Spider Taunt
[Details](markdown/spider_taunt.md)

#### Description
Joke script that taunts players who die to a spider in 1-life hardcore mode. This is facilitated by LuxBot which is tracking player death statistics and will send a custom message containing the current spider kill count each time there is a kill.


## Template
[Details](markdown/template.md)

#### Description
Dev tool. This is the empty frame of an IP+ plugin containing all the on event methods handled by IP+. Additionally, it uses ``@require`` to use the [custom message handling framework extension](#customs-framework-plugin).


## Armour Uncrafter
[Details](markdown/uncrafter.md)

#### Description
Adds a right-click option to the needle that mass uncrafts all armour.


## Chat Highlighter
[Details](markdown/chat_highlighter.md)

#### Description
Highlights and notifies the user if trigger words are used in chat. Can also highlight messages from specified users.
