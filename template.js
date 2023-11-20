// ==UserScript==
// @name         IdlePixel+ Plugin Template
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Blank plugin with empty methods 
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
        onCustomMessageReceived(player, content, callbackId) { }
        onCustomMessagePlayerOffline(player, content) { }
    
    }

    const plugin = new TemplatePlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
