// ==UserScript==
// @name         IdlePixel UI Tweaks (Lite)
// @namespace    luxferre.dev
// @version      0.1.0
// @description  Adds some options to change details about the IdlePixel user interface.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play/
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

//	Original Author: Anwinity || Maintained by: GodofNades || Rewritten with ♡ by: Lux-ferre

(function () {
	"use strict";

	let getVar, getThis

	const uitTableLabels = function () {
		window.UIT_POTION_XP_MAP = {
			stardust_potion: 75,
			energy_potion: 50,
			anti_disease_potion: 250,
			tree_speed_potion: 525,
			smelting_upgrade_potion: 550,
			great_stardust_potion: 1925,
			farming_speed_potion: 500,
			rare_monster_potion: 2125,
			super_stardust_potion: 4400,
			gathering_unique_potion: 3000,
			heat_potion: 2500,
			bait_potion: 1000,
			bone_potion: 1550,
			furnace_speed_potion: 6000,
			promethium_potion: 2000,
			oil_potion: 5000,
			super_rare_monster_potion: 6000,
			ultra_stardust_potion: 12900,
			magic_shiny_crystal_ball_potion: 7000,
			birdhouse_potion: 800,
			rocket_potion: 1500,
			titanium_potion: 5000,
			blue_orb_potion: 50000,
			geode_potion: 9500,
			magic_crystal_ball_potion: 12000,
			stone_converter_potion: 4000,
			rain_potion: 2500,
			combat_loot_potion: 9500,
			rotten_potion: 1250,
			merchant_speed_potion: 50000,
			green_orb_potion: 200000,
			guardian_key_potion: 42500,
			ancient_potion: 40000,
			red_orb_potion: 500000,
			cooks_dust_potion: 100000,
			farm_dust_potion: 100000,
			fighting_dust_potion: 100000,
			tree_dust_potion: 100000,
			infinite_oil_potion: 0,
			raids_hp_potion: 0,
			raids_mana_potion: 0,
			raids_bomb_potion: 0,
		};

		return {
			addTableCraftLabels: function () {
				// Invention Table
				const inventionTableRows = document.querySelectorAll(
					"#invention-table tbody tr[data-tablette-required]"
				);
				inventionTableRows.forEach((row) => {
					const outputs = row.querySelectorAll(
						"td:nth-child(4) item-invention-table"
					);
					outputs.forEach((output) => {
						output.textContent =
							Number(output.textContent).toLocaleString() +
							" (" +
							output.getAttribute("data-materials-item").replaceAll("_", " ") +
							")";
					});
				});

				// Crafting Table
				const craftingTableRows = document.querySelectorAll(
					"#crafting-table tbody tr[data-crafting-item]"
				);
				craftingTableRows.forEach((row) => {
					const outputs = row.querySelectorAll(
						"td:nth-child(3) item-crafting-table"
					);
					outputs.forEach((output) => {
						output.textContent =
							Number(output.textContent).toLocaleString() +
							" (" +
							output.getAttribute("data-materials-item").replaceAll("_", " ") +
							")";
					});
				});

				// Brewing Table
				const brewingTableRows = document.querySelectorAll(
					"#brewing-table tbody tr[data-brewing-item]"
				);
				brewingTableRows.forEach((row) => {
					const outputs = row.querySelectorAll(
						"td:nth-child(3) item-brewing-table"
					);
					outputs.forEach((output) => {
						output.textContent =
							output.textContent +
							" (" +
							output.getAttribute("data-materials-item").replaceAll("_", " ") +
							")";
					});
				});
			},

			updateTableCraftLabels: function () {
				const brewingTable = document.querySelector("#brewing-table");
				if (brewingTable) {
					const rows = brewingTable.querySelectorAll(
						"tbody tr[data-brewing-item]"
					);
					rows.forEach((row) => {
						if (row.id != "id-raids_hp_potion" || row.id != "id-raids_mana_potion" || row.id != "id-raids_bomb_potion") {
							const brewingXP = row.querySelector("td:nth-child(6)");
							if (brewingXP) {
								const potionName = brewingXP.getAttribute("data-xp").replace("_xp", "");
								const potionXP =
									UIT_POTION_XP_MAP[potionName]?.toLocaleString() + " xp";
								const potionOrig = document.createElement("span");
								potionOrig.classList.add("font-small", "color-grey");
								potionOrig.textContent = potionXP;
								brewingXP.innerHTML = "";
								brewingXP.appendChild(potionOrig);
							}
						}
					});
				}
			},

			disableTableRefreshBrewing: function () {
				Brewing.refresh_table = function (brewing_table) {
					Brewing._refresh_click_events(brewing_table)
					Brewing._refresh_materials(brewing_table)
					Brewing._refresh_timers(brewing_table)
					Brewing._refresh_backgrounds(brewing_table)
					//Brewing._refresh_xp_labels(brewing_table)
				}
			},

			Crafting_getMaterials: function () {
				Crafting._refresh_materials_and_level = function (crafting_table) {
					// var crafting_table = document.getElementById("crafting-table");
					if (!crafting_table) {
						crafting_table = document.getElementById("crafting-table");
					}

					var materials_req_array = crafting_table.getElementsByTagName("item-crafting-table");
					var levels_req_array = crafting_table.getElementsByTagName("item-crafting-table-level");

					for (var i = 0; i < materials_req_array.length; i++) {
						var materials_req = materials_req_array[i];
						var item = materials_req.getAttribute("data-materials-item");
						var originalAmount = materials_req.innerHTML;
						var amountText = originalAmount.split(" ")[0];
						var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
						var amount = parseInt(cleanedAmountText, 10);

						if (Items.getItem(item) >= amount)
							materials_req_array[i].style.color = "#00a200";
						else
							materials_req_array[i].style.color = "red";
					}

					for (var ix = 0; ix < levels_req_array.length; ix++) {
						var levels_req = levels_req_array[ix];
						var level_found = parseInt(levels_req.innerHTML);
						if (get_level(Items.getItem("crafting_xp")) >= level_found)
							levels_req.style.color = "green";
						else
							levels_req.style.color = "red";
					}
				}
				Crafting._refresh_click_events = function (crafting_table) {
					if (!crafting_table) {
						crafting_table = document.getElementById("crafting-table");
					}
					if (!Crafting._click_events_loaded) {
						var crafting_row_array = crafting_table.getElementsByTagName("tr");

						for (var i = 0; i < crafting_row_array.length; i++) {
							var crafting_row = crafting_row_array[i];
							if (!crafting_row.hasAttribute("data-crafting-item"))
								continue;

							crafting_row.addEventListener('click', (e) => {
								var target_clicked = e.target;
								var tr = target_clicked.closest("tr");
								var crafting_row_item = tr.getAttribute("data-crafting-item");
								var can_use_crafting_input_multiple = tr.getAttribute("data-crafting-item-multiple") === "true";

								if (can_use_crafting_input_multiple)
									Modals.open_input_dialogue(crafting_row_item, "Crafting", "How many do you want to craft?", "CRAFT");
								else {
									var materials = Crafting.get_materials(crafting_row_item);
									var html = "<div class='modal-crafting-ingredients shadow'>";
									html += "<b>MATERIALS</b><hr />";
									for (var i = 0; i < materials.length; i++) {
										var name = materials[i];
										i++;
										var amount = materials[i];
										var originalAmount = materials[i];
										//console.log(originalAmount);
										var amountText = originalAmount.split(" ")[0];
										var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
										var amountClick = parseInt(cleanedAmountText, 10);

										var img = '<img width="15px" height="15px" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/x.png">';

										if (Items.getItem(name) >= amountClick)
											img = '<img width="15px" height="15px" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/check.png">';

										html += "<img class='w40' src='https://d1xsc8x7nc5q8t.cloudfront.net/images/" + name + ".png' /> " + originalAmount + " " + img;
										html += "<br />";
									}
									html += "</div><br /><br />Craft Item?";

									document.getElementById("modal-brew-ingredients").innerHTML = html;
									Modals.open_image_modal("Crafting", "images/" + crafting_row_item + ".png", html, "Craft", "Cancel", "CRAFT=" + crafting_row_item + "~" + 1)
								}

							});
						}
						Crafting._click_events_loaded = true;
					}

				}
			},

			Invention_getMaterials: function () {
				Invention._refresh_materials = function () {
					var invention_table = document.getElementById("invention-table");
					var materials_req_array = invention_table.getElementsByTagName("item-invention-table");

					for (var i = 0; i < materials_req_array.length; i++) {
						var materials_req = materials_req_array[i];
						var item = materials_req.getAttribute("data-materials-item");
						var originalAmount = materials_req.innerHTML;
						var amountText = originalAmount.split(" ")[0];
						var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
						var amount = parseInt(cleanedAmountText, 10);

						if (Items.getItem(item) >= amount)
							materials_req_array[i].style.color = "#00a200";
						else
							materials_req_array[i].style.color = "red";
					}
				}
			},
			Modals_changeModal: function () {
				Modals.open_brew_dialogue = function (item) {
					document.getElementById("modal-brew-item-name-hidden").value = item;
					document.getElementById("modal-brew-item-image").src = get_image("images/" + item + ".png");
					document.getElementById("modal-brew-item-amount").value = "1";
					var materials = Brewing.get_ingredients(item);
					var html = "<b>INGREDIENTS</b><hr />";
					var dict = {};
					for (var i = 0; i < materials.length; i++) {
						var name = materials[i];
						i++;
						var amount = materials[i];
						var originalAmount = materials[i];
						//console.log(originalAmount);
						var amountText = originalAmount.split(" ")[0];
						var cleanedAmountText = amountText.replace(/[,.\s]/g, '');
						var amountClick = parseInt(cleanedAmountText, 10);
						html += "<img class='w40' src='https://d1xsc8x7nc5q8t.cloudfront.net/images/" + name + ".png' /> " + format_number(amountClick);
						html += "<br />";
						dict[name] = amountClick;
					}
					//console.log(dict);
					document.getElementById("modal-brew-ingredients").innerHTML = html;
					Modals.open_modern_input_dialogue_with_value(
						item,
						"images/" + item + ".png",
						dict,
						'PLUS_ONE',
						null,
						"Brew",
						"BREW=" + item,
					)
				}
			},
		};
	};

	const uitMisc = function () {
		return {
			initStyles: function () {
				const style = document.createElement("style");
				style.id = "styles-ui-tweaks-lite";
				style.textContent = `
				#chat-top {
				  display: flex;
				  flex-direction: row;
				  justify-content: left;
				}
				
				#chat-top > button {
				  margin-left: 2px;
				  margin-right: 2px;
				  white-space: nowrap;
				}
				
				#content.side-chat {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 2fr minmax(300px, 1fr);
				  grid-template-rows: 1fr;
				}
				
				#content.side-chat #game-chat {
				  max-height: calc(100vh - 32px);
				}
				
				#content.side-chat #game-chat > :first-child {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 1fr;
				  grid-template-rows: auto 1fr auto;
				  height: calc(100% - 16px);
				}
				
				#content.side-chat #chat-area {
				  height: auto !important;
				}
				
				.farming-plot-wrapper.condensed {
                  min-width: 115px;
				  display: flex;
				  flex-direction: row;
				  justify-items: flex-start;
				  width: fit-content;
                  height: unset;
                  min-height: unset;
                  max-height: unset;
				}
				
				.farming-plot-wrapper.condensed > span {
				  width: 100px;
				  max-height: 200px;
				}
				
				.farming-plot-wrapper.condensed img {
				  width: 100px;
				}
				
				#panel-gathering .gathering-box.condensed {
				  height: 240px;
				  position: relative;
				  margin: 4px auto;
				  padding-left: 4px;
				  padding-right: 4px;
				}
				
				#panel-gathering .gathering-box.condensed img.gathering-area-image {
				  position: absolute;
				  top: 10px;
				  left: 10px;
				  width: 68px;
				  height: 68px;
				}
				
				#panel-mining.add-arrow-controls itembox {
				  position: relative;
				}
				
				#panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
				  display: none !important;
				}
				
				itembox .arrow-controls {
				  position: absolute;
				  top: 0px;
				  right: 2px;
				  height: 100%;
				  padding: 2px;
				  display: flex;
				  flex-direction: column;
				  justify-content: space-around;
				  align-items: center;
				}
				
				itembox .arrow {
				  border: solid white;
				  border-width: 0 4px 4px 0;
				  display: inline-block;
				  padding: 6px;
				  cursor: pointer;
				  opacity: 0.85;
				}
				
				itembox .arrow:hover {
				  opacity: 1;
				  border-color: yellow;
				}
				
				itembox .arrow.up {
				  transform: rotate(-135deg);
				  -webkit-transform: rotate(-135deg);
				  margin-top: 3px;
				}
				
				itembox .arrow.down {
				  transform: rotate(45deg);
				  -webkit-transform: rotate(45deg);
				  margin-bottom: 3px;
				}

                .itembox-large {
                  width: 204px;
                  margin-bottom: 15px;
                }

				#menu-bar-sd_watch {
					margin-left: 20px;
				}
				
				.sd-watch-text {
					padding-left: 20px;
				}
				
				.game-menu-bar-left-table-btn tr
				{
				  background-color: transparent !important;
				  border:0 !important;
				  font-size:medium;
				}
				
				.hover-menu-bar-item:hover {
				  background: #256061 !important;
				  border:0 !important;
				  filter:unset;
				  font-size:medium;
				}
				
				.thin-progress-bar {
				  background:#437b7c !important;
				  border:0 !important;
				  height:unset;
				}
				
				.thin-progress-bar-inner {
				  background:#88e8ea !important;
				}
				
				.game-menu-bar-left-table-btn td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				}

                .game-menu-bar-left-table-btn div td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
				}

                #menu-bar-archery-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
                }

                #menu-bar-magic-table-btn-wrapper {
                  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
                }

				.game-menu-bar-left-table-btn {
				  background-color: transparent !important;
				}
				
				.left-menu-item {
				  margin-bottom:unset;
				  font-size:medium;
				}
				.left-menu-item > img {
				  margin-left: 20px;
				  margin-right: 20px;
				}
				`;

				document.head.appendChild(style);
			},

			recolorTableText: function () {
				document.querySelectorAll(".p-2.color-grey.font-small").forEach((cell) => {
					cell.style.color = "black";
					cell.style.fontSize = "1em";
				})
				document.querySelectorAll(".font-small.color-grey").forEach((cell) => {
					cell.style.color = "black";
					cell.style.fontSize = "1em";
				})
			},
		};
	};

	window.uitTableLabels = uitTableLabels;
	window.uitMisc = uitMisc;

	let onLoginLoaded = false;

	const FONTS = [];
	const FONT_DEFAULT = "IdlePixel Default";
	const FONT_FAMILY_DEFAULT = 'pixel, "Courier New", Courier, monospace';
	(async () => {
		const FONTS_CHECK = new Set(
			[
				// Windows 10
				"Arial",
				"Arial Black",
				"Bahnschrift",
				"Calibri",
				"Cambria",
				"Cambria Math",
				"Candara",
				"Comic Sans MS",
				"Consolas",
				"Constantia",
				"Corbel",
				"Courier New",
				"Ebrima",
				"Franklin Gothic Medium",
				"Gabriola",
				"Gadugi",
				"Georgia",
				"HoloLens MDL2 Assets",
				"Impact",
				"Ink Free",
				"Javanese Text",
				"Leelawadee UI",
				"Lucida Console",
				"Lucida Sans Unicode",
				"Malgun Gothic",
				"Marlett",
				"Microsoft Himalaya",
				"Microsoft JhengHei",
				"Microsoft New Tai Lue",
				"Microsoft PhagsPa",
				"Microsoft Sans Serif",
				"Microsoft Tai Le",
				"Microsoft YaHei",
				"Microsoft Yi Baiti",
				"MingLiU-ExtB",
				"Mongolian Baiti",
				"MS Gothic",
				"MV Boli",
				"Myanmar Text",
				"Nirmala UI",
				"Palatino Linotype",
				"Segoe MDL2 Assets",
				"Segoe Print",
				"Segoe Script",
				"Segoe UI",
				"Segoe UI Historic",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"SimSun",
				"Sitka",
				"Sylfaen",
				"Symbol",
				"Tahoma",
				"Times New Roman",
				"Trebuchet MS",
				"Verdana",
				"Webdings",
				"Wingdings",
				"Yu Gothic",
				// macOS
				"American Typewriter",
				"Andale Mono",
				"Arial",
				"Arial Black",
				"Arial Narrow",
				"Arial Rounded MT Bold",
				"Arial Unicode MS",
				"Avenir",
				"Avenir Next",
				"Avenir Next Condensed",
				"Baskerville",
				"Big Caslon",
				"Bodoni 72",
				"Bodoni 72 Oldstyle",
				"Bodoni 72 Smallcaps",
				"Bradley Hand",
				"Brush Script MT",
				"Chalkboard",
				"Chalkboard SE",
				"Chalkduster",
				"Charter",
				"Cochin",
				"Comic Sans MS",
				"Copperplate",
				"Courier",
				"Courier New",
				"Didot",
				"DIN Alternate",
				"DIN Condensed",
				"Futura",
				"Geneva",
				"Georgia",
				"Gill Sans",
				"Helvetica",
				"Helvetica Neue",
				"Herculanum",
				"Hoefler Text",
				"Impact",
				"Lucida Grande",
				"Luminari",
				"Marker Felt",
				"Menlo",
				"Microsoft Sans Serif",
				"Monaco",
				"Noteworthy",
				"Optima",
				"Palatino",
				"Papyrus",
				"Phosphate",
				"Rockwell",
				"Savoye LET",
				"SignPainter",
				"Skia",
				"Snell Roundhand",
				"Tahoma",
				"Times",
				"Times New Roman",
				"Trattatello",
				"Trebuchet MS",
				"Verdana",
				"Zapfino",
				// other
				"Helvetica",
				"Garamond",
			].sort()
		);
		await document.fonts.ready;
		for (const font of FONTS_CHECK.values()) {
			if (document.fonts.check(`12px "${font}"`)) {
				FONTS.push(font);
			}
		}
		FONTS.unshift("IdlePixel Default");
	})();

	const BG_COLORS = {
		"#chat-area .server_message": "",
		body: "rgb(200, 247, 248)",
		".top-bar": getComputedStyle(document.querySelector(".game-top-bar-upper"))
			.backgroundColor,
		"#menu-bar": getComputedStyle(document.querySelector("#menu-bar"))
			.backgroundColor,
		"#chat-area": getComputedStyle(document.querySelector("#chat-area"))
			.backgroundColor,
		"#game-chat": getComputedStyle(document.querySelector("#game-chat"))
			.backgroundColor,
		"#panels": getComputedStyle(document.querySelector("#panels"))
			.backgroundColor,
	};

	const FONT_COLORS = {
		"#chat-area .server_message": "",
		"#chat-area": document.querySelector("#chat-area")
			? getComputedStyle(document.querySelector("#chat-area")).color
			: "",
		"#chat-area .color-green": document.querySelector("#chat-area .color-green")
			? getComputedStyle(document.querySelector("#chat-area .color-green"))
				.color
			: "",
		"#chat-area .color-grey": document.querySelector("#chat-area .color-grey")
			? getComputedStyle(document.querySelector("#chat-area .color-grey")).color
			: "",
		"#chat-area .chat-username": document.querySelector(
			"#chat-area .chat-username"
		)
			? getComputedStyle(document.querySelector("#chat-area .chat-username"))
				.color
			: "",
		"#panels": document.querySelector("#panels")
			? getComputedStyle(document.querySelector("#panels")).color
			: "",
		"#panels .color-grey": document.querySelector("#panels .color-grey")
			? getComputedStyle(document.querySelector("#panels .color-grey")).color
			: "",
		"#panels .font-large": document.querySelector("#panels .font-large")
			? getComputedStyle(document.querySelector("#panels .font-large")).color
			: "",
		"#menu-bar-button .color-grey": document.querySelector(
			"#panels .color-grey"
		)
			? getComputedStyle(document.querySelector("#panels .color-grey")).color
			: "",
	};

	const CHAT_UPDATE_FILTER = [
		"#chat-area",
		"#chat-area .color-green",
		"#chat-area .color-grey",
		"#chat-area .chat-username",
		"#chat-area .server_message",
	];

	const PANEL_UPDATE_FILTER = ["#panels"];

	class UITweaksPlugin extends IdlePixelPlusPlugin {
		constructor() {
			super("ui-tweaks-lite", {
				about: {
					name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description,
				},
				config: [
					{
						label:
							"------------------------------------------------<br/>Chat/Images<br/>------------------------------------------------",
						type: "label",
					},
					{
						id: "font",
						label: "Primary Font",
						type: "select",
						options: FONTS,
						default: FONT_DEFAULT,
					},
					{
						id: "sideChat",
						label: "Side Chat",
						type: "boolean",
						default: false,
					},
					{
						id: "chatLimit",
						label: "Chat Message Limit (&leq; 0 means no limit)",
						type: "int",
						min: -1,
						max: 5000,
						default: 0,
					},
					{
						label:
							"------------------------------------------------<br/>BG Color Overrides<br/>------------------------------------------------",
						type: "label",
					},
					{
						id: "disableBGColorOverrides",
						label:
							"Disable background color overrides (Check = disabled)<br/>Disable the BG Color Overrides if you are wanting to use<br/>the built in settings for the game for your colors<br/>REFRESH REQUIRED WHEN DISABLING THE BG COLORS<br/>",
						type: "boolean",
						default: false,
					},
					{
						id: "color-enabled-body",
						label: "Main Background: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-body",
						label: "Main Background: Color",
						type: "color",
						default: BG_COLORS["body"],
					},
					{
						id: "color-enabled-panels",
						label: "Panel Background: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-panels",
						label: "Panel Background: Color",
						type: "color",
						default: BG_COLORS["#panels"],
					},
					{
						id: "color-enabled-top-bar",
						label: "Top Background: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-top-bar",
						label: "Top Background: Color",
						type: "color",
						default: BG_COLORS[".top-bar"],
					},
					{
						id: "color-enabled-menu-bar",
						label: "Menu Background: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-menu-bar",
						label: "Menu Background: Color",
						type: "color",
						default: BG_COLORS["#menu-bar"],
					},
					{
						id: "color-enabled-chat-area",
						label: "Inner Chat BG: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-chat-area",
						label: "Inner Chat BG: Color",
						type: "color",
						default: BG_COLORS["#chat-area"],
					},
					{
						id: "color-enabled-game-chat",
						label: "Outer Chat BG: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-game-chat",
						label: "Outer Chat BG: Color",
						type: "color",
						default: BG_COLORS["#game-chat"],
					},
					{
						id: "color-enabled-chat-area-server_message",
						label: "Server Message Tag: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "color-chat-area-server_message",
						label: "Server Message Tag: Color",
						type: "color",
						default: BG_COLORS["#chat-area .server_message"],
					},
					{
						label: "Text Color Overrides",
						type: "label",
					},
					{
						id: "font-color-enabled-chat-area",
						label: "Chat Text: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-chat-area",
						label: "Chat Text: Color",
						type: "color",
						default: FONT_COLORS["#chat-area"],
					},
					{
						id: "font-color-enabled-chat-area-color-green",
						label: "Chat Timestamp: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-chat-area-color-green",
						label: "Chat Timestamp: Color",
						type: "color",
						default: FONT_COLORS["#chat-area .color-green"],
					},
					{
						id: "font-color-enabled-chat-area-chat-username",
						label: "Chat Username: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-chat-area-chat-username",
						label: "Chat Username: Color",
						type: "color",
						default: FONT_COLORS["#chat-area .chat-username"],
					},
					{
						id: "font-color-enabled-chat-area-color-grey",
						label: "Chat Level: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-chat-area-color-grey",
						label: "Chat Level: Color",
						type: "color",
						default: FONT_COLORS["#chat-area .color-grey"],
					},
					{
						id: "font-color-chat-area-chat-raid-password",
						label: "Raid Password Link Text: Color",
						type: "color",
						default: "#c5baba",
					},
					{
						id: "background-color-chat-area-raid-password",
						label: "Raid Password Link Background: Color",
						type: "color",
						default: "darkred",
					},
					{
						id: "font-color-enabled-chat-area-server_message",
						label: "Server Message Tag: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-chat-area-server_message",
						label: "Server Message Tag: Color",
						type: "color",
						default: FONT_COLORS["#chat-area .server_message"],
					},
					{
						id: "serverMessageTextOverrideEnabled",
						label: "Server Message Text: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "serverMessageTextOverrideColor",
						label: "Server Message Text: Color",
						type: "color",
						default: "blue",
					},
					{
						id: "chatBorderOverrideColorEnabled",
						label: "Chat Border Color: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "chatBorderOverrideColor",
						label: "Chat Border Color: Color",
						type: "color",
						default: "blue",
					},
					{
						id: "font-color-enabled-panels",
						label: "Panels 1: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-panels",
						label: "Panels 1: Color",
						type: "color",
						default: FONT_COLORS["#chat-area"],
					},
					{
						id: "font-color-enabled-panels-color-grey",
						label: "Panels 2: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-panels-color-grey",
						label: "Panels 2: Color",
						type: "color",
						default: FONT_COLORS["#chat-area .color-grey"],
					},
					{
						id: "font-color-enabled-panels-font-large",
						label: "Skill Level Color: Enabled",
						type: "boolean",
						default: false,
					},
					{
						id: "font-color-panels-font-large",
						label: "Skill Level: Color",
						type: "color",
						default: FONT_COLORS["#panels .font-large"],
					},
				],
			})

			if (!localStorage.getItem("idlepixelplus.ui-tweaks-lite.config")) {
				try {
					localStorage.setItem("idlepixelplus.ui-tweaks-lite.config",
						localStorage.getItem("idlepixelplus.ui-tweaks.config"))
				} catch (error) {console.log(error)}
			}
		}

		condense_ui() {
			let leftbar = document.getElementById("menu-bar-buttons");

			let styleElement = document.getElementById("condensed-ui-tweaks");

			if (styleElement) {
				styleElement.parentNode.removeChild(styleElement);
			}
			document
				.getElementById("menu-bar-buttons")
				.querySelectorAll(".font-small")
				.forEach(function (smallFont) {
					let classInfo = smallFont.className.replaceAll(
						"font-small",
						"font-medium"
					);
					smallFont.className = classInfo;
				})

			leftbar.querySelectorAll("img").forEach(function (img) {
				img.className = "w20";
			});
		}

		updateColors(filter) {
			const bgColorCheck = getThis.getConfig("disableBGColorOverrides");

			if (!bgColorCheck) {
				Object.keys(BG_COLORS).forEach((selector) => {
					if (!filter || filter.includes(selector)) {
						const key = selector.replace(/[#\.]/g, "").replace(/-?\s+-?/, "-");
						const enabled = getThis.getConfig(`color-enabled-${key}`);
						const color = enabled
							? getThis.getConfig(`color-${key}`)
							: BG_COLORS[selector];
						const selected = document.querySelectorAll(selector);

						for (const element of selected) {
							element.style.backgroundColor = color;
						}
					}
				});

				Object.keys(FONT_COLORS).forEach((selector) => {
					if (!filter || filter.includes(selector)) {
						const key = selector.replace(/[#\.]/g, "").replace(/-?\s+-?/, "-");
						const enabled = getThis.getConfig(`font-color-enabled-${key}`);
						const color = enabled
							? getThis.getConfig(`font-color-${key}`)
							: FONT_COLORS[selector];
						const selected = document.querySelectorAll(selector);

						for (const element of selected) {
							element.style.color = color;
						}
					}
				});

				const chatBorderOverrideColorEnabled = getThis.getConfig(
					"chatBorderOverrideColorEnabled"
				);
				const chatBorderOverrideColor = getThis.getConfig(
					"chatBorderOverrideColor"
				);
				if (chatBorderOverrideColorEnabled) {
					const chatElements = document.querySelectorAll("#game-chat.chat.m-3");
					for (const element of chatElements) {
						element.style.borderColor = chatBorderOverrideColor;
					}
				}

				const serverMessageTextOverrideEnabled = getThis.getConfig(
					"serverMessageTextOverrideEnabled"
				);
				const serverMessageTextOverrideColor = serverMessageTextOverrideEnabled
					? getThis.getConfig("serverMessageTextOverrideColor")
					: "blue";
				const serverMessageElements = document.querySelectorAll(
					"#chat-area .server_message"
				);
				for (const element of serverMessageElements) {
					element.parentElement.style.color = serverMessageTextOverrideColor;
				}
			}

			document.getElementById("body").className = document
				.getElementById("body")
				.className.replaceAll("background-primary-gradient ", "");
		}

		condense_woodcutting_patches(){
			let patch_container = document.createElement("div")
			patch_container.classList.add("d-flex")
			const woodcutting_plots = document.querySelectorAll("#panel-woodcutting .farming-plot-wrapper")
			woodcutting_plots.forEach((plot) => {
				plot.classList.add("condensed")
				document
					.querySelectorAll("#panel-woodcutting .farming-plot-wrapper img[id^='img-tree_shiny']")
					.forEach(function (el) {
						el.removeAttribute("width");
						el.removeAttribute("height");
					})
				patch_container.appendChild(plot)
			})
			document.getElementById("panel-woodcutting").appendChild(patch_container)
		}

		condense_farming_patches() {
			let patch_container = document.createElement("div")
			patch_container.classList.add("d-flex")
			const farming_patch_container = document.querySelectorAll("#panel-farming .farming-plot-wrapper")
			farming_patch_container.forEach((plot) => {
				plot.classList.add("condensed");
				document
					.querySelectorAll("#panel-farming .farming-plot-wrapper img[id^='img-farm_shiny']")
					.forEach(function (el) {
						el.removeAttribute("width");
						el.removeAttribute("height");
					})
				patch_container.appendChild(plot)
			})
			document.getElementById("panel-farming").appendChild(patch_container)
		}

		condense_gathering_boxes(){
			const gathering_boxes = document.querySelectorAll("#panel-gathering .gathering-box")
			gathering_boxes.forEach(function (box) {
				box.classList.add("condensed")
				box.querySelector("hr").style.display = "none"
				box.querySelectorAll(".color-silver").forEach(element => {
					element.style.display = "none"
				})
				const unique_items = box.querySelector(".color-orange")
				unique_items.style.display = ""

				//	Remove new lines after unique items to make progress bar fit.
				let next_sibling = unique_items.nextSibling
				while (next_sibling) {
					if (next_sibling.tagName === "BR") {
						const element_to_remove = next_sibling
						next_sibling = next_sibling.nextSibling
						element_to_remove.remove()
					} else {
						next_sibling = next_sibling.nextSibling
					}
				}
			})
		}

		give_images_titles(){
			const images = document.querySelectorAll("img");
			images.forEach(function (el) {
				const src = el.getAttribute("src");
				if (src && src !== "x") {
					const title = src.replace(/.*\//, "").replace(/\.\w+$/, "");
					el.setAttribute("title", title);
				}
			})
		}

		add_mining_machine_arrows(){
			const machineryList = [
				"drill",
				"crusher",
				"giant_drill",
				"excavator",
				"giant_excavator",
				"massive_excavator",
			]

			document.querySelector("#panel-mining").classList.add("add-arrow-controls")

			const template = document.getElementById("uit_arrow_template")

			machineryList.forEach((machine) => {
				const itemBox = document.querySelector(`itembox[data-item=${machine}]`)
				let clone = template.content.cloneNode(true)
				if (itemBox) {
					clone.querySelector(".up").onclick = function (event) {
						event.stopPropagation()
						IdlePixelPlus.sendMessage(`MACHINERY=${machine}~increase`)
					}

					clone.querySelector("item-display").setAttribute("data-key", `${machine}_on`)

					clone.querySelector(".down").onclick = function (event) {
						event.stopPropagation()
						IdlePixelPlus.sendMessage(`MACHINERY=${machine}~decrease`)
					};

					itemBox.appendChild(clone)
				}
			})
		}

		update_ui(){
			document.body.style.fontFamily = "";
			const font = getThis.getConfig("font");
			if (font && font !== FONT_DEFAULT) {
				const bodyStyle = document.body.getAttribute("style");
				document.body.setAttribute(
					"style",
					`${bodyStyle}; font-family: ${font} !important`
				);
			}

			const sideChat = getThis.getConfig("sideChat");
			if (sideChat) {
				document.getElementById("content").classList.add("side-chat");
			} else {
				document.getElementById("content").classList.remove("side-chat");
			}

			this.condense_woodcutting_patches()
			this.condense_farming_patches()
			this.condense_gathering_boxes()
			this.give_images_titles()

			getThis.updateColors();

			this.condense_ui()
		}

		create_machinery_arrow_template() {
			const arrow_template_str = `
				<template id="uit_arrow_template">
					<div class="arrow-controls" onclick="event.stopPropagation()">
						<div class="arrow up"></div>
						<item-display data-format="number">1</item-display>
						<div class="arrow down"></div>
					</div>
				</template>
			`
			$("body").append($(arrow_template_str))
		}

		onConfigsChanged() {
			if (onLoginLoaded) {
				this.update_ui()
			}
		}

		onLogin() {
			getVar = IdlePixelPlus.getVarOrDefault;
			getThis = IdlePixelPlus.plugins["ui-tweaks-lite"];

			this.create_machinery_arrow_template()

			uitMisc().initStyles()

			getThis.updateColors();

			const tableLabel = getThis.getConfig("tableLabels");

			if (tableLabel) {
				uitTableLabels().addTableCraftLabels();
			}

			this.update_ui()
			this.add_mining_machine_arrows()

			// reorganize chat location
			const self = this;
			const chat = document.querySelector("#game-chat > :first-child");
			const chatTop = document.createElement("div");
			chatTop.id = "chat-top";
			const chatArea = document.querySelector("#chat-area");
			const chatBottom = document.querySelector(
				"#game-chat > :first-child > :last-child"
			);

			while (chat.firstChild) {
				chatTop.appendChild(chat.firstChild);
			}

			chat.appendChild(chatTop);
			chat.appendChild(chatArea);
			chat.appendChild(chatBottom);

			// override for service messages
			const original_yell_to_chat_box = Chat.yell_to_chat_box;
			Chat.yell_to_chat_box = function () {
				original_yell_to_chat_box.apply(Chat, arguments);
				self.updateColors();
			};

			function insertAfter(newNode, referenceNode) {
				referenceNode.parentNode.insertBefore(
					newNode,
					referenceNode.nextSibling
				);
			}

			var existingElement = document.getElementById(
				"menu-bar-idlepixelplus-icon"
			).parentNode;

			var newContainer = document.createElement("div");
			newContainer.setAttribute(
				"onclick",
				"IdlePixelPlus.setPanel('idlepixelplus')"
			);
			newContainer.className = "hover hover-menu-bar-item left-menu-item";

			// Create the inner table structure
			var table = document.createElement("table");
			table.className = "game-menu-bar-left-table-btn left-menu-item-other";
			table.style.width = "100%";

			var tbody = document.createElement("tbody");
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			td1.style.width = "30px";

			// Assuming there's only one image in the existing element
			var img = existingElement.querySelector("img");
			img.className = "w30";
			td1.appendChild(img);

			var td2 = document.createElement("td");
			// The text node for 'PLUGINS'
			var textNode = document.createTextNode("PLUGINS");
			td2.appendChild(textNode);

			// Append everything together
			tr.appendChild(td1);
			tr.appendChild(td2);
			tbody.appendChild(tr);
			table.appendChild(tbody);
			newContainer.appendChild(table);

			existingElement.parentNode.replaceChild(newContainer, existingElement);

			this.condense_ui()

			let archery = document.getElementById("left-panel-item_panel-archery");
			let magic = document.getElementById("left-panel-item_panel-magic");
			let labels = document.getElementById("left-menu-bar-labels");
			archery.className = "";
			magic.className = "";
			archery.querySelector("span[data-menu-bar-skill-label]").style.paddingLeft = "8px";
			magic.querySelector("span[data-menu-bar-skill-label]").style.paddingLeft = "8px";
			labels.style.padding = "unset";
			uitTableLabels().disableTableRefreshBrewing();
			uitTableLabels().Crafting_getMaterials();
			uitTableLabels().Invention_getMaterials();
			uitTableLabels().Modals_changeModal();

			onLoginLoaded = true;
		}

		clearChat() {
			const chatArea = document.getElementById("chat-area");
			while (chatArea.firstChild) {
				chatArea.removeChild(chatArea.firstChild);
			}
		}

		limitChat() {
			const chatArea = document.getElementById("chat-area");
			const chatLength = chatArea.innerHTML.length;
			const limit = getThis.getConfig("chatLimit");

			if (limit > 0 || chatLength > 190000) {
				const children = chatArea.children;

				if (limit > 0) {
					if (children.length > limit) {
						const toDelete = children.length - limit;

						for (let i = 0; i < toDelete; i++) {
							try {
								chatArea.removeChild(children[i]);
							} catch (err) {
								console.error("Error cleaning up chat", err);
							}
						}

						if (Chat._auto_scroll) {
							chatArea.scrollTop = chatArea.scrollHeight;
						}
					}
				}

				if (chatLength > 190000) {
					for (let i = 0; i < 3; i++) {
						try {
							chatArea.removeChild(children[i]);
						} catch (err) {
							console.error("Error cleaning up chat", err);
						}
					}
				}
			}
		}

		onPanelChanged(panelBefore, panelAfter) {
			if (onLoginLoaded) {
				if (panelBefore !== panelAfter && panelAfter === "idlepixelplus") {
					const options = document.querySelectorAll(
						"#idlepixelplus-config-ui-tweaks-font option"
					);
					if (options) {
						options.forEach(function (el) {
							const value = el.getAttribute("value");
							if (value === "IdlePixel Default") {
								el.style.fontFamily = FONT_FAMILY_DEFAULT;
							} else {
								el.style.fontFamily = value;
							}
						});
					}
				}
			}
		}

		onChat(data) {
			getThis.updateColors(CHAT_UPDATE_FILTER);
			getThis.limitChat()
		}

		onMessageReceived(data) {
			if (data.startsWith("OPEN_DIALOGUE_CALLBACK=NO TEAM") && uitSoloRaiding) {
				uitSoloRaiding = false;
				document.getElementById('modal-image-btn-primary').click();
			}
		}

		onCombatEnd() {
			getThis.updateColors(PANEL_UPDATE_FILTER);
			getThis.updateColors();
		}
	}

	const plugin = new UITweaksPlugin();
	IdlePixelPlus.registerPlugin(plugin);
})();
