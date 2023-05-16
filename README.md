# Idle-Pixel Scripts

This repo holds all my public scripts for [Idle-Pixel](https://idle-pixel.com/).
To use them, install them into a script handling tool like Tampermonkey.
You should probably install them via [Greasy Fork](https://greasyfork.org/en/users/1030473-lux-ferre) which makes it a lot easier.


## Easter 2023 Tracker

This script adds a panel for tracking which eggs you have crafted for the Easter 2023 event, making it easier to know which you have left to try. Additionally, it has audio and popup notifications for the bunny used to trigger the event so you don't miss it while looking at another tab/window.

#### Configs:
 - None

## Sigil Randomizer

Randomly changes your chat sigil after every message.

#### Configs:
 - Enabled: Boolean
 - Active account list: Comma separated string

## Chat Highlighter

Highlights chat messages based on the user sending the message and/or a list of trigger words.

#### Configs:
 - Trigger words: Comma separated string
 - Ignore words: Comma separated string
 - Sounds enabled: Boolean
 - Case sensitivity: Boolean
 - Popups enabled: Boolean
 - Allow spaces: Boolean
 - Notification username: String
 - Username highlighting: Comma separated string
 - Word highlight colour: Colour picker
 - Username highlighting colour: Colour picker

## Armour Uncrafter

Adds a right-click option to your needle that mass uncrafts all armour.

#### Configs:
 - Keep one set of bat: Boolean
 - Keep one set of lizard: Boolean
 - Keep one set of bear: Boolean
 - Keep one set of reaper: Boolean
 - Keep one set of croc: Boolean

## Custom Interactor

Dev tool for using the game's custom network messages. Adds a panel (linked at top of page) that allows the player to send customs to other accounts and displays received customs in a pseudo-console on the panel. Custom messages are prepended with "interactor:" following the standard format for Idle-Pixel Plus custom messages.

#### Configs:
 - Default recipient: String
 - Pseudo-console line count: Integer

## Config Backup

Provides a panel based UI giving access to the Idle-Pixel Plus plugin configs. Dynamically generates text boxes for each plugin that will be populated by the localstorage config data, allowing them to easily be copied out. Additionally, adds a restore feature that will take the config data and reapply it.

My Greasy Fork page (linked above) contains a pastebin copy of my UI Tweaks config for a quick dark theme.

#### Configs:
 - None

## ModMod Fork

My fork of Anwinity's ModMod moderation tool.

#### Additional features added by the fork:
 - Updated to interact with [LuxBot](https://github.com/Lux-Ferre/IdlePixel-Bot)
 - Custom panel added to house the modchat and online mod list
