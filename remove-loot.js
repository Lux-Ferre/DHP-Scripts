// ==UserScript==
// @name         IdlePixel Loot Popup Remover
// @namespace    lbtechnology.info
// @version      1.0.1
// @description  Stops vanilla loot popups, leaving only loot log
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class NoLootPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("noloot", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
        }

    onLogin(){
            Modals.open_loot_dialogue = (loot_images_array, loot_labels_array, loot_background_color_array, extra_data) => {
                var logger = []
                for(var i = 0; i < loot_images_array.length; i++){
                    var image = loot_images_array[i];
                    var label = loot_labels_array[i];
                    var background_color = loot_background_color_array[i];

                    logger.push({
                        'image': image,
                        'label': label,
                        'color': background_color,
                    })
                }

                try {
                    var logObj = new LogManager()
                    logObj.add_entry('monster_drop', logger);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    const plugin = new NoLootPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();