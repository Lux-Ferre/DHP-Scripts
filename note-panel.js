// ==UserScript==
// @name         IdlePixel Notes Panel
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Adds a panel for storing semi-persistant notes
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// ==/UserScript==

(function() {
    'use strict';

    class NotePanelPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("notespanel", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

    createPanel(){
            IdlePixelPlus.addPanel("notes", "Notes", function() {
                let content = `<div>`
                content += `<br/>`
                content += `<form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.notespanel.saveNotes()'>`
                content += `<textarea id="notes_box" maxlength="2000" style="width:100%;height:75%"></textarea>`
                content += `<input type="submit" value="Save">`
                content += `</form>`
                content += `</div>`
                return content
            });
        }

    onLogin(){
            const onlineCount = $(".top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.plugins.notespanel.openNotesPanel()" title="Note Taking">Notes&nbsp;&nbsp;&nbsp;</a>
            `);
            this.createPanel()
        }

    saveNotes(){
            const currentNotes = $("#notes_box").val()
        localStorage.setItem("IPNotes", currentNotes)
        }

    openNotesPanel(){
            const notes = localStorage.getItem("IPNotes")
        $("#notes_box").val(notes)
        IdlePixelPlus.setPanel('notes')
        }
    }

    const plugin = new NotePanelPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})(); 