// ==UserScript==
// @name         IdlePixel+ Plugin Template
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Blank plugin with all IP+ methods, and custom message handling
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class TemplatePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("template", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "template",
                        label: "template",
                        type: "string",
                        max: 2000,
                        default: ""
                    }
                ]
            });
            this.previous = "";
        }

        onConfigsChanged() { }
        onLogin() { }
        onMessageReceived(data) { }
        onVariableSet(key, valueBefore, valueAfter) { }
        onChat(data) { }
        onPanelChanged(panelBefore, panelAfter) { }
        onCombatStart() { }
        onCombatEnd() { }
        onCustomMessagePlayerOffline(player, content) { }
        onCustomMessageReceived(player, content, callbackId) {
            const customData = this.parseCustom(player, content, callbackId)        // Parses custom data into an object, assumes the Anwinity Standard
            if (!(customData.plugin === "--template--" || customData.anwinFormatted)){      // Checks if custom is formatted in the correct way, and from the correct plugin
                return
            }
            if (customData.player === "--template--"){      // Checks if custom is received from the correct player
                if (customData.command === "--template--"){     // Runs relevant command code, replace with switch statment if using many commands
                    console.log(customData.payload)
                }
            }
        }
    
         sendCustom(){
            const recipient = ""
            const pluginValue = ""
            const command = ""
            const data = ""

            const content = `${pluginValue}:${command}:${data}`

            const payload = {
                content: content,
                onResponse: function(player, content, callbackId) {
                        return true;
                },
                onOffline: function(player, content) {
                        console.log(content)
                },
                timeout: 2000 // callback expires after 2 seconds
            }

            IdlePixelPlus.sendCustomMessage(recipient, payload)
        }

        parseCustom(player, content, callbackId){
            const customData = {
                player: player,
                callbackId: callbackId,
                anwinFormatted: false
            }
            const splitPayload = content.split(":")
            if(splitPayload.length >= 3){
                customData.anwinFormatted = true
                customData.plugin = splitPayload[0]
                customData.command = splitPayload[1]
                customData.payload = splitPayload.slice(2).join(":")
            } else {
                customData.anwinFormatted = false
                customData.plugin = "unknown"
                customData.command = "unknown"
                customData.payload = content
            }

            return customData
        }

    }

    const plugin = new TemplatePlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
