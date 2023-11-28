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
                        id: "kaatAccount",
                        label: "Account name to run the v-pet on.",
                        type: "string",
                        max: 20,
                        default: ""
                    },
                    {
                        id: "blacklist",
                        label: "List of accounts that can't interact with the v-pet.",
                        type: "string",
                        max: 2000,
                        default: ""
                    },
                ]
            });
            this.previous = "";
        }

        onLogin() {
            if (window.var_username !== this.getConfig("kaatAccount")){return}
            const storedKaatData = localStorage.getItem("kaatData")
            const storedKaatConfigs = localStorage.getItem("kaatConfigs")
            const storedReplyStrings = localStorage.getItem("kaatReplies")

            if (storedKaatData){
                this.kaatData = JSON.parse(storedKaatData)
            } else {
                this.resetKaatData()
            }
            
            if (storedReplyStrings){
                this.replyStrings = JSON.parse(storedReplyStrings)
            } else {
                this.resetReplyStrings()
            }
            
            if (storedKaatConfigs){
                this.configValues = JSON.parse(storedKaatConfigs)
            } else {
                this.resetConfigValues()
            }

            this.resetTimerData()

            if(this.kaatData.alive){
                this.restartGameLoop()
            }

            this.onlinePlayers = new Set()
        }
        
        onChat(data) {
            if (window.var_username !== this.getConfig("kaatAccount")){return}
            if (window.var_username === data.username){return}
            if ((this.getConfig("blacklist").includes(data.username))){return}
            if (!this.kaatData.alive){return}

            if(data.message.startsWith("!kaat")){
                let currentTime = Date.now()
                if (currentTime <= this.timerData.commandCooldown){return}
                const originalCooldown = this.timerData.commandCooldown
                this.timerData.commandCooldown = currentTime + this.configValues.cooldownLength.value

                if (this.kaatData.sleeping){
                    IdlePixelPlus.sendMessage(`CHAT= ${this.replyStrings.isSleeping}`);
                    return
                }

                const command = data.message.split(" ")[1]
                switch(command){
                    case "feed":
                        this.feedKaat()
                        break;
                    case "sleep":
                        this.sleepKaat()
                        break;
                    case "play":
                        this.playKaat()
                        break;
                    case "pet":
                        this.petKaat()
                        break;
                    case "status":
                        this.getStatus()
                        break;
                    default:
                        this.timerData.commandCooldown = originalCooldown
                        break;
                }
                this.saveKaatData(this.kaatData)
            }
        }

        onCustomMessageReceived(player, content, callbackId) {
            if (window.var_username !== this.getConfig("kaatAccount")){return}
            const customData = this.parseCustom(player, content, callbackId)
            if (!(customData.plugin === "kaatpet" || customData.anwinFormatted)){
                return
            }
            if (customData.command === "kaatDataRequest"){
                this.sendData(customData.player)
            }
            this.onlinePlayers.add(player)
        }

        onCustomMessagePlayerOffline(fromPlayer, content){
            this.onlinePlayers.delete(fromPlayer)
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
                alive: true,
                sleeping: false,
                hunger: 50,
                tiredness: 50,
                social: 50,
                energy: 50
            }
            this.saveKaatData(this.kaatData)
        }
    
        saveKaatData(data){
            const dataString = JSON.stringify(data)
            localStorage.setItem("kaatData", dataString)
            this.onlinePlayers.forEach((player) => {
                this.sendData(player)
            })
        }

        resetReplyStrings(){
            this.replyStrings = {
                notHungry: "ᓚᘏᗢ is not hungry! >.<",
                beenFed: "ᓚᘏᗢ has been fed!",
                stillHungry: "She is still hungry! >.<",
                wellFed: "She is well fed! :3",

                wakeUp: "ᓚᘏᗢ yawn⁓",
                notTired: "ᓚᘏᗢ is not tired! >.<",
                startSleep: "ᓚᘏᗢ has gone for a nap!",
                isSleeping: "Shhh. ᓚᘏᗢ is asleep.",

                noPlay: "ᓚᘏᗢ does not want to play! >.<",
                noEnergyForPlay: "ᓚᘏᗢ doesn't have enough energy to play! >.<",
                hadPlay: "You played with ᓚᘏᗢ!",
                donePlay: "She has had a lot of fun! :3",
                morePlay: "She wants to play more! >.<",
                noPets: "ᓚᘏᗢ does not want your pets right now! >.<",
                hadPets: "ᓚᘏᗢ ⁓nya! :3",

                starving: "ᓚᘏᗢ is starving! >.<",
                hungry: "ᓚᘏᗢ is hungry.",

                exhausted: "ᓚᘏᗢ is exhausted! >.<",
                sleepy: "ᓚᘏᗢ is eepy.",

                lonely: "ᓚᘏᗢ is lonely! >.<",
                needsAttention: "ᓚᘏᗢ wants some attention.",

                feelGreat: "ᓚᘏᗢ is feeling great! =^.^=",
                feelOkay: "ᓚᘏᗢ is feeling okay. :3",

                hasDied: "X.X You didn't look after the poor ᓚᘏᗢ well enough!",
            }

            const dataString = JSON.stringify(this.replyStrings)
            localStorage.setItem("kaatReplies", dataString)
        }

        resetConfigValues(){
            this.configValues = {
                tickLength: {
                    value: 36000,
                    element: "tickLengthInput"
                },
                cooldownLength: {
                    value: 60000,
                    element: "cooldownLengthInput"
                },
                feedHungerDif: {
                    value: 50,
                    element: "feedHungerSlider"
                },
                playEnergyDif: {
                    value: 50,
                    element: "playEnergySlider"
                },
                playSocialDif: {
                    value: 50,
                    element: "playSocialSlider"
                },
                petSocialDif: {
                    value: 5,
                    element: "petSocialSlider"
                },
            }

            const dataString = JSON.stringify(this.configValues)
            localStorage.setItem("kaatConfigs", dataString)
        }

        resetTimerData(){
            this.timerData = {
                commandCooldown: 0
            }
            this.saveTimerData(this.timerData)
        }

        saveTimerData(data){
            const dataString = JSON.stringify(data)
            localStorage.setItem("kaatTimers", dataString)
        }

        updateDataPoint(point, change){
            if (point in this.kaatData){
                this.kaatData[point] += change
            } else {
                this.kaatData[point] = change
            }
            if (this.kaatData[point] > 100){
                this.kaatData[point] = 100
            } else if (this.kaatData[point] < 0) {
                this.kaatData[point] = 0
            }
        }
    
        processGameTick(){
            this.updateDataPoint("hunger", 1)
            if (this.kaatData.sleeping){
                this.updateDataPoint("tiredness", -3)
                if (this.kaatData.tiredness <= 0){
                    this.kaatData.sleeping = false
                    IdlePixelPlus.sendMessage(`CHAT= ${this.replyStrings.wakeUp}`);
                }
            } else {
                this.updateDataPoint("tiredness", 1)
            }

            this.updateDataPoint("social", -1)
            if (this.kaatData.hunger <= 50 && this.kaatData.tiredness <= 50){
                this.updateDataPoint("energy", 1)
            }
            
            if (this.isDead()){
                this.kaatData.alive = false
                IdlePixelPlus.sendMessage(`CHAT= ${this.replyStrings.hasDied}`);
                clearInterval(this.gameLoop)
            }
            this.saveKaatData(this.kaatData)
        }

        restartGameLoop(){
            const tickInterval = this.configValues.tickLength.value

            if (this.gameLoop){
                clearInterval(this.gameLoop)
            }

            this.gameLoop = setInterval(this.processGameTick.bind(this), tickInterval)
        }

        isDead(){
            const starving = this.kaatData.hunger >= 100
            const exhausted = this.kaatData.tiredness >= 100
            const lonely = this.kaatData.social <= 0

            return (starving && exhausted && lonely)
        }

        feedKaat(){
            let reply_string
            if (this.kaatData.hunger <=10){
                reply_string = this.replyStrings.notHungry
            } else {
                this.updateDataPoint("hunger", -this.configValues.feedHungerDif.value)
                let reply_extra
                if (this.kaatData.hunger <= 25){
                    reply_extra = this.replyStrings.wellFed
                } else {
                    reply_extra = this.replyStrings.stillHungry
                }
                reply_string = this.replyStrings.beenFed + " " + reply_extra
            }
            IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);
        }

        sleepKaat(){
            let reply_string
            if (this.kaatData.tiredness <=25){
                reply_string = this.replyStrings.notTired
            } else {
                this.kaatData.sleeping = true
                reply_string = this.replyStrings.startSleep
            }
            IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);
        }

        playKaat(){
            let reply_string
            if (this.kaatData.social >= 90){
                reply_string = this.replyStrings.noPlay
            } else if (this.kaatData.energy <= 50){
                reply_string = this.replyStrings.noEnergyForPlay
            }else {
                this.updateDataPoint("social", this.configValues.playSocialDif.value)
                this.updateDataPoint("energy", -this.configValues.playEnergyDif.value)
                let reply_extra
                if (this.kaatData.social >= 75){
                    reply_extra = this.replyStrings.donePlay
                } else {
                    reply_extra = this.replyStrings.morePlay
                }
                reply_string = this.replyStrings.hadPlay + " " + reply_extra
            }
            IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);
        }

        petKaat(){
            let reply_string
            if (this.kaatData.social > 90){
                reply_string = this.replyStrings.noPets
            } else {
                this.updateDataPoint("social", this.configValues.petSocialDif.value)
                reply_string = this.replyStrings.hadPets
            }
            IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);
        }

        getStatus(){
            const hunger = this.kaatData.hunger
            const tiredness = this.kaatData.tiredness
            const social = this.kaatData.social

            let reply_string = ""

            if (!this.kaatData.alive){reply_string=this.replyStrings.hasDied}
            else if (hunger >= 90){reply_string=this.replyStrings.starving}
            else if (tiredness >= 90){reply_string=this.replyStrings.exhausted}
            else if (social <= 10){reply_string=this.replyStrings.lonely}
            else if (hunger >= 50){reply_string=this.replyStrings.hungry}
            else if (tiredness >= 50){reply_string=this.replyStrings.sleepy}
            else if (social <= 50){reply_string=this.replyStrings.needsAttention}
            else if (hunger <=20 && tiredness <= 20 && social >= 90){reply_string=this.replyStrings.feelGreat}
            else {reply_string=this.replyStrings.feelOkay}

            IdlePixelPlus.sendMessage(`CHAT= ${reply_string}`);

            /*
            let reply_string = ""

            if (hunger >= 90){
                reply_string += "ᓚᘏᗢ is starving"
            } else if (hunger >= 50){
                reply_string += "ᓚᘏᗢ is a little hungry"
            }else {
                reply_string += "ᓚᘏᗢ is well fed"
            }

            if (tiredness >= 90){
                reply_string += ", is exhausted"
            } else if (tiredness >= 50){
                reply_string += ", is a little sleepy"
            }else {
                reply_string += ", is well rested"
            }

            if (social <= 10){
                reply_string += ", and is lonely!"
            } else if (social < 50){
                reply_string += ", and wants some attention!"
            }else {
                reply_string += ", and has had lots of attention!"
            }
            */
        }

        revive(){
            this.resetKaatData()
            this.resetTimerData()
            this.restartGameLoop()
        }

}

    

    const plugin = new KaatHostPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
