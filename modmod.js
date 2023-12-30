// ==UserScript==
// @name			IdlePixel ModMod (Lux-Ferre Fork)
// @namespace		lbtechnology.info
// @version			2.4.1
// @description		DHP Mod for Mods. ModMod. ModModMod. Mod.
// @author			Anwinity & Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// @require			https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==
 
(function() {
	'use strict';

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
						label: "For market names - requires Market Overall (refresh if changed)",
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
						label: "Panel Configs (Refresh to apply)",
						type: "label"
					},
					{
						id: "modstuffPassword",
						label: "modstuff pass",
						type: "string"
					},
					{
						id: "loginColour",
						label: "Login event colour:",
						type: "color",
						default: "#00FF00"
					},
					{
						id: "automodColour",
						label: "Automod event colour:",
						type: "color",
						default: "#FF0000"
					},
					{
						id: "atPingColour",
						label: "At ping colour:",
						type: "color",
						default: "#0000FF"
					},
					{
						id: "contextColour",
						label: "Context menu event colour:",
						type: "color",
						default: "#00FFFF"
					}
				]
			});
			this.playerMap = {};
			this.onlineMods = new Set()
		}

		toRGBA(hex, alpha) {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		}
 
		createPanel(){
			IdlePixelPlus.addPanel("modmod", "ModMod Panel", function() {
				return `
<div class="modmodUIContainer w-100">
    <div id="modmodInfoModule" class="row modmodUIModule">
        <div class="col">
            <div class="row text-end">
                <div id="modmodOnlineModsContainer" class="col"><span>Bot Status: </span><span id="modmod-status">Unknown</span></div>
            </div>
            <div class="row">
                <div class="col-2 text-end align-self-center"><label class="col-form-label">Online Mods:</label></div>
                <div id="modmodBotStatusContainer" class="col-10 d-flex"><textarea id="modmodModList" class="w-100 readonly" rows="1" wrap="soft"></textarea></div>
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
			});
		}

		addStyles(){
			const loginColourHex = this.getConfig("loginColour")
			const automodColourHex = this.getConfig("automodColour")
			const atPingColourHex = this.getConfig("atPingColour")
			const contextColourHex = this.getConfig("contextColour")

			const loginMessageColour = this.toRGBA(loginColourHex, 0.15)
			const automodMessageColour = this.toRGBA(automodColourHex, 0.15)
			const atPingMessageColour = this.toRGBA(atPingColourHex, 0.15)
			const contextMessageColour = this.toRGBA(contextColourHex, 0.15)

			const loginBoxColour = this.toRGBA(loginColourHex, 0.5)
			const automodBoxColour = this.toRGBA(automodColourHex, 0.5)
			const atPingBoxColour = this.toRGBA(atPingColourHex, 0.5)
			const contextBoxColour = this.toRGBA(contextColourHex, 0.5)

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
				background-color: ${loginMessageColour};
			}
			.modmodLoginMessageBox{
				color: black;
				font-weight: 500;
				background-color: ${loginBoxColour};
				border: ${loginColourHex};
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodChatMessageBackground {
			}
			.modmodChatMessageBox{
				display: none;
			}
			.modmodAutomodMessageBackground {
				background-color: ${automodMessageColour};
			}
			.modmodAutomodMessageBox{
				color: black;
				font-weight: 500;
				background-color: ${automodBoxColour};
				border: ${automodColourHex};
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodAtMessageBackground {
				background-color: ${atPingMessageColour};
			}
			.modmodAtMessageBox{
				color: black;
				font-weight: 500;
				background-color: ${atPingBoxColour};
				border: ${atPingColourHex};
				font-size: smaller;
				padding: 2px 4px;
			}
			.modmodMenuMessageBackground {
				background-color: ${contextMessageColour};
			}
			.modmodMenuMessageBox {
				color: black;
				font-weight: 500;
				background-color: ${contextBoxColour};
				border: ${contextColourHex};
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

			this.showNotification(messageType)
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
 
		handleModModCommand(customData) {
			const modsDisplayBox = $("#modmodModList")
			switch(customData.command) {
				case "message": {
					this.addModModChatMessage(customData.payload, "C");
					break;
				}
				case "list": {
					const onlineMods = customData.payload.split(",")
					onlineMods.forEach(mod=>{
						this.onlineMods.add(mod)
					})
					modsDisplayBox.val(Array.from(this.onlineMods).join(', '))
					break;
				}
				case "login": {
					this.onlineMods.add(customData.payload)
					modsDisplayBox.val(Array.from(this.onlineMods).join(', '))
					this.addModModChatMessage(`${customData.payload} has logged in.`, "L")
					break;
				}
				case "logout": {
					this.onlineMods.delete(customData.payload)
					modsDisplayBox.val(Array.from(this.onlineMods).join(', '))
					this.addModModChatMessage(`${customData.payload} has logged out.`, "L")
					break;
				}
				case "automod": {
					this.addModModChatMessage(`${customData.payload}`, "A")
					break;
				}
				case "at": {
					this.addModModChatMessage(`${customData.payload}`, "@")
					break;
				}
				case "context": {
					this.addModModChatMessage(`${customData.payload}`, "M")
					break;
				}
				case "HELLO": {
					break;
				}
				default: {
					console.log(customData)
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
				if(statusBefore!=="Online") {
					this.addModModChatMessage("Bot Status: Online", "L");
				}
			}
			else if(online===false) {
				el.text("Offline");
				el.css("color", "#EE4B2B");
				if(statusBefore!=="Offline") {
					this.addModModChatMessage("Bot Status: Offline", "L");
					setTimeout(() => this.sendHello(false), 20000);
				}
			}
			else {
				el.text("Unknown");
				el.css("color", "lightgrey");
				if(statusBefore!=="Unknown") {
					this.addModModChatMessage("Bot Status: Unknown", "L");
				}
			}
		}
 
		onLogin() {
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

			this.createNotification()
		}

		onPanelChanged(panelBefore, panelAfter){
			if (panelAfter==="modmod"){
				$("#modmodNotification").hide()
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

		broadcastContextAction(action){
			const bot = this.getConfig("bot")
			const content = `MODMOD:context:${action}`

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
 
		contextQuickMute(username) {
			// MUTE=username~hours~reason~ip
			IdlePixelPlus.sendMessage(`MUTE=${username}~1~quick mute [${window["var_username"]}]~0`);
			$("#modmod-chat-context-menu").hide();
			const action = `${window["var_username"]} quick muted ${username}`
			this.broadcastContextAction(action)
			return false;
		}
 
		contextQuickUnmute(username) {
			// MUTE=username~hours~reason~ip
			IdlePixelPlus.sendMessage(`MUTE=${username}~0~quick unmute [${window["var_username"]}]~0`);
			$("#modmod-chat-context-menu").hide();
			const action = `${window["var_username"]} quick unmuted ${username}`
			this.broadcastContextAction(action)
			return false;
		}
 
		contextMute(username) {
			// CHAT=/smute anwinity
			IdlePixelPlus.sendMessage(`CHAT=/smute ${username}`);
			$("#modmod-chat-context-menu").hide();
			const action = `${window["var_username"]} muted ${username}`
			this.broadcastContextAction(action)
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
			const customData = this.parseCustom(player, content, callbackId)
			const bot = this.getConfig("bot");
			if(bot === player) {
				this.setBotOnlineStatus(true);
				if(customData.plugin==="ModMod") {
					this.handleModModCommand(customData);
				}
			}
		}
 
		onCustomMessagePlayerOffline(player, content) {
			const bot = this.getConfig("bot");
			if(bot === player) {
				this.setBotOnlineStatus(false);
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

		createNotification(){
			const notificationString = `
			<div id="modmodNotification" class="notification hover" onclick="IdlePixelPlus.setPanel('modmod')">
        		<img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/diamond_hammer.png" class="w20" alt="">
        		<span class="font-small color-yellow">ModMod</span>
    		</div>
			`

			const notificationElement = $.parseHTML(notificationString)
			const notificationBar = $("#notifications-area")

			notificationBar.append(notificationElement)
			$("#modmodNotification").hide()
		}

		showNotification(type){
			if(Globals.currentPanel === "modmod"){return;}

			const typeMap = {
				"L": "#modmodLoginEventsCheck",
				"A": "#modmodAutoModEventsCheck",
				"@": "#modmodAtPingsCheck",
				"M": "#modmodContextEventsCheck",
				"C": "#modmodChatMessageCheck"
			}

			const check = typeMap[type]

			const isChecked = $(check).is(':checked')
			if(isChecked){
				$("#modmodNotification").show()
			}

		}
 
	}

	const plugin = new ModModPlugin();
	IdlePixelPlus.registerPlugin(plugin);
 
})();