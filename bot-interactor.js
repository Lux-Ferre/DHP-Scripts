// ==UserScript==
// @name         IdlePixel Custom Interactor
// @namespace    lbtechnology.info
// @version      1.8.0
// @description  Sends custom messages to an account and logs received customs
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==
 
(function() {
    'use strict';
  
    class CustomInteractorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("custominteractor", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "receiver",
                        label: "Default account to send custom messages to.",
                        type: "string",
                        max: 20,
                        default: ""
                    },
                    {
                        id: "textareaLines",
                        label: "Number of lines to display on custom panel.",
                        type: "integer",
                        min: 1,
                        max: 30,
                        default: 0
                    },
                    {
                        id: "ignorePluginList",
                        label: "List of plugins to ignore customs from (comma separated.)",
                        type: "string",
                        max: 2000,
                        default: ""
                    },
                    {
                        id: "pluginOverride",
                        label: "Overrides the plugin value in the custom message.",
                        type: "string",
                        max: 20,
                        default: ""
                    }
                ]
            });
            this.previous = "";
        }

        createPanel(){
            const maxRowNumber = this.getConfig("textareaLines")
            let rowNumber = maxRowNumber
            if (maxRowNumber >= 30 || maxRowNumber === 0){
                rowNumber = 30
            }

            IdlePixelPlus.addPanel("interactor", "Custom Message Interactor", function() {
                const content = `
                    <div>
                        <div class="d-flex">
                            <div class="me-auto">
                                <label for='interactor_recipient' class="interactor-label">Recipient:&nbsp&nbsp</label>
                                <input type="text" id="interactor_recipient">
                            </div>
                            <div class="">
                                <label for='interactor_plugin_overrride' class="interactor-label">Plugin Override:&nbsp&nbsp</label>
                                <input type="text" id="interactor_plugin_overrride">
                            </div>
                        </div>
                        <div class="d-flex">
                            <textarea id="customs_received" wrap="soft" class="w-100" rows="${rowNumber}" readonly>${'\n'.repeat(rowNumber)}</textarea>
                        </div>
                        <form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.custominteractor.sendCustom()'>
                            <datalist id="commandList"></datalist>
                            <div class="d-flex flex-fill">
                                <div class="col-3">
                                    <input type="text" class="w-100" list="commandList" id="interactor_command_in" placeholder="command">
                                </div>
                                <div class="col-8">
                                    <input type="text" class="w-100" id="interactor_payload_in" placeholder="payload">
                                </div>
                                <div class="col-1">
                                    <input type="submit" class="w-100" value="Send">
                                </div>
                            </div>
                        </form>
                    </div>
                `
                return content
            });
        }

        onLogin(){
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('interactor')" title="Custom Message Interactor">Custom&nbsp;&nbsp;&nbsp;</a>
            `);
            this.createPanel()
            this.setConfigValuesToUI()

            if ("ui-tweaks" in IdlePixelPlus.plugins){
                this.applyTheme("UIT")
            } else {
                this.applyTheme("default")
            }
        }

        onConfigsChanged(){
            this.setConfigValuesToUI()
        }

        onCustomMessageReceived(player, content, callbackId) {
            const customData = this.parseCustom(player, content, callbackId)

            const rawIgnoreList = this.getConfig("ignorePluginList").toLowerCase()
            const ignoreList = rawIgnoreList.split(',');
            if (ignoreList[0] === ""){ignoreList.shift()}

            if (ignoreList.includes(customData.plugin.toLowerCase())){
                return
            }

            const output_string = `${player}: ${customData.plugin}: ${customData.command}: ${customData.payload}`
            
            console.log(output_string)
            
            this.addToPseudoConsole(output_string)
        }

        setConfigValuesToUI(){
            $("#interactor_recipient").val(this.getConfig("receiver"))
            $("#interactor_plugin_overrride").val(this.getConfig("pluginOverride"))

            const maxRows = this.getConfig("textareaLines")
            const textOutput = $("#customs_received")

            if (maxRows >=30 || maxRows === 0){
                textOutput.attr("rows", 30)
            } else {
                textOutput.attr("rows", maxRows)
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
    
        addToPseudoConsole(output_string){
            const textOutput = $("#customs_received")
            const lines = textOutput.val().split('\n')
            const maxLines = this.getConfig("textareaLines")
            lines.push(output_string)
            if(lines.length > maxLines && maxLines !== 0){
                lines.shift()
            }
            if (lines[0] === "" && lines.length > 30){
                lines.shift()
            }

            const newText = lines.join('\n')
            textOutput.val(newText)
            textOutput.scrollTop(textOutput[0].scrollHeight);
        }
    
        applyTheme(theme){
            let backgroundColour = "#ffffff"
            let textColour = "#000000"
            let labelColour = "#000000"
            if (theme==="UIT"){
                backgroundColour = IdlePixelPlus.plugins["ui-tweaks"].config["color-chat-area"]
                textColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-chat-area"]
                labelColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-panels"]
            }

            $(".interactor-label").css({"color": labelColour})
            $("#customs_received").css({"color": textColour, "background-color": backgroundColour})
        }

        sendCustom(){
            const recipient = $("#interactor_recipient").val()

            const commandjQuery = $("#interactor_command_in")
            const command = commandjQuery.val()
            commandjQuery.val("")

            const datajQuery = $("#interactor_payload_in")
            const data = datajQuery.val()
            datajQuery.val("")

            let content = ""

            if (data !== ""){
                content = `interactor:${command}:${data}`
            } else {
                content = `interactor:${command}`
            }

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
 
    const plugin = new CustomInteractorPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 