<h1 align="center">IdlePixel Chat Highlighter</h1>

<h3 align="center"> Description</h3>

Highlights messages containing specified words, or from specified users.

<h3 align="center"> Screenshots</h3>

None

<h3 align="center"> IP+ Configs</h3>

 - None: label
   - Label: <div class="d-flex w-100"><span class="align-self-center col-6">Word Highlighting</span><span class="col-6"><button class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.highlighting.showModal('word_set')">Edit List</button></span></div>
   - Default: None

 - wordList: string
   - Label: List of trigger words (DEPRACATED! USE BUTTON INSTEAD!)
   - Default: 

 - None: label
   - Label: ------------------------------------------------------------------------------------------------
   - Default: None

 - None: label
   - Label: <div class="d-flex w-100"><span class="align-self-center col-6">Word Ignoring</span><span class="col-6"><button class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.highlighting.showModal('ignore_word_set')">Edit List</button></span></div>
   - Default: None

 - ignoreWordList: string
   - Label: List of words to ignore on trigger (DEPRACATED! USE BUTTON INSTEAD!)
   - Default: 

 - None: label
   - Label: ------------------------------------------------------------------------------------------------
   - Default: None

 - None: label
   - Label: <div class="d-flex w-100"><span class="align-self-center col-6">Player Highlighting</span><span class="col-6"><button class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.highlighting.showModal('user_set')">Edit List</button></span></div>
   - Default: None

 - friendList: string
   - Label: List of people to be highlighted (DEPRACATED! USE BUTTON INSTEAD!)
   - Default: 

 - None: label
   - Label: ------------------------------------------------------------------------------------------------
   - Default: None

 - None: label
   - Label: <div class="d-flex w-100"><span class="align-self-center col-6">Player Ignoring</span><span class="col-6"><button class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.highlighting.showModal('ignore_user_set')">Edit List</button></span></div>
   - Default: None

 - ignoreNameList: string
   - Label: List of players to ignore triggers from (DEPRACATED! USE BUTTON INSTEAD!)
   - Default: 

 - None: label
   - Label: ------------------------------------------------------------------------------------------------
   - Default: None

 - soundsEnabled: boolean
   - Label: Play a sound when being pinged?
   - Default: False

 - ignoreCase: boolean
   - Label: Ignore case-sensitivity?
   - Default: True

 - notificationsEnabled: boolean
   - Label: Enable popup notifications?
   - Default: False

 - considerSpaces: boolean
   - Label: Allow spaces in triggers?
   - Default: False

 - activeName: string
   - Label: Username for account having sound & popups (only useful if you have multiple accounts open.)
   - Default: 

 - colourWordHighlight: color
   - Label: Word highlighting colour:
   - Default: #00FF00

 - colourFriendHighlight: color
   - Label: Username highlighting colour
   - Default: #8C00FF



<h3 align="center"> Meta-data</h3>

 - Filename: chat_highlighter.js
 - Version: 2.0.0
 - Authors: Lux-Ferre
