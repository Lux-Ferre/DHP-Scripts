// ==UserScript==
// @name			IdlePixel Group Chat
// @namespace		lbtechnology.info
// @version			1.0.0
// @description		A private group chat panel
// @author			Lux-Ferre
// @license			MIT
// @match			*://idle-pixel.com/login/play*
// @grant			none
// @require			https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require			https://update.greasyfork.org/scripts/484046/1307183/IdlePixel%2B%20Custom%20Handling.js
// ==/UserScript==
 
(function() {
	'use strict';

	class GroupChatPlugin extends IdlePixelPlusPlugin {
		constructor() {
			super("groupChat", {
				about: {
					name: GM_info.script.name,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				},
				config: [
					{
						id: "memberList",
						label: "Members List (comma separated list)",
						type: "string"
					},
					{
						id: "password",
						label: "Password",
						type: "string"
					},
				]
			});
		}
 
		createPanel(){
			IdlePixelPlus.addPanel("groupchat", "Group Chat Panel", function() {
				return `
<div class="groupChatUIContainer w-100">
    <div id="groupChatInfoModule" class="row groupChatUIModule">
        <div class="col">
            <div class="row">
                <div class="col-1 text-end align-self-center"><label class="col-form-label" for="groupChatMembersList">Members:</label></div>
                <div class="col-8 d-flex"><input id="groupChatMemberList" class="w-100" type="text" readonly /></div>
                <div class="col-1 text-end align-self-center"><label class="col-form-label" for="groupChatPassword">Password:</label></div>
                <div class="col-2 d-flex"><input id="groupChatPassword" class="w-100" type="text" readonly /></div>
            </div>
        </div>
    </div>
    <div id="groupChatChatModule" class="row groupChatUIModule">
        <div class="col">
            <div class="row">
                <div id="groupChatChatFormContainer" class="col">
                    <div id="groupChatChatBox" class="overflow-auto"></div>
                    <form onsubmit="event.preventDefault(); IdlePixelPlus.plugins.groupChat.sendGroupChat();">
                        <div class="row d-flex flex-fill">
                            <div class="col-11"><input id="groupChatChatIn" class="form-control w-100" type="text" /></div>
                            <div class="col-1"><input id="groupChatChatButton" class="w-100 h-100" type="submit" value="Send" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
				`
			});
		}

		addStyles(){
			$("head").append(`
				<style id="styles-groupchat">
					.groupChatUIModule {
						border: outset 2px;
					}
					
					.groupChatUIContainer {
						width: 100%;
						height: 100%;
						padding: 5px;
						margin: 0;
					}
					
					#groupChatChatBox {
						width: 100%;
						height: 70vh;
						margin-top: 10px;
					}
					
					#groupChatChatBox {
						border: inset 1px;
					}
				</style>
			`)
		}
	
		onLogin() {
			const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
			onlineCount.before(`
				<a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('groupchat')" title="Group Chat Panel">Group Chat&nbsp;&nbsp;&nbsp;</a>
			`);
			
			this.createPanel()
			this.addStyles()
			this.createNotification()
			this.updatePanelInfo()
		}

		onPanelChanged(panelBefore, panelAfter){
			if (panelAfter==="groupchat"){
				$("#groupChatNotification").hide()
			}
		}
 
		onConfigsChanged() {
			this.updatePanelInfo();
		}
 
		onCustomMessageReceived(player, content, callbackId) {
			const customData = Customs.parseCustom(player, content, callbackId)
			const correctPassword = this.getConfig("password");
			if(customData.plugin==="groupchat") {
				if(customData.command==="chat"){
					const splitData = customData.payload.split(";")
					const givenPassword = splitData[0]
					const message = splitData.slice(1).join(";")
					if(givenPassword===correctPassword){
						this.addGroupChatMessage(player, message)
					}
				}
			}
		}
	
		updatePanelInfo(){
			const memberListField = $("#groupChatMemberList")
			const passwordField = $("#groupChatPassword")
			
			memberListField.val(this.getConfig("memberList"))
			passwordField.val(this.getConfig("password"))
		}
	
		createNotification(){
			const notificationString = `
			<div id="groupChatNotification" class="notification hover" onclick="IdlePixelPlus.setPanel('groupchat')">
        		<img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/diamond.png" class="w20" alt="">
        		<span class="font-small color-yellow">Group Chat</span>
    		</div>
			`

			const notificationElement = $.parseHTML(notificationString)
			const notificationBar = $("#notifications-area")

			notificationBar.append(notificationElement)
			$("#groupChatNotification").hide()
		}

		showNotification(){
			if(Globals.currentPanel === "panel-groupchat"){return;}
			
			$("#groupChatNotification").show()
		}
	
		getMemberList(){
			const stringifiedNameList = this.getConfig("memberList").toLowerCase()
			
			// Remove trailing commas
			if(stringifiedNameList.charAt(stringifiedNameList.length - 1) === ","){
				stringifiedNameList = stringifiedNameList.slice(0, -1);
			}
			
			const nameList = stringifiedNameList.split(",")
						
			// Remove empty entry (handles when no names have been given)
			if (nameList[0] === ""){
				nameList.shift()
			}
			
			return nameList.slice(0, 8)
		}
	
		sendGroupChat(){
			const chatIn = $("#groupChatChatIn")
			const chat_message = chatIn.val()
			chatIn.val("")
			
			const password = this.getConfig("password")
			
			const memberList = this.getMemberList()
			
			memberList.forEach(member => {
				Customs.sendBasicCustom(member, "groupchat", "chat", `${password};${chat_message}`)
			})
		}

		addGroupChatMessage(sender, message) {
			const newMessageString = `
				<div class="">
					<span class="color-green">${Chat._get_time()}</span>
					<span><strong>${sender}: </strong></span>
					<span>${sanitize_input(message)}</span>
				</div>
			`

			const newMessageElement = $.parseHTML(newMessageString)
			const chatBox = $("#groupChatChatBox")
			chatBox.append(newMessageElement);

			chatBox.scrollTop(chatBox[0].scrollHeight);

			this.showNotification()
		}
	}

	const plugin = new GroupChatPlugin();
	IdlePixelPlus.registerPlugin(plugin);
 
})();