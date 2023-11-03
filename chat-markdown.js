// ==UserScript==
// @name         IdlePixel Chat Markdown
// @namespace    lbtechnology.info
// @version      1.1.0
// @description  Adds support for some markdown into chat
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class MarkdownPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("markdown", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
        }

        onChat(data){
            const newMessage = this.parseMarkdown(data)
            if (data.modified){
                const element = $("#chat-area > *").last();
                while (element[0].lastChild.nodeName !== "SPAN"){
                    element[0].removeChild(element[0].lastChild)
                }
                element.append(newMessage.message)
            }
        }
    
        onLogin(){
            $("#game-chat .m-2 .m-2 button:not(.btn-chat-configure)").attr("onClick", "IdlePixelPlus.plugins.markdown.correctTildeSend()")
        }
    
        parseMarkdown(data){
            data.modified = false
            let message = data.message
            message = message.replace(/⁓/g, '~')
            const markdownPairs = {
                "``": ["``", "<code>", "</code>"],
                "**": ["\\*\\*", "<strong>", "</strong>"]
            }

            for (const [markdown, html] of Object.entries(markdownPairs)){
                const re = new RegExp(html[0],"g");
                const tickCount = (message.match(re) || []).length;
                if (tickCount>1){
                    data.modified = true
                    const backtickPairs = Math.floor(tickCount / 2)
                    for (let i=0; i<=backtickPairs; i++){
                        message = message.replace(markdown, html[1])
                        message = message.replace(markdown, html[2])
                    }
                }
            }

            data.message = message
            return data
        }
    
        correctTildeSend(){
            document.getElementById("chat-area-input").value = document.getElementById("chat-area-input").value.replace(/~/g, '⁓');
            Chat.send()
        }
    }
    
    const plugin = new MarkdownPlugin();
        IdlePixelPlus.registerPlugin(plugin);
    
})(); 