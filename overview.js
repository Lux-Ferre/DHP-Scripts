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
                        id: "template",
                        label: "template",
                        type: "string",
                        max: 2000,
                        default: ""
                    }
                ]
            });
            this.previous = "";
        }

    onConfigsChanged() { }
    
    onLogin() {
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration"
            onclick="event.preventDefault(); IdlePixelPlus.setPanel('overview')"
            title="Overview">Overview&nbsp;&nbsp;&nbsp;</a>
            `);
            
            const standardItemBoxes = {
                overviewLogsContainer: {
                    itemList: ["logs", "oak_logs", "willow_logs", "maple_logs", "stardust_logs", "pine_logs", "redwood_logs", "dense_logs"],
                    onClick: ""
                },
                overviewBonemealContainer: {
                    itemList: ["bones", "big_bones", "ice_bones", "blood_bones", "dragon_bones", "ashes"],
                    onclick: "Farming.clicks_bones(this.getAttribute('data-item'))"
                },
                overviewSeedsContainer: {
                    itemList: [
                        "dotted_green_leaf_seeds", "green_leaf_seeds", "lime_leaf_seeds", "gold_leaf_seeds",
                        "crystal_leaf_seeds", "red_mushroom_seeds", "stardust_seeds", "tree_seeds", "oak_tree_seeds",
                        "willow_tree_seeds", "maple_tree_seeds", "stardust_tree_seeds", "pine_tree_seeds", "redwood_tree_seeds",
                        "apple_tree_seeds", "banana_tree_seeds", "orange_tree_seeds", "palm_tree_seeds", "dragon_fruit_tree_seeds",
                        "bone_tree_seeds", "lava_tree_seeds", "strange_tree_seeds", "potato_seeds", "carrot_seeds", "beet_seeds", "broccoli_seeds"
                    ],
                    onclick: ""
                },
                overviewBarsContainer: {
                    itemList: ["bronze_bar", "iron_bar", "silver_bar", "gold_bar", "promethium_bar", "titanium_bar", "ancient_bar", "dragon_bar"],
                    onclick: ""
                },
                overviewOresContainer: {
                    itemList: ["stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore", "dragon_ore"],
                    onclick: "Modals.open_stardust_or_sell_item_dialogue('mining', this.getAttribute('data-item'))"
                },
                overviewRecipeContainer: {
                    itemList: ["dotted_salad", "chocolate_cake", "lime_leaf_salad", "golden_apple", "banana_jello", "orange_pie", "pancakes", "coconut_stew", "dragon_fruit_salad", "potato_shake", "carrot_shake", "beet_shake", "broccoli_shake"],
                    onclick: 'websocket.send("COOKS_BOOK=${recipe_type}")'
                },
                template: {
                    itemList: [],
                    onclick: ""
                }
                
            }
            this.createPanel()
            this.addLogsToPanel()
            this.addBonesToPanel()
            this.addSeedsToPanel()
            this.addBarsToPanel()
            this.addOresToPanel()
            this.addCookingToPanel()
        }
    
    onMessageReceived(data) {
        if (data.startsWith("SET_ITEMS")){
            this.updatePanelTrees()
            this.updatePanelPlants()
            this.updatePanelCooking()
       }
    }

    createPanel(){
            IdlePixelPlus.addPanel("overview", "Overview", function() {
                const content = `
<div id="overviewTopLevelRow" class="row row-cols-3 d-flex flex-wrap">
    <div id="overviewWoodcuttingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;">
        <div class="row">
            <div class="col-lg-3">
                <div>
                    <div class="form-check"><input id="overviewUseLogsNone" class="form-check-input" type="radio" checked name="overviewUseLogsType" value="none" /><label class="form-check-label" for="overviewUseLogsNone">None</label></div>
                    <div class="form-check"><input id="overviewUseLogsHeat" class="form-check-input" type="radio" name="overviewUseLogsType" value="heat" /><label class="form-check-label" for="overviewUseLogsHeat">Heat</label></div>
                    <div class="form-check"><input id="overviewUseLogsCharcoal" class="form-check-input" type="radio" name="overviewUseLogsType" value="charcoal" /><label class="form-check-label" for="overviewUseLogsCharcoal">Charcoal</label></div>
                </div>
            </div>
            <div class="col">
                <div id="overviewLogsContainer" class="row g-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);width: 100%;"></div>
            </div>
        </div>
        <div id="overviewWCPlotContainer" class="row farming-patches-area g-0" style="border-width: 1px;border-color: var(--bs-secondary);border-radius: 2px;">
            <div id="overviewWCPlot-1" class="col"><img id="overviewWoodcuttingPatchImg-1" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(1)" /></div>
            <div id="overviewWCPlot-2" class="col"><img id="overviewWoodcuttingPatchImg-2" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(2)" /></div>
            <div id="overviewWCPlot-3" class="col"><img id="overviewWoodcuttingPatchImg-3" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(3)" /></div>
            <div id="overviewWCPlot-4" class="col"><img id="overviewWoodcuttingPatchImg-4" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(4)" /></div>
            <div id="overviewWCPlot-5" class="col"><img id="overviewWoodcuttingPatchImg-5" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" onclick="Woodcutting.clicksPlot(5)" /></div>
        </div>
        <div class="row">
            <div class="col text-center" style="border: 1px dotted var(--bs-secondary);border-radius: 2px;"><button id="overviewChopAll" class="btn btn-primary" type="button">Chop All</button></div>
        </div>
    </div>
    <div id="overviewFarmingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;">
        <div id="overviewBonemealContainer" class="row g-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);width: 100%;"></div>
        <div id="overviewSeedsContainer" class="row g-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);width: 100%;"></div>
        <div id="overviewFarmingPlotContainer" class="row farming-patches-area g-0" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);">
            <div id="overviewFarmingPlot-1" class="col"><img id="overviewFarmingPatchImg-1" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" /></div>
            <div id="overviewFarmingPlot-2" class="col"><img id="overviewFarmingPatchImg-2" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" /></div>
            <div id="overviewFarmingPlot-3" class="col"><img id="overviewFarmingPatchImg-3" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" /></div>
            <div id="overviewFarmingPlot-4" class="col"><img id="overviewFarmingPatchImg-4" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" /></div>
            <div id="overviewFarmingPlot-5" class="col"><img id="overviewFarmingPatchImg-5" class="farming-patch" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/woodcutting_none.png" width="75" /></div>
        </div>
        <div class="row">
            <div class="col text-center" style="border: 1px dotted var(--bs-secondary);border-radius: 2px;"><button id="overviewHarvestAll" class="btn btn-primary" type="button">Harvest All</button></div>
        </div>
    </div>
    <div id="overviewSmeltingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;">
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col"><label class="col-form-label">Oil</label></div>
                </div>
                <div class="row">
                    <div class="col"><label class="col-form-label">Lava</label></div>
                </div>
                <div class="row">
                    <div class="col"><label class="col-form-label">Buckets</label></div>
                </div>
            </div>
            <div class="col text-center align-self-center"><img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/promethium_furnace.png" /></div>
            <div class="col">
                <div class="row">
                    <div class="col"><label class="col-form-label">Charcoal</label></div>
                </div>
                <div class="row">
                    <div class="col"><label class="col-form-label">Plasma</label></div>
                </div>
                <div class="row">
                    <div class="col"><label class="col-form-label">D. Fire</label></div>
                </div>
            </div>
        </div>
        <div id="overviewBarsContainer" class="row g-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);width: 100%;"></div>
        <div id="overviewOresContainer" class="row g-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);width: 100%;"></div>
    </div>
    <div id="overviewCookingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;">
        <div class="row">
            <div class="col" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);"><img id="overviewCooksBookItem" /></div>
            <div class="col" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);"><label id="overviewCooksBookTimer" class="col-form-label">0</label></div>
        </div>
        <div id="overviewRecipeContainer" class="row gx-0 d-flex justify-content-evenly" style="border-radius: 2px;border: 1px dotted var(--bs-secondary);"></div>
    </div>
    <div id="overviewGatheringModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;"></div>
    <div id="overviewMineralModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;"></div>
    <div id="overviewBrewingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;"></div>
    <div id="overviewFishingModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;"></div>
    <div id="overviewMachineryModule" class="col overviewSkillModule" style="border-radius: 3px;border-style: outset;"></div>
</div>
                `
                return content
            });
        }

    
    addStandardItemsToPanel(containerId, itemList){
        itemList.forEach(itemType => {
            const itemElementString = `<div class="col">
                                                    <itembox data-item="playtime" ov-data-item="${itemType}" id="overview-itembox-${itemType}" onclick="" class="shadow hover">
                                                        <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${itemType}.png" title="${itemType}"></div>
                                                        <div class="center mt-2"> <item-display data-format="number" data-key="${itemType}"></item-display></div>
                                                    </itembox>
                                                </div>`
            const itemBox = $.parseHTML(itemElementString)
            $(`#${containerId}`).append(itemBox)
       })
    }
    
    addLogsToPanel(){
        const logList = ["logs", "oak_logs", "willow_logs", "maple_logs", "stardust_logs", "pine_logs", "redwood_logs", "dense_logs"]

        logList.forEach(logType => {
            if(IdlePixelPlus.getVarOrDefault(logType, 0, "int") < 1){return;}
            const logElementString = `<div class="col">
                                          <itembox data-item="${logType}" id="overview-itembox-${logType}" onclick="" class="shadow hover">
                                            <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${logType}.png" title="${logType}"></div>
                                            <div class="center mt-2"> <item-display data-format="number" data-key="${logType}"></item-display></div>
                                          </itembox>
                                        </div>
                `
            const logBox = $.parseHTML(logElementString)
            $("#overviewLogsContainer").append(logBox)
        })
    }
    
    addBonesToPanel(){
        const boneList = ["bones", "big_bones", "ice_bones", "blood_bones", "dragon_bones", "ashes"]
        
        const binString = `
        <div class="col">
            <itembox data-item="bonemeal_bin" class="shadow hover bone-item-box">
                <div class="center mt-1"><img draggable="false" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/bonemeal_bin.png" title="bonemeal_bin"></div>
                <div class="center mt-2"> <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/bonemeal_icon.png"> <item-display data-format="number" data-key="bonemeal">5</item-display></div>
            </itembox>
        </div>`

        const bonemealBox = $.parseHTML(binString)
        $("#overviewBonemealContainer").append(bonemealBox)
        
        boneList.forEach(boneType => {
            if(IdlePixelPlus.getVarOrDefault(boneType, 0, "int") < 1){return;}
            const boneElementString = `
            <div class="col">
                <itembox data-item="${boneType}" onclick="Farming.clicks_bones(this.getAttribute('data-item'))" class="shadow hover bone-item-box">
                    <div class="center mt-1"><img draggable="false" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${boneType}.png"></div>
                    <div class="center mt-2"> <item-display data-format="number" data-key="${boneType}"></item-display></div>
                </itembox>
            </div>`
            
            const boneBox = $.parseHTML(boneElementString)
            
            $("#overviewBonemealContainer").append(boneBox)
        })
    }

    updatePanelTrees(){
            for(let i = 1; i < 6; i++) {
                const tree = Items.getItemString("tree_" + i);
                const stage = Items.getItem("tree_stage_" + i);

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
    
    addSeedsToPanel(){
        const seedList = [
                "dotted_green_leaf_seeds", "green_leaf_seeds", "lime_leaf_seeds", "gold_leaf_seeds",
                "crystal_leaf_seeds", "red_mushroom_seeds", "stardust_seeds", "tree_seeds", "oak_tree_seeds",
                "willow_tree_seeds", "maple_tree_seeds", "stardust_tree_seeds", "pine_tree_seeds", "redwood_tree_seeds",
                "apple_tree_seeds", "banana_tree_seeds", "orange_tree_seeds", "palm_tree_seeds", "dragon_fruit_tree_seeds",
                "bone_tree_seeds", "lava_tree_seeds", "strange_tree_seeds", "potato_seeds", "carrot_seeds", "beet_seeds", "broccoli_seeds"
        ]
        
        seedList.forEach(seed => {
            const seedCount = IdlePixelPlus.getVarOrDefault(seed, 0, "int")
            if (seedCount < 1){return;}
            const seedElementString = `
                <div class="col">
                    <itembox draggable="false" data-item="${seed}" class="shadow hover itembox-resource-farming-1">
                        <div class="center mt-1"><img draggable="false" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${seed}.png"></div>
                        <div class="center mt-2"> <item-display data-format="number" data-key="${seed}"></item-display></div>
                    </itembox>
                </div>                                                                                                             
            `
            const seedBoxElement = $.parseHTML(seedElementString)
            
            $("#overviewSeedsContainer").append(seedBoxElement)
        })
   }
    
    addBarsToPanel(){
        const barList = ["bronze_bar", "iron_bar", "silver_bar", "gold_bar", "promethium_bar", "titanium_bar", "ancient_bar", "dragon_bar"]

        barList.forEach(barType => {
            if(IdlePixelPlus.getVarOrDefault(barType, 0, "int") < 1){return;}
            const barElementString = ` <div class="col">
                                                    <itembox data-item="${barType}" id="overview-itembox-${barType}" onclick="" class="shadow hover">
                                                        <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${barType}.png" title="${barType}"></div>
                                                        <div class="center mt-2"> <item-display data-format="number" data-key="${barType}"></item-display></div>
                                                    </itembox>
                                                </div>
                `
            const barBox = $.parseHTML(barElementString)
            $("#overviewBarsContainer").append(barBox)
        })
    }
    
    addOresToPanel(){
        const oreList = ["stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore", "dragon_ore"]

        oreList.forEach(oreType => {
            if(IdlePixelPlus.getVarOrDefault(oreType, 0, "int") < 1){return;}
            const oreElementString = ` <div class="col">
                                                    <itembox data-item="${oreType}" id="overview-itembox-${oreType}" onclick="Modals.open_stardust_or_sell_item_dialogue('mining', this.getAttribute('data-item'))" class="shadow hover">
                                                        <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${oreType}.png" title="${oreType}"></div>
                                                        <div class="center mt-2"> <item-display data-format="number" data-key="${oreType}"></item-display></div>
                                                    </itembox>
                                                </div>
                `
            const oreBox = $.parseHTML(oreElementString)
            $("#overviewOresContainer").append(oreBox)
        })
    }
    
    addCookingToPanel(){
        const recipeList = ["dotted_salad", "chocolate_cake", "lime_leaf_salad", "golden_apple", "banana_jello", "orange_pie", "pancakes", "coconut_stew", "dragon_fruit_salad", "potato_shake", "carrot_shake", "beet_shake", "broccoli_shake"]

        recipeList.forEach(recipeType => {
            const recipeElementString = ` <div class="col">
                                                    <itembox data-item="playtime" id="overview-itembox-${recipeType}" onclick="websocket.send("COOKS_BOOK=${recipe_type}")" class="shadow hover">
                                                        <div class="center mt-1"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${recipeType}.png" title="${recipeType}"></div>
                                                        <div class="center mt-2"> <item-display data-format="number" data-key="${recipeType}"></item-display></div>
                                                    </itembox>
                                                </div>
                `
            const recipeBox = $.parseHTML(recipeElementString)
            $("#overviewRecipeContainer").append(recipeBox)
        })
        }
    
    updatePanelCooking() {
        const current_item = IdlePixelPlus.getVarOrDefault("cooks_book_item", "cooks_book", "string")
        const current_time = IdlePixelPlus.getVarOrDefault("cooks_book_timer", 0, "int")
        
        $("#overviewCooksBookItem").attr("src", `https://d1xsc8x7nc5q8t.cloudfront.net/images/${current_item}.png`)
        $("#overviewCooksBookTimer").html(`${current_time}`)
    }
    
}
    
    
    

    const plugin = new OverviewPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
