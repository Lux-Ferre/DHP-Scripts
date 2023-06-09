// ==UserScript==
// @name         IdlePixel Custom Interactor
// @namespace    lbtechnology.info
// @version      1.4.0
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
                        default: 10
                    },
                    {
                        id:"ignoreModMod",
                        label: "Do not print ModMod messages in pseudo-console.",
                        type: "boolean",
                        default: "false"
                    }
                ]
            });
            this.previous = "";
        }

        createPanel(){
            IdlePixelPlus.addPanel("interactor", "Custom Message Interactor", function() {
                let content = `<div>`
                    content += `<br/>`
                    content += `<form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.custominteractor.sendCustom()'>`
                    content += `<label for='interactor_name_in'><p style="-webkit-text-stroke:1px cadetblue;">Recipient:&nbsp&nbsp</p></label>`
                    content += `<input type="text" id="interactor_name_in"><br/>`
                    content += `<label for='interactor_command_in'><p style="-webkit-text-stroke:1px cadetblue;">Custom Command:&nbsp&nbsp</p></label>`
                    content += `<input type="text" size="75" id="interactor_command_in"><br/><br/>`
                    content += `<input type="submit" value="Send">`
                    content += `</form>`
                    content += `<br/>`
                    content += `<br/>`
                    content += `<p><p style="-webkit-text-stroke:1px cadetblue;">Most recently received customs:</p></p>`
                    content += `<textarea id="customs_received" wrap="off" rows="10" cols="75" readonly></textarea>`
                content += `</div>`
                return content
            });
        }

        onLogin(){
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('interactor')" title="Custom Message Interactor">Custom&nbsp;&nbsp;&nbsp;</a>
            `);
            this.createPanel()
            $("#interactor_name_in").val(this.getConfig("receiver"))
        }

        onCustomMessageReceived(player, content, callbackId) {
            if (this.getConfig("ignoreModMod")){
                if (content.startsWith("MODMOD")){
                    return
                }
            }
            const output_string = `${player}: ${content}`
            console.log(output_string)
            const textOutput = $("#customs_received")
            const lines = textOutput.val().split('\n')
            lines.unshift(output_string)
            if(lines.length > this.getConfig("textareaLines")){
                lines.pop()
            }

            const newText = lines.join('\n')
            textOutput.val(newText)
        }

        sendCustom(){
            const recipient = $("#interactor_name_in").val()
            const customPrompt = $("#interactor_command_in").val()
            $("#interactor_command_in").val("")
            const content = `interactor:${customPrompt}`

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