// ==UserScript==
// @name         IdlePixel Kaat Host
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Kaat Virtual Pet
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class KaatHostPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("kaat-host", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "gameTick",
                        label: "Tick length (milliseconds)",
                        type: "integer",
                        min: 1000,
                        max: 60000,
                        default: 10000
                    }                    
                ]
            });
            this.previous = "";
        }

        onLogin() {
            const storedData = localStorage.getItem("kaatData")
            
            if (storedData){
                this.kaatData = JSON.parse(storedData)
            } else {
                this.resetKaatData()
            }
            
            const tickInterval = this.getConfig("gameTick")
            
            var gameTick = setInterval(this.processGameTick.bind(this), tickInterval)
                
        }
        
        onChat(data) {
            if(data.message.startsWith("!kaat")){
                const command = data.message.split(" ")[1]
                switch(command){
                    case "feed":
                        this.updateDataPoint("hunger", 50)
                        break;
                    case "sleep":
                        this.updateDataPoint("tiredness", 50)
                        break;
                    case "play":
                        this.updateDataPoint("playfullness", 50)
                        break;
                }
                this.saveKaatData(this.kaatData)
                console.log(this.kaatData)
            }
        }
        onCustomMessageReceived(player, content, callbackId) {
            const customData = this.parseCustom(player, content, callbackId)
            if (!(customData.plugin === "kaatpet" || customData.anwinFormatted)){
                return
            }
            if (customData.command === "kaatDataRequest"){
                this.sendData(customData.player)
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
    
        sendData(player){
            const command = "kaatData"
            const payload = JSON.stringify(this.kaatData)
            
            this.sendCustom(player, command, payload)
        }
    
        resetKaatData(){
            this.kaatData = {
                hunger: 50,
                tiredness: 50,
                playfullness: 50
            }
            this.saveKaatData(this.kaatData)
        }
    
        saveKaatData(data){
            const dataString = JSON.stringify(data)
            localStorage.setItem("kaatData", dataString)
        }
    
        updateDataPoint(point, change){
            this.kaatData[point] += change
            if (this.kaatData[point] > 100){
                this.kaatData[point] = 100
            } else if (this.kaatData[point] < 0) {
                this.kaatData[point] = 0
            }
        }
    
        processGameTick(){
            this.updateDataPoint("hunger", -1)
            this.updateDataPoint("tiredness", -1)
            this.updateDataPoint("playfullness", -1)
            
            this.saveKaatData(this.kaatData)
            if (this.kaatData.playfullness <= 0){
                console.log("X.X")
            }
        }
    
}

    

    const plugin = new KaatHostPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
