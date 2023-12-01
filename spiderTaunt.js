// ==UserScript==
// @name         IdlePixel+ Spider Taunt
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Taunts players for dying to spider in 1L mode
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class SpiderTauntPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("spidertaunt", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

        onCustomMessageReceived(player, content, callbackId) {
            if (window.var_username !== "a spider"){return} 
            const customData = this.parseCustom(player, content, callbackId)        // Parses custom data into an object, assumes the Anwinity Standard
            if (!(customData.plugin === "spiderTaunt" || customData.anwinFormatted)){      // Checks if custom is formatted in the correct way, and from the correct plugin
                return
            }
            if (customData.player === "luxbot"){      // Checks if custom is received from the correct player
                if (customData.command === "spiderKill"){     // Runs relevant command code, replace with switch statment if using many commands
                    const reply_string = `That was number ${customData.payload}! Are you noobs even trying‽ >::::3`
                    IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);
                }
            }
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

    const plugin = new SpiderTauntPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
