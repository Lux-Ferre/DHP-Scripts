// ==UserScript==
// @name         IdlePixel ModMod (Lux-Ferre Fork)
// @namespace    lbtechnology.info
// @version      1.1.0
// @description  DHP Mod for Mods. ModMod. ModModMod. Mod.
// @author       Anwinity & Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==
 
(function() {
    'use strict';
 
    const botUsername = "luxbot";
 
    /*
    const mouse = {x:0, y:0};
 
    document.addEventListener("mousemove", event => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });
    */
 
    class ModModPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("ModMod", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "bot",
                        label: "Bot Username (only change for testing)",
                        type: "string",
                        default: "luxbot"
                    },
                    {
                        id: "suppressLoginMessages",
                        label: "Suppress Login/Logout Messages",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "For Market Spy",
                        type: "label"
                    },
                    {
                        label: "Requires Market Overall 1.0.16 or later",
                        type: "label"
                    },
                    {
                        label: "if you change these it requires a refresh",
                        type: "label"
                    },
                    {
                        id: "modstuffPlayerIDURL",
                        label: "players.csv url",
                        type: "string",
                        default: "https://data.idle-pixel.com/modstuff/players.csv"
                    },
                    {
                        id: "modstuffUsername",
                        label: "modstuff user",
                        type: "string"
                    },
                    {
                        id: "modstuffPassword",
                        label: "modstuff pass",
                        type: "string"
                    },
                    {
                        id: "textareaLines",
                        label: "Number of lines to display on custom panel.",
                        type: "integer",
                        min: 1,
                        max: 300,
                        default: 100
                    }
                ]
            });
            this.playerMap = {};
        }
 
        createPanel(){
            IdlePixelPlus.addPanel("modmod", "ModMod Panel", function() {
                let content = `<div>`
                    content += `<br/>`
                    content += `<span id="modmod-top-bar" class="float-end link-no-decoration" onclick="event.preventDefault();" title="ModMod Bot Status">MM:<span id="modmod-status">Unknown</span>&nbsp;&nbsp;&nbsp;</span>`
                    content += `<textarea id="mod_list" wrap="off" rows="1" style="width:80%" readonly></textarea>`
                    content += `<form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.ModMod.sendModChat()'>`
                    content += `<div style="width: 100%">`
                    content += `<label for='modchat_in'><p style="-webkit-text-stroke:1px cadetblue; display: inline;">Mod Chat:&nbsp&nbsp </p></label>`
                    content += `<input type="text" id="modchat_in" style="display: inline;" size="50"><br/><br/>`
                    content += `</div>`
                    content += `<input type="submit" value="Send">`
                    content += `</form>`
                    content += `<br/>`
                    content += `<br/>`
                    content += `<p><p style="-webkit-text-stroke:1px cadetblue;">Mod Chatroom:</p></p>`
                    content += `<textarea id="mod_chat" wrap="off" rows="25" style="width:100%" readonly></textarea>`
                content += `</div>`
                return content
            });
        }
 
        sendModChat(){
            const bot = this.getConfig("bot")
            const modmod_message = $("#modchat_in").val()
            $("#modchat_in").val("")
            const content = `MODMOD:MODCHAT:${modmod_message}`

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
            IdlePixelPlus.sendCustomMessage(bot, payload)
        }
 
        addModModChatMessage(message) {
            if(this.getConfig("suppressLoginMessages")) {
                if(!message.includes(":")) {
                    if(message.endsWith("has logged in.") || message.endsWith("has logged out.")) {
                        return;
                    }
                }
            }
            $("#chat-area").append(`
            <div style="background-color: rgba(0, 255, 0, 0.15)">
              <span class="color-green">${Chat._get_time()}</span>
              <span class="modmod_message shadow">ModMod</span>
              <span>${sanitize_input(message)}</span>
            </div>`);
            const textOutput = $("#mod_chat")
            const lines = textOutput.val().split('\n')
            lines.unshift(`${Chat._get_time()} ${message}`)
            if(lines.length > this.getConfig("textareaLines")){
                lines.pop()
            }

            const newText = lines.join('\n')
            textOutput.val(newText)
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }
        }
 
        handleModModCommand(command, player, content, callbackId) {
            switch(command) {
                case "MSG": {
                    this.addModModChatMessage(content);
                    break;
                }
                case "LIST": {
                    if (content.startsWith("list")){
                        const onlineMods = content.slice(5).split(",")
                        onlineMods.forEach(mod=>{online_mods.add(mod)})
                    }
                    else if (content.startsWith("remove")){
                        online_mods.delete(content.slice(7))
                    }
                    else if (content.startsWith("add")){
                        online_mods.add(content.slice(4))
                    }
                    const modsDisplay = `Online Mods: ${Array.from(online_mods).join(',')}`
                    const modsDisplayBox = $("#mod_list")
                    modsDisplayBox.val(modsDisplay)
                }
            }
        }
 
        sendHello(login) {
            const bot = this.getConfig("bot");
            IdlePixelPlus.sendCustomMessage(bot, {
                content: `MODMOD:HELLO:${login?1:0}:0`
            });
        }
 
        setBotOnlineStatus(online) {
            const el = $("#modmod-status");
            const statusBefore = el.text();
            if(online===true) {
                el.text("Online");
                el.css("color", "limegreen");
                if(statusBefore!="Online") {
                    this.addModModChatMessage("Bot Status: Online");
                }
            }
            else if(online===false) {
                el.text("Offline");
                el.css("color", "#EE4B2B");
                if(statusBefore!="Offline") {
                    this.addModModChatMessage("Bot Status: Offline");
                    setTimeout(() => this.sendHello(false), 20000);
                }
            }
            else {
                el.text("Unknown");
                el.css("color", "lightgrey");
                if(statusBefore!="Unknown") {
                    this.addModModChatMessage("Bot Status: Unknown");
                }
            }
        }
 
        onLogin() {
            const self = this;
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('modmod')" title="ModMod Panel">ModMod&nbsp;&nbsp;&nbsp;</a>
            `);
            this.createPanel()
            $("head").append(`
 
            <style id="styles-modmod">
            body {
              position: relative !important;
            }
            .modmod_message {
              color: black;
              font-weight: 500;
              background-color: limegreen;
              border: green;
              font-size: smaller;
              padding: 2px 4px;
            }
            #modmod-chat-context-menu {
              position: absolute;
              display: flex;
              flex-direction: column;
              justify-items: start;
              width: 180px;
              border: 1px solid black;
              background-color: white;
              color: black;
            }
            #modmod-chat-context-menu > .context-menu-header {
              border-bottom: 2px solid black;
              font-weight: 550;
              text-align: center;
            }
            #modmod-chat-context-menu > .context-menu-item {
              cursor: pointer;
              border-bottom: 1px solid black;
              text-align: center;
            }
            #modmod-chat-context-menu > .context-menu-item:hover {
              background-color: #ccffff;
            }
            </style>
            `);
 
            this.sendHello(true);
            setInterval(() => {
                this.sendHello(false);
            }, 1000*60*1);
 
            IdlePixelPlus.registerCustomChatCommand("modsonline", (command, message) => {
                const bot = this.getConfig("bot");
                IdlePixelPlus.sendCustomMessage(bot, {
                    content: `MODMOD:MODLIST`
                });
            }, "Get a list of mods online (who have ModMod installed).");
 
            IdlePixelPlus.registerCustomChatCommand("mods", (command, message) => {
                const bot = this.getConfig("bot");
                IdlePixelPlus.sendCustomMessage(bot, {
                    content: `MODMOD:MODCHAT:${message}`
                });
            }, "Group chat with other mods (who have ModMod installed).");
 
            const username = window.var_username;
            const playerIDURL = this.getConfig("modstuffPlayerIDURL");
            const modstuffUsername = this.getConfig("modstuffUsername");
            const modstuffPassword = this.getConfig("modstuffPassword");
            if(playerIDURL && modstuffUsername && modstuffPassword) {
                fetch("https://data.idle-pixel.com/modstuff/players.csv", {
                    headers: {
                        Authorization: "Basic "+btoa(modstuffUsername+":"+modstuffPassword)
                    }
                }).then(resp => resp.text()).then(resp => {
                    resp.split(/[\r\n]+/g).forEach(row => {
                        const data = row.split(",");
                        const playerId = (data[0]||"").trim();
                        const playerUsername = (data[1]||"").trim();
                        if(playerId && playerUsername) {
                            self.playerMap[playerId] = playerUsername;
                        }
                    });
 
                    window.ModifyMarketDataHeader = function(rowHtml) {
                        rowHtml = rowHtml.replace("</tr>", "<th>PLAYER</th></tr>");
                        return rowHtml;
                    }
 
                    window.ModifyMarketDataRow = function(datum, rowHtml) {
                        const username = self.playerMap[datum.player_id] || "? "+datum.player_id;
                        rowHtml = rowHtml.replace("</tr>", `<td>${username}</td></tr>`);
                        return rowHtml;
                    }
 
                   return true;
                });
            }
 
            $("#chat-area").on("contextmenu", (event) => {
                //console.log(event);
                const target = event.target;
                if(target.classList.contains("chat-username")) {
                    const username = target.innerText.trim();
                    const context = $("#modmod-chat-context-menu");
                    context.empty();
                    context.append(`
                      <div class="context-menu-header">${username}</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextQuickMute('${username}')">QUICK MUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextQuickUnmute('${username}')">QUICK UNMUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextMute('${username}')">MUTE</div>
                      <div class="context-menu-item" onclick="IdlePixelPlus.plugins.ModMod.contextWhoIs('${username}')">WHO IS</div>
                    `);
                    context.css("left", `${event.clientX-10}px`);
                    context.css("top", `${window.scrollY+event.clientY-90}px`);
                    context.show();
 
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            });
 
            $("body").append(`
            <div id="modmod-chat-context-menu" style="display:none;" oncontextmenu="event.stopPropagation(); event.preventDefault();">
 
            </div>
            `);
            $("#modmod-chat-context-menu").on("mouseleave", function() {
                $(this).hide();
            });
        }
 
        contextQuickMute(username) {
            // MUTE=username~hours~reason~ip
            IdlePixelPlus.sendMessage(`MUTE=${username}~1~quick mute~0`);
            $("#modmod-chat-context-menu").hide();
            return false;
        }
 
        contextQuickUnmute(username) {
            // MUTE=username~hours~reason~ip
            IdlePixelPlus.sendMessage(`MUTE=${username}~0~quick mute~0`);
            $("#modmod-chat-context-menu").hide();
            return false;
        }
 
        contextMute(username) {
            // CHAT=/smute anwinity
            IdlePixelPlus.sendMessage(`CHAT=/smute ${username}`);
            $("#modmod-chat-context-menu").hide();
            return false;
        }
 
        contextWhoIs(username) {
            // CHAT=/whois anwinity
            IdlePixelPlus.sendMessage(`CHAT=/whois ${username}`);
            $("#modmod-chat-context-menu").hide();
            return false;
        }
 
        onConfigsChanged() {
            this.sendHello(false);
        }
 
        onCustomMessageReceived(player, content, callbackId) {
            const bot = this.getConfig("bot");
            if(bot == player) {
                this.setBotOnlineStatus(true);
                if(content.startsWith("MODMOD:")) {
                    // console.log(`player=${player}, content=${content}, callbackId=${callbackId}`);
                    content = content.substring("MODMOD:".length);
                    const colonSplit = content.split(":");
                    const modmodCommand = colonSplit[0];
                    content = content.substring(modmodCommand.length+1);
                    this.handleModModCommand(modmodCommand, player, content, callbackId);
                }
            }
        }
 
        onCustomMessagePlayerOffline(player, content) {
            const bot = this.getConfig("bot");
            if(bot == player) {
                this.setBotOnlineStatus(false);
            }
        }
 
    }
 
    var online_mods = new Set()
    const plugin = new ModModPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();