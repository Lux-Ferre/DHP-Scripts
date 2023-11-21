// ==UserScript==
// @name         IdlePixel Kaat Client
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Kaat account interaction panel
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class KaatClientPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("kaat-client", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
        }

        onLogin() {
                this.kaatData = {
                    hunger: 0,
                    tiredness: 0,
                    playfullness: 0
                }
                this.createPanel()
    
                const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
                    onlineCount.before(`
                        <a href="#" class="hover float-end link-no-decoration"
                        onclick="event.preventDefault(); IdlePixelPlus.setPanel('kaat-client')"
                        title="Nya~">Nya~&nbsp;&nbsp;&nbsp;</a>
                    `);
        }
        
        onChat(data) { }
        onCustomMessageReceived(player, content, callbackId) {
            const customData = this.parseCustom(player, content, callbackId)
            if (!(customData.plugin === "kaatpet" || customData.anwinFormatted)){
                return
            }
            if (customData.player === "axe"){
                if (customData.command === "kaatData"){
                    this.refreshKaatStats(customData.payload)
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
    
        createPanel(){
            IdlePixelPlus.addPanel("kaat-client", "Nya~", function() {
                const content = `
                        <div>
                            <div>
                                <label for="mood">Mood</label>
                                <progress id="mood" value="0" max="100"></progress>
                                <br><br>
                                <label for="hunger">Hunger</label>
                                <progress id="hunger" value="0" max="100"></progress>
                                <br>
                                <label for="tired">Tiredness</label>
                                <progress id="tired" value="0" max="100"></progress>
                                <br>
                                <label for="playful">Playfulness</label>
                                <progress id="playful" value="0" max="100"></progress>
                            </div>
                            <div>
                                <button type="button" onclick="IdlePixelPlus.plugins['kaat-client'].acquireKaatStats()">Refresh</button>
                            </div>
                        </div>
                    `
                    return content
                });
        }
    
        acquireKaatStats(){
            const kaatAccount = "axe"
            const command = "kaatDataRequest"
            const data = "None"
            this.sendCustom(kaatAccount, command, data)
        }
    
        refreshKaatStats(rawData){
            const data = JSON.parse(rawData)
            
            const hunger = data.hunger
            const tired = data.tiredness
            const playfull = data.playfullness
            
            const avg = (hunger + tired + playfull) / 3
            
            $("#hunger").val(hunger)
            $("#tired").val(tired)
            $("#playful").val(playfull)
            $("#mood").val(avg)
            
        }
                
        sendCustom(recipient, command, data){
            const pluginValue = "kaatpet"
            
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
    
}

    

    const plugin = new KaatClientPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();