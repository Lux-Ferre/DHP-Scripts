// ==UserScript==
// @name			IdlePixel ModMod (Lux-Ferre Fork)
// @namespace		lbtechnology.info
// @version			2.0.0
// @description		DHP Mod for Mods. ModMod. ModModMod. Mod.
// @author			Anwinity & Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// @require			https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==
 
(function() {
	'use strict';
 
	const botUsername = "luxbot";
 
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
			this.onlineMods = new Set()
		}
 
		createPanel(){
			IdlePixelPlus.addPanel("modmod", "ModMod Panel", function() {
				let content = `
<div class="modmodUIContainer w-100">
    <div id="modmodInfoModule" class="row modmodUIModule">
        <div class="col">
            <div class="row text-end">
                <div id="modmodOnlineModsContainer" class="col"><span>Bot Status: </span><span id="modmod-status">Unknown</span></div>
            </div>
            <div class="row">
                <div class="col-2 text-end align-self-center"><label class="col-form-label">Online Mods:</label></div>
                <div id="modmodBotStatusContainer" class="col-10 d-flex"><textarea id="modmodModList" class="w-100 readonly" rows="1" wrap="off"></textarea></div>
            </div>
        </div>
    </div>
    <div id="modmodChatModule" class="row modmodUIModule">
        <div class="col">
            <div class="row">
                <div id="modmodChatFormContainer" class="col">
                    <div id="modmodChatBox" class="overflow-auto"></div>
                    <form onsubmit="event.preventDefault(); IdlePixelPlus.plugins.ModMod.sendModChat();">
                        <div class="row d-flex flex-fill">
                            <div class="col-11"><input id="modmodChatIn" class="form-control w-100" type="text" /></div>
                            <div class="col-1"><input id="modmodChatButton" class="w-100 h-100" type="submit" value="Send" /></div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row">
                <div id="modmodChatOptionsContainer" class="col-12 d-flex justify-content-around flex-wrap">
                    <div class="form-check"><input id="modmodLoginEventsCheck" class="form-check-input modmodCheckbox" type="checkbox" checked /><label class="form-check-label" for="modmodLoginEventsCheck">  Login Events</label></div>
                    <div class="form-check"><input id="modmodAutoModEventsCheck" class="form-check-input modmodCheckbox" type="checkbox" checked /><label class="form-check-label" for="modmodAutoModEventsCheck">  Automod Events</label></div>
                    <div class="form-check"><input id="modmodAtPingsCheck" class="form-check-input modmodCheckbox" type="checkbox" checked /><label class="form-check-label" for="modmodAtPingsCheck">  @mods Pings</label></div>
                    <div class="form-check"><input id="modmodContextEventsCheck" class="form-check-input modmodCheckbox" type="checkbox" checked /><label class="form-check-label" for="modmodContextEventsCheck">  Context Menu Events</label></div>
                    <div class="form-check"><input id="modmodChatMessageCheck" class="form-check-input modmodCheckbox" type="checkbox" checked /><label class="form-check-label" for="modmodChatMessageCheck">  Chat Messages</label></div>
                </div>
            </div>
        </div>
    </div>
    <div id="modmodLinksModule" class="row modmodUIModule">
        <div class="col-12 d-flex justify-content-around"><a href="https://idle-pixel.com/admin/">Admin Panel</a><a href="http://data.idle-pixel.com/inspect/">Player Inspect</a><a href="http://data.idle-pixel.com/tradehist/">Trade History</a></div>
    </div>
</div>
				`
				return content
			});
		}

		addStyles(){
			let borderColour

			if ("ui-tweaks" in IdlePixelPlus.plugins){
				borderColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-panels"]
			} else {
				borderColour = "black"
			}

			$("head").append(`
					<style id="styles-modmod">
.modmodUIModule {
	border: outset 2px;
}

.modmodUIContainer {
	width: 100%;
	height: 100%;
	padding: 5px;
	margin: 0;
}

#modmodChatBox {
	width: 100%;
	height: 70vh;
	margin-top: 10px;
}

#modmodChatBox {
	border: inset 1px;
}

#modmodChatOptionsContainer {
	margin-bottom: 10px;
}

			.modmodLoginMessageBackground {
				background-color: rgba(0, 255, 0, 0.15);
			}
			.modmodLoginMessageBox{
				color: black;
				font-weight: 500;
				background-color: limegreen;
				border: green;
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodChatMessageBackground {
			}
			.modmodChatMessageBox{
				display: none;
			}
			.modmodAutomodMessageBackground {
				background-color: rgba(255, 0, 0, 0.15);
			}
			.modmodAutomodMessageBox{
				color: black;
				font-weight: 500;
				background-color: maroon;
				border: red;
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodAtMessageBackground {
				background-color: rgba(255, 0, 0, 0.15);
			}
			.modmodAtMessageBox{
				color: black;
				font-weight: 500;
				background-color: maroon;
				border: red;
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodMenuMessageBackground {
				background-color: rgba(255, 0, 0, 0.15);
			}
			.modmodMenuMessageBox {
				color: black;
				font-weight: 500;
				background-color: maroon;
				border: red;
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodLoginMessageToggle {}
			.modmodChatMessageToggle {}
			.modmodAtMessageToggle {}
			.modmodMenuMessageToggle {}
			.modmodAutoMessageToggle {}

						body {
							position: relative !important;
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
				`)
		}

		sendModChat(){
			const bot = this.getConfig("bot")
			const chatIn = $("#modmodChatIn")
			const modmod_message = chatIn.val()
			chatIn.val("")
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
 
		addModModChatMessage(message, messageType) {
			if(this.getConfig("suppressLoginMessages") && messageType==="L") {
				return;
			}

			let backgroundClass
			let boxClass
			let toggleClass

			switch (messageType){
				case "L":
					backgroundClass = "modmodLoginMessageBackground"
					boxClass = "modmodLoginMessageBox"
					toggleClass = "modmodLoginMessageToggle"
					break;
				case "A":
					backgroundClass = "modmodAutomodMessageBackground"
					boxClass = "modmodAutomodMessageBox"
					toggleClass = "modmodAutoMessageToggle"
					break;
				case "@":
					backgroundClass = "modmodAtMessageBackground"
					boxClass = "modmodAtMessageBox"
					toggleClass = "modmodAtMessageToggle"
					break;
				case "M":
					backgroundClass = "modmodMenuMessageBackground"
					boxClass = "modmodMenuMessageBox"
					toggleClass = "modmodMenuMessageToggle"
					break;
				case "C":
					backgroundClass = "modmodChatMessageBackground"
					boxClass = "modmodChatMessageBox"
					toggleClass = "modmodChatMessageToggle"
					break;
				default:
					break;
			}
			const newMessageString = `
			<div class="${backgroundClass} ${toggleClass}">
				<span class="color-green">${Chat._get_time()}</span>
				<span class="${boxClass} shadow">${messageType}</span>
				<span>${sanitize_input(message)}</span>
			</div>
			`

			const newMessageElement = $.parseHTML(newMessageString)
			const chatBox = $("#modmodChatBox")
			chatBox.append(newMessageElement);

			chatBox.scrollTop(chatBox[0].scrollHeight);
		}

		filterChatMessages(){
			const filterList=[
				{
					filterClass: ".modmodLoginMessageToggle",
					boxID: "#modmodLoginEventsCheck"
				},
				{
					filterClass: ".modmodChatMessageToggle",
					boxID: "#modmodChatMessageCheck"
				},
				{
					filterClass: ".modmodAtMessageToggle",
					boxID: "#modmodAtPingsCheck"
				},
				{
					filterClass: ".modmodMenuMessageToggle",
					boxID: "#modmodContextEventsCheck"
				},
				{
					filterClass: ".modmodAutoMessageToggle",
					boxID: "#modmodAutoModEventsCheck"
				}
			]
			const sheet = document.getElementById("styles-modmod").sheet
			const rules = sheet.cssRules
			const removeList = []

			const filterClassList = []

			filterList.forEach(item=>{filterClassList.push(item.filterClass)})

			for (let i=0; i<(rules.length); i++){
				if(filterClassList.includes(rules[i].selectorText)){
					removeList.push(i)
				}
			}

			removeList.reverse()
			removeList.forEach(i=>{
				sheet.deleteRule(i)
			})

			filterList.forEach(check => {
				const isChecked = $(check.boxID).is(':checked')
				if(!isChecked){
					const newRule = `${check.filterClass} {display: none;}`
					sheet.insertRule(newRule)
				}
			})

		}
 
		handleModModCommand(command, player, content, callbackId) {
			switch(command) {
				case "MSG": {
					this.addModModChatMessage(content, "C");
					break;
				}
				case "LIST": {
					if (content.startsWith("list")){
						const onlineMods = content.slice(5).split(",")
						onlineMods.forEach(mod=>{this.onlineMods.add(mod)})
					}
					else if (content.startsWith("remove")){
						this.onlineMods.delete(content.slice(7))
					}
					else if (content.startsWith("add")){
						this.onlineMods.add(content.slice(4))
					}
					const modsDisplay = `Online Mods: ${Array.from(this.onlineMods).join(',')}`
					const modsDisplayBox = $("#modmodModList")
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
					this.addModModChatMessage("Bot Status: Online", "L");
				}
			}
			else if(online===false) {
				el.text("Offline");
				el.css("color", "#EE4B2B");
				if(statusBefore!="Offline") {
					this.addModModChatMessage("Bot Status: Offline", "L");
					setTimeout(() => this.sendHello(false), 20000);
				}
			}
			else {
				el.text("Unknown");
				el.css("color", "lightgrey");
				if(statusBefore!="Unknown") {
					this.addModModChatMessage("Bot Status: Unknown", "L");
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
			this.addStyles()
 
			this.sendHello(true);
			setInterval(() => {
				this.sendHello(false);
			}, 1000*60*1);

			const username = window.var_username;

			this.addMarketUsernames()
 
			this.createChatContextMenu(username)

			$(document).on("change", ".modmodCheckbox", e => {
				this.filterChatMessages()
			})

			var openImageDialogue = Modals.open_image_modal

			Modals.open_image_modal = (title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable) => {
				if (title === "WHOIS"){
					message = message.slice(4)
				}
				openImageDialogue(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable)
			}
		}

		createChatContextMenu(username){
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

		addMarketUsernames(){
			const self = this;
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
		}
 
		contextQuickMute(username) {
			// MUTE=username~hours~reason~ip
			IdlePixelPlus.sendMessage(`MUTE=${username}~1~quick mute [${window["var_username"]}]~0`);
			$("#modmod-chat-context-menu").hide();
			this.addModModChatMessage(`${window["var_username"]}quick muted ${username}`, "M")
			return false;
		}
 
		contextQuickUnmute(username) {
			// MUTE=username~hours~reason~ip
			IdlePixelPlus.sendMessage(`MUTE=${username}~0~quick unmute [${window["var_username"]}]~0`);
			$("#modmod-chat-context-menu").hide();
			this.addModModChatMessage(`${window["var_username"]}quick unmuted ${username}`, "M")
			return false;
		}
 
		contextMute(username) {
			// CHAT=/smute anwinity
			IdlePixelPlus.sendMessage(`CHAT=/smute ${username}`);
			$("#modmod-chat-context-menu").hide();
			this.addModModChatMessage(`${window["var_username"]} muted ${username}`, "M")
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

	const plugin = new ModModPlugin();
	IdlePixelPlus.registerPlugin(plugin);
 
})();