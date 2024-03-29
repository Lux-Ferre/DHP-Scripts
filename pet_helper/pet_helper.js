// ==UserScript==
// @name         Idle-Pixel Pet Helper
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Plugin for interacting with LuxBot's pet DB.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://update.greasyfork.org/scripts/484046/1307183/IdlePixel%2B%20Custom%20Handling.js
// ==/UserScript==

(function() {
	'use strict';

	class PetHelper extends IdlePixelPlusPlugin {
		constructor() {
			super("pethelper", {
				about: {
					name: GM_info.script.name,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				},
			});
		}

		onLogin() {
			const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
			onlineCount.before(`
				<a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('pethelper')" title="Pet Helper Panel">Pets&nbsp;&nbsp;&nbsp;</a>
			`);
	
			this.createPanel()
		}
	
		onCustomMessageReceived(player, content, callbackId) {
			const customData = Customs.parseCustom(player, content, callbackId)        // Parses custom data into an object, assumes the Anwinity Standard
			if (!(customData.plugin === "pethelp" || customData.anwinFormatted)){      // Checks if custom is formatted in the correct way, and from the correct plugin
				return
			}
			if (customData.player === "luxbot"){      // Checks if custom is received from the correct player
				if (customData.command === "error"){     // Runs relevant command code, replace with switch statment if using many commands
					this.addError(customData.payload)
				} else if (customData.command === "success"){
					this.addSuccess()
				}
			}
			}
		
		createPanel(){
			IdlePixelPlus.addPanel("pethelper", "Pet Helper Panel", function() {
				return `
<div class="PetHelperUIContainer w-100">
    <div class="row">
        <div class="col"></div>
    </div>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col-1 text-end"><label class="col-form-label" for="petHelperNameInput">Pet Name:</label></div>
                        <div class="col-11 align-self-center"><input id="petHelperNameInput" class="w-100" type="text" /></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col-1 text-end"><label class="col-form-label" for="petHelperTitleInput">Title:</label></div>
                        <div class="col-11 align-self-center"><input id="petHelperTitleInput" class="w-100" type="text" /></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col-1 text-end"><label class="col-form-label" for="petHelperURLInput">URL:</label></div>
                        <div class="col-11 align-self-center"><input id="petHelperURLInput" class="w-100" type="text" /></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <form class="text-center" onsubmit="event.preventDefault(); IdlePixelPlus.plugins.pethelper.sendPetLink();"><input id="petHelperSendButton" class="w-25 h-100" type="submit" value="Send" /></form>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12"><label id="petHelperError" class="col-form-label w-100"></label></div>
    </div>
</div>
				`
			});
		}
	
		sendPetLink() {
			const pet_name = $("#petHelperNameInput").val()
			const pet_title = $("#petHelperTitleInput").val()
			const pet_url = $("#petHelperURLInput").val()
			
			const payload = `${pet_name};${pet_title};${pet_url}`
			Customs.sendBasicCustom("luxbot", "pethelp", "add", payload)
		}
	
		addError(errorType){
			if (errorType === "titleExists"){
				$("#petHelperError").text("Error: title already exists!")
			}
		}
	
		addSuccess(){
			$("#petHelperError").text("Success! Link added!")
			$("#petHelperNameInput").val("")
			$("#petHelperTitleInput").val("")
			$("#petHelperURLInput").val("")
		}
	
		getOGThumbnail(){
			GM_xmlHttpRequest({
				url: "https://prnt.sc/IoTU5g6RbGZY",
				method: "HEAD",
				headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64)'},
				onload: response => {
					console.log(response.responseHeaders);
				}
			})
		}
	}

	const plugin = new PetHelper();
	IdlePixelPlus.registerPlugin(plugin);

})();
