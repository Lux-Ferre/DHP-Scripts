// ==UserScript==
// @name         IdlePixel+ Overview Panel
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Single panel to control many skills
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class OverviewPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("overview", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "colNum",
                        label: "Number of modules per row",
                        type: "integer",
                        min: 1,
                        max: 12,
                        default: 3
                    },
                    {
                        id: "farmingEnabled",
                        label: "farmingEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "gatheringEnabled",
                        label: "gatheringEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "mineralsEnabled",
                        label: "mineralsEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "woodcuttingEnabled",
                        label: "woodcuttingEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "smeltingEnabled",
                        label: "smeltingEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "cookingEnabled",
                        label: "cookingEnabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "brewingEnabled",
                        label: "brewingEnabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "fishingEnabled",
                        label: "fishingEnabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "machineryEnabled",
                        label: "machineryEnabled",
                        type: "boolean",
                        default: false
                    }
                ]
            });
            this.previous = "";
        }

        onConfigsChanged() {
            this.applyConfigs()
        }

        onLogin() {
                const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
                onlineCount.before(`
                <a href="#" class="hover float-end link-no-decoration"
                onclick="event.preventDefault(); IdlePixelPlus.setPanel('overview')"
                title="Overview">Overview&nbsp;&nbsp;&nbsp;</a>
                `);

                this.addStyles()
                this.createPanel()
                this.addBonemealbinToPanel()
                this.toggleMultiHarvest()
                this.addGatheringAreasToPanel()
                this.highlightGathering()
                this.applyConfigs()

                const standardItemBoxes = {
                    overviewLogsContainer: {
                        itemList: ["logs", "oak_logs", "willow_logs", "maple_logs", "stardust_logs", "pine_logs", "redwood_logs", "dense_logs"],
                        onClickString: "IdlePixelPlus.plugins['overview'].clicksLogs(this.getAttribute('ov-data-item'))"
                    },
                    overviewBonemealContainer: {
                        itemList: ["bones", "big_bones", "ice_bones", "blood_bones", "dragon_bones", "ashes"],
                        onClickString: "Farming.clicks_bones(this.getAttribute('ov-data-item'))"
                    },
                    overviewSeedsContainer: {
                        itemList: [
                            "dotted_green_leaf_seeds", "green_leaf_seeds", "lime_leaf_seeds", "gold_leaf_seeds",
                            "crystal_leaf_seeds", "red_mushroom_seeds", "stardust_seeds", "tree_seeds", "oak_tree_seeds",
                            "willow_tree_seeds", "maple_tree_seeds", "stardust_tree_seeds", "pine_tree_seeds", "redwood_tree_seeds",
                            "apple_tree_seeds", "banana_tree_seeds", "orange_tree_seeds", "palm_tree_seeds", "dragon_fruit_tree_seeds",
                            "bone_tree_seeds", "lava_tree_seeds", "strange_tree_seeds", "potato_seeds", "carrot_seeds", "beet_seeds", "broccoli_seeds"
                        ],
                        onClickString: "IdlePixelPlus.plugins['overview'].clicksSeeds(this.getAttribute('ov-data-item'))"
                    },
                    overviewBarsContainer: {
                        itemList: ["bronze_bar", "iron_bar", "silver_bar", "gold_bar", "promethium_bar", "titanium_bar", "ancient_bar", "dragon_bar"],
                        onClickString: "IdlePixelPlus.plugins['overview'].clicksBars(this.getAttribute('ov-data-item'))"
                    },
                    overviewOresContainer: {
                        itemList: ["stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore", "dragon_ore"],
                        onClickString: "Modals.open_stardust_or_sell_item_dialogue('mining', this.getAttribute('ov-data-item'))"
                    },
                    overviewRecipeContainer: {
                        itemList: ["dotted_salad", "chocolate_cake", "lime_leaf_salad", "golden_apple", "banana_jello", "orange_pie", "pancakes", "coconut_stew", "dragon_fruit_salad",
                                   "potato_shake", "carrot_shake", "beet_shake", "broccoli_shake"],
                        onClickString: `websocket.send('COOKS_BOOK=' + this.getAttribute('ov-data-item'))`
                    },
                    overviewGatheringBagsContainer: {
                        itemList: ["gathering_loot_bag_mines", "gathering_loot_bag_fields", "gathering_loot_bag_forest", "gathering_loot_bag_fishing_pond",
                                   "gathering_loot_bag_kitchen", "gathering_loot_bag_gem_mine", "gathering_loot_bag_castle", "gathering_loot_bag_junk"],
                        onClickString: "Modals.open_input_dialogue_with_value(this.getAttribute('ov-data-item').slice(19), 'Open', 'How many?', Items.getItem(this.getAttribute('ov-data-item')), 'OPEN_GATHERING_LOOT')"
                    },
                    overviewGemContainer: {
                        itemList: ["sapphire", "emerald", "ruby", "diamond", "blood_diamond"],
                        onClickString: ""
                    },
                    overviewSDCrystalContainer: {
                        itemList: ["small_stardust_prism", "medium_stardust_prism", "large_stardust_prism", "huge_stardust_prism"],
                        onClickString: "Modals.open_input_dialogue_with_value(this.getAttribute('ov-data-item'), 'Smash', 'How many stardust prism do you want to smash?', Items.getItem(this.getAttribute('ov-data-item')), 'SMASH_STARDUST_PRISM')"
                    },
                    overviewGeodeContainer: {
                        itemList: ["grey_geode", "blue_geode", "green_geode", "red_geode", "cyan_geode", "ancient_geode"],
                        onClickString: "Modals.open_input_dialogue_with_value(this.getAttribute('ov-data-item'), 'Open', 'How many geodes to you want to crack?', Items.getItem(this.getAttribute('ov-data-item')), 'CRACK_GEODE')"
                    },
                    overviewMineralContainer: {
                        itemList: ["blue_marble_mineral", "amethyst_mineral", "sea_crystal_mineral", "dense_marble_mineral", "fluorite_mineral", "clear_marble_mineral",
                                   "jade_mineral", "lime_quartz_mineral", "opal_mineral", "purple_quartz_mineral", "amber_mineral", "smooth_pearl_mineral",
                                   "sulfer_mineral", "topaz_mineral", "tanzanite_mineral", "magnesium_mineral", "frozen_mineral", "blood_crystal_mineral"],
                        onClickString: "Modals.clicks_mineral(this.getAttribute('ov-data-item'))"
                    }/*,
                    template: {
                        itemList: [],
                        onClickString: ""
                    }*/
                }

                for (const [containerId, itemData] of Object.entries(standardItemBoxes)) {
                    this.addStandardItemsToPanel(containerId, itemData)
                }
            }

        onMessageReceived(data) {
            if(Globals.currentPanel !== "panel-overview"){return;}
            if (data.startsWith("SET_ITEMS")){
                this.updatePanelTrees()
                this.updatePanelPlants()
                this.updatePanelCooking()
                this.updateSmeltingPanel()
           }
        }

        addStyles(){
            let borderColour

            if ("ui-tweaks" in IdlePixelPlus.plugins){
                borderColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-panels"]
            } else {
                borderColour = "black"
            }

            $("head").append(`
                    <style id="styles-overview">
                        .overviewSkillModule {
                            border-radius: 3px;
                            border-style: outset;
                        }
                        .overviewGatheringBoxArea {
                            width: 150px;
                            height: 150px;
                            border-radius: 30px;
                        }
                        .overviewGatheringBoxSelected {
                            box-shadow: 0 0 15px #80ed6f;
                        }
                        .overviewDottedBorder {
                            border-radius: 2px;
                            border: 1px dotted ${borderColour};
                        }
                    </style>
                `)
            }

        createPanel(){
                IdlePixelPlus.addPanel("overview", "Overview", function() {
                    const content = `
<div id="overviewTopLevelRow" class="row row-cols-3 d-flex flex-wrap">
    <div id="overviewFarmingModule" class="col overviewSkillModule">
        <div id="overviewBonemealContainer" class="row g-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewSeedsContainer" class="row g-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewFarmingPlotContainer" class="row farming-patches-area g-0 overviewDottedBorder">
            <div id="overviewFarmingPlot-1" class="col text-center d-flex flex-column align-items-center"><img id="overviewFarmingPatchImg-1" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Farming.clicksPlot(1)" /><label id="overviewFarmingTimer-1" class="form-label">0</label></div>
            <div id="overviewFarmingPlot-2" class="col text-center d-flex flex-column align-items-center"><img id="overviewFarmingPatchImg-2" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Farming.clicksPlot(2)" /><label id="overviewFarmingTimer-2" class="form-label">0</label></div>
            <div id="overviewFarmingPlot-3" class="col text-center d-flex flex-column align-items-center"><img id="overviewFarmingPatchImg-3" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Farming.clicksPlot(3)" /><label id="overviewFarmingTimer-3" class="form-label">0</label></div>
            <div id="overviewFarmingPlot-4" class="col text-center d-flex flex-column align-items-center"><img id="overviewFarmingPatchImg-4" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Farming.clicksPlot(4)" /><label id="overviewFarmingTimer-4" class="form-label">0</label></div>
            <div id="overviewFarmingPlot-5" class="col text-center d-flex flex-column align-items-center"><img id="overviewFarmingPatchImg-5" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Farming.clicksPlot(5)" /><label id="overviewFarmingTimer-5" class="form-label">0</label></div>
        </div>
        <div class="row">
            <div class="col text-center overviewDottedBorder"><button id="overviewHarvestAll" class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.slapchop.quickHarvest()">Harvest All</button></div>
        </div>
    </div>
    <div id="overviewGatheringModule" class="col overviewSkillModule">
        <div id="overviewGatheringBagsContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewGatheringAreasContainer" class="row gx-0 gy-2 d-flex justify-content-evenly overviewDottedBorder"></div>
    </div>
    <div id="overviewMineralModule" class="col overviewSkillModule">
        <div id="overviewGemContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewSDCrystalContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewGeodeContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewMineralContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
    </div>
    <div id="overviewWoodcuttingModule" class="col overviewSkillModule">
        <div class="row">
            <div class="col-lg-3 overviewDottedBorder">
                <div>
                    <div class="form-check"><input id="overviewUseLogsNone" class="form-check-input" type="radio" checked name="overviewUseLogsType" value="none" /><label class="form-check-label" for="overviewUseLogsNone">None</label></div>
                    <div class="form-check"><input id="overviewUseLogsHeat" class="form-check-input" type="radio" name="overviewUseLogsType" value="heat" /><label class="form-check-label" for="overviewUseLogsHeat">Heat</label></div>
                    <div class="form-check"><input id="overviewUseLogsCharcoal" class="form-check-input" type="radio" name="overviewUseLogsType" value="charcoal" /><label class="form-check-label" for="overviewUseLogsCharcoal">Charcoal</label></div>
                </div>
            </div>
            <div class="col">
                <div id="overviewLogsContainer" class="row g-0 d-flex justify-content-evenly overviewDottedBorder"></div>
            </div>
        </div>
        <div id="overviewWCPlotContainer" class="row farming-patches-area g-0 overviewDottedBorder">
            <div id="overviewWCPlot-1" class="col text-center d-flex flex-column align-items-center"><img id="overviewWoodcuttingPatchImg-1" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(1)" /><label id="overviewWoodcuttingTimer-1" class="form-label">0</label></div>
            <div id="overviewWCPlot-2" class="col text-center d-flex flex-column align-items-center"><img id="overviewWoodcuttingPatchImg-2" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(2)" /><label id="overviewWoodcuttingTimer-2" class="form-label">0</label></div>
            <div id="overviewWCPlot-3" class="col text-center d-flex flex-column align-items-center"><img id="overviewWoodcuttingPatchImg-3" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(3)" /><label id="overviewWoodcuttingTimer-3" class="form-label">0</label></div>
            <div id="overviewWCPlot-4" class="col text-center d-flex flex-column align-items-center"><img id="overviewWoodcuttingPatchImg-4" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(4)" /><label id="overviewWoodcuttingTimer-4" class="form-label">0</label></div>
            <div id="overviewWCPlot-5" class="col text-center d-flex flex-column align-items-center"><img id="overviewWoodcuttingPatchImg-5" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(5)" /><label id="overviewWoodcuttingTimer-5" class="form-label">0</label></div>
        </div>
        <div class="row">
            <div class="col text-center overviewDottedBorder"><button id="overviewChopAll" class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.slapchop.quickChop()">Chop All</button></div>
        </div>
    </div>
    <div id="overviewSmeltingModule" class="col overviewSkillModule">
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">Oil</label><label id="overviewOilNum" class="form-label">0</label></div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">Lava</label><label id="overviewLavaNum" class="form-label">0</label></div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">Buckets</label><label id="overviewBucketsNum" class="form-label">0</label></div>
                </div>
            </div>
            <div class="col text-center align-self-center"><img id="overviewFurnaceIcon" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/promethium_furnace.png" /></div>
            <div class="col">
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">Charcoal</label><label id="overviewCharcoalNum" class="form-label">0</label></div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">Plasma</label><label id="overviewPlasmaNum" class="form-label">0</label></div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-between overviewDottedBorder"><label class="form-label">D. Fire</label><label id="overviewDFireNum" class="form-label">0</label></div>
                </div>
            </div>
        </div>
        <div id="overviewBarsContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
        <div id="overviewOresContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
    </div>
    <div id="overviewCookingModule" class="col overviewSkillModule">
        <div class="row">
            <div class="col-xl-4 text-center align-self-center overviewDottedBorder"><img id="overviewCooksBookItem" style="width: 100px;height: 100px;" onclick="websocket.send(&#39;COOKS_BOOK_READY&#39;)" /></div>
            <div class="col text-center align-self-center overviewDottedBorder"><label id="overviewCooksBookTimer" class="col-form-label">0</label></div>
        </div>
        <div id="overviewRecipeContainer" class="row gx-0 d-flex justify-content-evenly overviewDottedBorder"></div>
    </div>
    <div id="overviewBrewingModule" class="col overviewSkillModule"></div>
    <div id="overviewFishingModule" class="col overviewSkillModule"></div>
    <div id="overviewMachineryModule" class="col overviewSkillModule"></div>
</div>
                    `
                    return content
                });
            }

        applyConfigs() {
            // Modules per row
            const colClass = "row-cols-" + this.getConfig("colNum")
            const topLevel = $("#overviewTopLevelRow")
    
            for(let i = 0; i <= 12 ; i++) {
                const oldClass = `row-cols-${i}`
                topLevel.removeClass(oldClass)
            }

            topLevel.addClass(colClass)

            // Enable/disable modules

            const moduleList = [
                ["farmingEnabled", "overviewFarmingModule"],
                ["gatheringEnabled", "overviewGatheringModule"],
                ["mineralsEnabled", "overviewMineralModule"],
                ["woodcuttingEnabled", "overviewWoodcuttingModule"],
                ["smeltingEnabled", "overviewSmeltingModule"],
                ["cookingEnabled", "overviewCookingModule"],
                ["brewingEnabled", "overviewBrewingModule"],
                ["fishingEnabled", "overviewFishingModule"],
                ["machineryEnabled", "overviewMachineryModule"]
            ]

            moduleList.forEach(module => {
                const moduleEnabled = this.getConfig(module[0])

                const moduleLocation = $(`#${module[1]}`)

                if (moduleEnabled){
                    moduleLocation.show()
                } else {
                    moduleLocation.hide()
                }
            })

        }

        formatTimeWithDays(timeInSecs) {
            let timerStr = "";
            const hour24 = 24 * 60 * 60;

            const timerDays = Math.floor(timeInSecs /  hour24);
            if(timeInSecs > hour24) {
                timerStr = `${timerDays}d ${format_time(timeInSecs - (timerDays * hour24))}`
            } else {
                timerStr = `${format_time(timeInSecs - (timerDays * hour24))}`
            }
            return timerStr;
       }

        getFurnace(){
            const furnaceList = ["dragon_furnace", "ancient_furnace", "titanium_furnace", "promethium_furnace", "gold_furnace",
                                 "silver_furnace", "iron_furnace", "bronze_furnace", "stone_furnace"]
            for(let i = 0; i < furnaceList.length; i++) {
                const furnace = furnaceList[i]
                if(window["var_"+furnace]){
                    return furnace
                }
            }
            return "";
        }

        addStandardItemsToPanel(containerId, itemData){
            const itemList = itemData.itemList
            const itemOnClick = itemData.onClickString

            itemList.forEach((itemType) => {
                const itemElementString = `<div class="col d-flex justify-content-center">
                                                        <itembox data-item="playtime" ov-data-item="${itemType}" id="overview-itembox-${itemType}" onclick="${itemOnClick}" class="shadow hover">
                                                            <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${itemType}.png" title="${itemType}"></div>
                                                            <div class="center mt-2"> <item-display data-format="number" data-key="${itemType}"></item-display></div>
                                                        </itembox>
                                                    </div>`
                const itemBox = $.parseHTML(itemElementString)
                $(`#${containerId}`).append(itemBox)
           })
        }

        addGatheringAreasToPanel(){
            const areaData = [
                    {
                        id: "overviewGatheringBoxMines",
                        background: "background-dark-grey",
                        image: "gathering_mine.png",
                        name: "mines"
                    },
                    {
                        id: "overviewGatheringBoxFields",
                        background: "background-dark-green",
                        image: "gathering_field.png",
                        name: "fields"
                    },
                    {
                        id: "overviewGatheringBoxForest",
                        background: "background-brown",
                        image: "gathering_forest.png",
                        name: "forest"
                    },
                    {
                        id: "overviewGatheringBoxFishingPond",
                        background: "background-dark-blue",
                        image: "gathering_fishing_pond.png",
                        name: "fishing_pond"
                    },
                    {
                        id: "overviewGatheringBoxKitchen",
                        background: "background-dark-orange",
                        image: "gathering_kitchen.png",
                        name: "kitchen"
                    },
                    {
                        id: "overviewGatheringBoxGemMine",
                        background: "background-dark-cyan",
                        image: "gathering_gem_mine.png",
                        name: "gem_mine"
                    },
                    {
                        id: "overviewGatheringBoxCastle",
                        background: "background-veryrare",
                        image: "gathering_castle.png",
                        name: "castle"
                    }
                ]
    
            areaData.forEach((area) => {
                const areaId = area.id
                const background = area.background
                const image = area.image
                const name = area.name

                const areaElementString = `<div class="col d-flex justify-content-center">
                                                        <div id="${areaId}" class="d-flex ${background} hover overviewGatheringBoxArea"
                                                             ov-data-item="${name}" onclick="IdlePixelPlus.plugins['overview'].changeGatheringArea(this.getAttribute('ov-data-item'))">
                                                            <img class="m-auto w-80 h-80" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${image}" />
                                                        </div>
                                                    </div>`
                const areaBox = $.parseHTML(areaElementString)
                $(`#overviewGatheringAreasContainer`).append(areaBox)
            })
        }
    
        addBonemealbinToPanel(){
            const binString = `
            <div class="col d-flex justify-content-center">
                <itembox data-item="playtime" ov-data-item="bonemeal_bin" class="shadow hover bone-item-box">
                    <div class="center mt-1"><img draggable="false" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/bonemeal_bin.png" title="bonemeal_bin"></div>
                    <div class="center mt-2"> <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/bonemeal_icon.png"> <item-display data-format="number" data-key="bonemeal">0</item-display></div>
                </itembox>
            </div>`

            const bonemealBox = $.parseHTML(binString)
            $("#overviewBonemealContainer").append(bonemealBox)
        }

        toggleMultiHarvest(){
                if (!("slapchop" in IdlePixelPlus.plugins)){
                    $("#overviewChopAll").hide()
                    $("#overviewHarvestAll").hide()
                }
        }

        updatePanelTrees(){
                for(let i = 1; i < 6; i++) {
                    const tree = Items.getItemString("tree_" + i);
                    const stage = Items.getItem("tree_stage_" + i);
                    const tree_time = Items.getItem("tree_timer_"+ i)
                    let time_string

                    if(tree_time===0){
                        time_string = "EMPTY"
                    } else if (tree_time===1){
                        time_string = "READY"
                    } else {
                        time_string = this.formatTimeWithDays(tree_time)
                    }

                    $(`#overviewWoodcuttingTimer-${i}`).html(time_string)

                    let img_url

                    if(tree !== "none"){
                        img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_${tree}_${stage}.png`
                    } else {
                        if(i === 4 || i === 5){
                            if(!DonorShop.has_donor_active(Items.getItem("donor_tree_patches_timestamp"))){
                                img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_locked.png`
                            } else {
                                img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png`
                            }
                        } else {
                            img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png`
                        }
                    }
                    $(`#overviewWoodcuttingPatchImg-${i}`).attr("src", img_url)
                }
        }

        updatePanelPlants(){
                for(let i = 1; i < 6; i++) {
                    const crop = Items.getItemString("farm_" + i);
                    const stage = Items.getItem("farm_stage_" + i);
                    const crop_time = Items.getItem("farm_timer_"+ i)
                    let time_string

                    if(crop_time===0){
                        time_string = "EMPTY"
                    } else if (crop_time===1){
                        time_string = "READY"
                    } else {
                        time_string = this.formatTimeWithDays(crop_time)
                    }

                    $(`#overviewFarmingTimer-${i}`).html(time_string)

                    let img_url

                    if(crop !== "none"){
                        if (Items.getItem("farm_death_" + i) === 1){
                            img_url = "https://idlepixel.s3.us-east-2.amazonaws.com/images/farming_dead_leaf.png"
                        } else {
                            img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/farming_${crop}_${stage}.png`
                        }
                    } else {
                        if(i === 4 || i === 5){
                            if(!DonorShop.has_donor_active(Items.getItem("donor_tree_patches_timestamp"))){
                                img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/farming_locked.png`
                            } else {
                                img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/farming_none.png`
                            }
                        } else {
                            img_url = `https://idlepixel.s3.us-east-2.amazonaws.com/images/farming_none.png`
                        }
                    }
                    $(`#overviewFarmingPatchImg-${i}`).attr("src", img_url)
                }
            }
        
        updatePanelCooking() {
            let current_item = IdlePixelPlus.getVarOrDefault("cooks_book_item", "cooks_book", "string")
            if (current_item === "none"){current_item="cooks_book"}

            const current_time = IdlePixelPlus.getVarOrDefault("cooks_book_timer", 0, "int")
            let formatted_time
            if (current_time<=1){
                formatted_time = "Completed."
            } else {
                formatted_time = this.formatTimeWithDays(current_time)
            }

            $("#overviewCooksBookItem").attr("src", `https://d1xsc8x7nc5q8t.cloudfront.net/images/${current_item}.png`)
            $("#overviewCooksBookTimer").html(`${formatted_time}`)
        }

        updateSmeltingPanel(){
            /*oil, lava, buckets, coal, plasma, fire, furnace, bar_click*/
            const oilNum = IdlePixelPlus.getVarOrDefault("oil", 0, "int")
            const lavaNum = IdlePixelPlus.getVarOrDefault("lava", 0, "int")
            const bucketsNum = IdlePixelPlus.getVarOrDefault("iron_bucket", 0, "int")
            const charcoalNum = IdlePixelPlus.getVarOrDefault("charcoal", 0, "int")
            const plasmaNum = IdlePixelPlus.getVarOrDefault("plasma", 0, "int")
            const dFireNum = IdlePixelPlus.getVarOrDefault("dragon_fire", 0, "int")

            const furnaceType = this.getFurnace()

            $("#overviewOilNum").html(oilNum)
            $("#overviewLavaNum").html(lavaNum)
            $("#overviewBucketsNum").html(bucketsNum)
            $("#overviewCharcoalNum").html(charcoalNum)
            $("#overviewPlasmaNum").html(plasmaNum)
            $("#overviewDFNum").html(dFireNum)

            $("#overviewFurnaceIcon").attr("src", `https://idlepixel.s3.us-east-2.amazonaws.com/images/${furnaceType}.png`)
        }

        clicksLogs(logType){
            const action = $('input[name=overviewUseLogsType]:checked').val();
            if (action === "none") {return;}
            if (action === "heat"){
                Modals.clicks_oven_log(logType)
            } else if (action === "charcoal"){
                if ("slapchop" in IdlePixelPlus.plugins){
                    IdlePixelPlus.plugins.slapchop.quickFoundry(logType)
                } else {
                    Modals.open_foundry_clicks_log(logType)
                }
            }
        }

        clicksSeeds(seedType){
            if ("slapchop" in IdlePixelPlus.plugins){
                IdlePixelPlus.plugins.slapchop.quickPlant(seedType, "altKey")
            } else {
                Farming.clicks_seed(seedType)
            }
        }

        clicksBars(barType){
            const oreBarMap = {
                bronze_bar: "copper",
                iron_bar: "iron",
                silver_bar: "silver",
                gold_bar: "gold",
                promethium_bar: "promethium",
                titanium_bar: "titanium",
                ancient_bar: "ancient_ore",
                dragon_bar: "dragon_ore"
            }
            if ("slapchop" in IdlePixelPlus.plugins){
                IdlePixelPlus.plugins.slapchop.quickSmelt(oreBarMap[barType])
            } else {
                Modals.open_stardust_or_sell_item_dialogue('crafting', barType)
            }
        }

        highlightGathering(){
            this.gatheringMap = {
                mines: "overviewGatheringBoxMines",
                fields: "overviewGatheringBoxFields",
                forest: "overviewGatheringBoxForest",
                fishing_pond: "overviewGatheringBoxFishingPond",
                kitchen: "overviewGatheringBoxKitchen",
                gem_mine: "overviewGatheringBoxGemMine",
                castle: "overviewGatheringBoxCastle",
                none: "none"
            }

            const currentArea = IdlePixelPlus.getVarOrDefault("current_gathering_area", "none", "string")
            const areaId = this.gatheringMap[currentArea]

            this.selectedGatheringArea = areaId

            $(`#${areaId}`).addClass("overviewGatheringBoxSelected")
        }

        changeGatheringArea(newArea){
            websocket.send("GATHERING=" + newArea);
            const newAreaId = this.gatheringMap[newArea]

            const previousArea = this.selectedGatheringArea
            $(`#${previousArea}`).removeClass("overviewGatheringBoxSelected")

            $(`#${newAreaId}`).addClass("overviewGatheringBoxSelected")
            this.selectedGatheringArea = newAreaId
        }
    }

    const plugin = new OverviewPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
