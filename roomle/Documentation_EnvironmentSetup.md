# Environment Setup for Scripting Roomle Content

This document will guide you to setup your environment for effective scripting of Roomle content.

If you find any inaccuracies in this document, something is not working or you had a problem you needed to solve, please, don't hesitate to tell us!

## Visual Studio Code

VS Code a modern, open-source and extendable code editor, which actually has only litte in common with Visual Studio (which is an IDE). We recommend this as the main scripting tool because of the extensibility and because we have prepared code snippets and has essential extensions avalable. If you prefer something else, feel free, but we might not be able to help you with some specifics.

You can get VS Code here: https://code.visualstudio.com/

Please, always open the same working folder so that we keep our offline loader snippets (explained further) unified for use by everybody involved.

Purpose of this document is not to give you a manual for VS Code, so shortly, as opposed to other editors: Everything you do in VS Code is a *command*, where not all *commands* have UI features like buttons etc. To start typing a command, press Ctrl+Shift+P or Cmd+Shit+P to invoke the *Command Palette*.

### VS Code Extensions

There is an extension menu in VS Code. In the black left bar, it is the squarish button, 5th from top. We recommend installing and using following extensions:

* Prettify JSON https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json - a code formatter for JSON, usage is by running the `Prettify JSON` command.

* highlight-words https://marketplace.visualstudio.com/items?itemName=rsbondi.highlight-words - keyword highlighter. Allows you to select a piece of text and have all its occurences highlighted. Usage: commands containing `Highlight`.

* Live Server https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer - you will need to load components from hard drive as described in further chapters.

* **VS Code Extension: Roomle Json Formatter** - our extension, which currently is not in the marketplace. Please, download it from the plugins folder in this repository. Currently in new version 0.3.3, which formats scripts and helps you with discovering some errors. For further documentation, please see it's readme.
** IMPORTANT: ** If you update from a version lower than 0.3.2, you must uninstall the old plugin first.

## Code Snippets

Code snippets are pre-scribed pieces of code that will help you with writing the code. If you start writing and your last word matches the snippet identifier, it will allow you to autofill the snippet by selecting the snippet with up/down arrow keys and pressing the Enter/Return key. The snippets can have predefined positions where you can go to the next prefilled value with the Tab key - you can see them as greyed out.

We have prepared code snippets for the *Component* and *Configuration* JSON structure, all the identifiers start with *roomle* - if you start typing *roomle*, *parameter* or *component*, it will offer you to use the code snippets, pre-scribing the code for you. Sometimes, the snippets have marked positions for the cursor with default values, through which you can cycle with the Tab key.

### Code Snippets Installation:

Open file with snippets:

In VS Code open the *Command Pallete* (Ctrl+Shift+P or Cmd+Shit+P), start typing *snippets* and soon you should be able to select *Preferences: Configure User Snippets*. Then, select *json.json* file, containing snippets for Json files. You can overwrite this file with the snippets file or add our snippets to yours. The snippets will start working after you save this file.

## JSON schema

JSON schema will provide you with code completion and validation of the *Component's* JSON structure. To use the schema, run the *Preferences: Open Settings (JSON)* command and add following JSON entry:

~~~~
"json.schemas": [
    {
        "fileMatch": [
            "*.json"
        ],
        "url": "https://www.roomle.com/e/roomle.schema.json"
    }
]
~~~~

You can also apply the JSON schema for a specific folder only, the you do: `"fileMatch": ["C:/somepath/*.json"]` instead.

Note that the shcema needs valid JSON to work, and you invalidate JSON by using a newline in a value. To solve this, see next chapter.

## VS Code Extension: JSON Multiline Escaper & UnEscaper

We do not have a RoomleScript prettyfier (yet), but to prettify the JSON structure, you need first to make it valid. Run either of these commands:

 `Escape Multiline JSON values` or `UnEscape Multiline JSON values`

 One will replace endlines in values with /n and the other back. This will validate the JSON. It does not matter whether you use the scripts in escaped or unespaced form, as the database and kernel will read it correctly.

When you are in Escaped mode, you can run code prettyfing, sorting etc. When you need write scripts, run UnEscape.

To get the extension, download the latest VSIX file in the plugins folder and run command *Extensions: Install from VSIX* and select the downloaded file. The extension will appear between the VS Code extensions.

## Loading Component Definitions from Local Drive

To speed up the component testing process, you can load the components form the hardrive with one click. It needs some preparations, though. We will be using the Chrome Browser, where we open the console. Internet browsers usually do not have access to local files for security reasons, so we need to run a local http server that will provide access to the file system.

**1. Run Local Http Server**
If you do not have any, best install the *Live Server* extension. Open your working directory (this is important) in VS Code and run *Live Server: Open with Live Server*. It will open a browser page displaying files you have in the working order.

**2. Navigate to the High Speed Configurator Test Site**
Ih Chrome, open https://alpha.roomle.com/t/configurator-testing/

**3. Open Chrome Development Console** With the Ctrl+Alt+I or Cmd+Option+J, you will get to Chrome developer view (where you also see the kernel output console, which we recommend having always open in the configurator). Navigate to Sources > Snippets in the developer tab. The snippets must be unfolded in the left part of the menu. Press the new snippet button and insert code from the file /Resources/Snippets/Chrome_LoadLocalComponents.js.

It will look like this:
![](images/envSetup_chromeConsole.png)

You can save snippets for each project you will be working in order to quickly switch between the projects.

**3. Add component file paths** Insert the components of your project you want to load. They need to have address somewhere in the HTTP server (that's why it was important to open a working folder in VS Code - supposing you are using Live Server) - they will start with the URL of the local server. The file names are in apostrophes and divided by a comma, last entry can not end with a comma.

NOTE: If you are not sure, you can copy the links from the page that showed up in your broswser when you had started the Live Server.

**4. Navigate to the test site and run the snippet** Navigate to the [Alpha configurator test site](https://alpha.roomle.com/t/configurator-testing/), run the script by pressing the play button in the bottom right corner of the code view (at the bottom right corner in the image above). It will load the components from the files and will run the last component in the list.

Advanced: Notice the argument of the loadConfiguration function at the end of the script. You can change it to any inline configuration JSON (identical to item definition) or componentId, like:
`RoomleConfigurator.loadConfiguration('{"componentId":"someCatalogue:someComponent","parameters":{"someKey":"someValue"}}');`

NOTE: It is better to **refresh the whole page before reloading** the scripts. If you are not sure the component updated, check caching of the http server or restart the server (*Live Server: Stop Live Server* command).