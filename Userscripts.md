# Userscripts
- [Userscripts](#userscripts)
  - [Installation](#installation)
  - [Development](#development)
    - [Script Structure](#script-structure)
    - [Script context](#script-context)
    - [Working with Settings](#working-with-settings)
    - [Boilerplate](#boilerplate)
    - [Typedefs](#typedefs)
    - [Complete example](#complete-example)
  - [Glossary](#glossary)
    - [API-Versions](#api-versions)

## Installation
To install script you have to copy them into your scripts folder.
It can be found under `<DOCUMENTS>/idkr/scripts/`.

`<DOCUMENTS>` differs from os to os.
Under Windows this generally is under `%HOMEPATH%\Documents\`.
Under Linux it depends on your Desktop-Manager. It should be somewhere under `~/` though.

## Development
 1. [Script Structure](#script-structure)
 2. [Initializing the Script](#initializing-the-script)
 3. [Script context](#script-context)
 4. [Working with Settings](#working-with-settings)
 5. [Boilerplate](#boilerplate)
 6. [Typedefs](#typedefs)
 7. [Complete example](#complete-example)

### Script Structure
The basic script structure consists of a class which provides certain properties that help idkr to instantiate your script as needed.
Beginning with the `meta`-property, which contains metadata about the name, author, version and a small description of the script.

Example:
```javascript
this.meta = {
    name: "Hello World",
    version: "1.0a",
    author: "CreepSore",
    description: "Echos Hello World as Alert or as Console print"
};
```

One property which is even more important is the `config`-property. This property defines what [version](#api-versions) of script-api your script wants to be executed in, which settings it wants to use, and on what os-platforms the script can be executed in.

Example:
```javascript
this.config = {
    apiversion: "1.0",
    locations: ["all"],
    platforms: ["all"],
    settings: {
        outputType: {
            id: "outputType",
            name: "Output Type",
            cat: "Misc",
            type: "select",
            options: {
                alert: "Alert",
                console: "Console"
            },
            val: "alert",
            html: () => {
                return this.clientUtils.genCSettingsHTML(this.config.settings["outputType"]);
            }
        }
    }
};
```

### Script context
There are certain variables that automatically get passed into your script when the script-manager loads your script.

```javascript
const context = {
    window,                         // Current Global Window
    document,                       // Current Global Document
    clientUtils: this.clientUtils,  // Client Utilities API
    console: {                      // Re-bind console.log outside of VM
        log: (...args) => console.log(...args)
    }
};
```

### Working with Settings
As seen at the script structure explanation above, you're able to utilize krunkers settings menu for yourself. The only thing you need to do is define the settings you want to use inside `this.config.settings`, the script manager will do the rest for you.

Example:
```javascript
...

    platforms: ["all"],
    settings: {
        outputType: {
            id: "outputType",
            name: "Output Type",
            cat: "Misc",
            type: "select",
            options: {
                alert: "Alert",
                console: "Console"
            },
            val: "alert",
            html: () => {
                return this.clientUtils.genCSettingsHTML(this.config.settings["outputType"]);
            }
        }
    }
};

...

load(config) {
        let setting = config.get("outputType", "alert");

...
```

### Boilerplate
```javascript
/**
 * @typedef {import("./types").IUserscriptConfig} IUserscriptConfig
 * @typedef {import("./types").IUserscriptMeta} IUserscriptMeta
 * @typedef {import("./types").IClientUtil} IClientUtil
 */

class Userscript {
    constructor() {
        /** @type {IUserscriptMeta} */
        this.meta = {
            name: "Script",
            version: "1.0",
            author: "idkr",
            description: "Description"
        };
        /** @type {IUserscriptConfig} */
        this.config = {
            apiversion: "1.0",
            locations: ["all"],
            platforms: ["all"],
            settings: { }
        };

        /** @type {IClientUtil} */
        this.clientUtils = null;
    }

    load() {
        
    }

    unload() {
        
    }
}

// we need to return our instance to the script manager
return new Userscript();
```

### Typedefs
For the example below I used following typescript defs.
This should also give you some information how stuff works.
```typescript
export interface IUserscriptMeta {
    author?: String;
    name?: String;
    version?: String;
    description?: String;
};

export interface IUserscriptConfig {
    apiversion?: "1.0";
    locations?: ("all"|"docs"|"game"|"social"|"viewer"|"editor"|"unknown")[]|String[];
    platforms?: ("all")[]|String[];
    settings?: ISettingsCollection;
};

export interface IInjectedContext {
    clientUtils: IClientUtil;
    console: {
        log(...args): void;
    };
};

export interface IUserscript extends IInjectedContext {
    config: IUserscriptConfig;
    meta: IUserscriptMeta;
    load(config: import("electron-store")): void;
    unload(): void;
};

export interface ISetting {
    id: String;
    name: String;
    info?: String;
    cat: String;
    platforms?: NodeJS.Platform[];
    type: "checkbox"|"select"|"text"|"slider"|String;
    needsRestart?: Boolean;
    html(): String;
    set?(): void;
};

export interface ISelectSetting extends ISetting {
    type: "select";
    options: {[key: Any]: String};
    val: String;
};

export interface ICheckboxSetting extends ISetting {
    type: "checkbox";
    val: Boolean;
};

export interface ISliderSetting extends ISetting {
    type: "slider";
    max: Number;
    min: Number
    step: Number;
    val: Number;
};

interface ISettingsCollection { [key: string]: ISelectSetting|ICheckboxSetting|ISliderSetting|ISetting; }

export interface IClientUtil {
	events: import("events");
	settings: {[key: string]: ISetting};
	setCSetting(name: String, value: Any);
    genCSettingsHTML(setting: ISetting);
	delayIDs: {[key: String]: NodeJS.Timeout};
	delaySetCSetting(name: String, target: HTMLInputElement, delay?: Number);
    searchMatches(entry: ISetting);
    genCSettingsHTML(setting: ISelectSetting|ICheckboxSetting|ISliderSetting)
	initUtil();
};
```

### Complete example
The complete example script I used to write this small documentation is this one:
```javascript
/**
 * @typedef {import("./types").IUserscriptConfig} IUserscriptConfig
 * @typedef {import("./types").IUserscriptMeta} IUserscriptMeta
 * @typedef {import("./types").IClientUtil} IClientUtil
 * @typedef {import("./types").ISettingsCollection} ISettingsCollection
 */

class Userscript {
    constructor() {
        /** @type {IUserscriptMeta} */
        this.meta = {
            name: "Hello World",
            version: "1.0a",
            author: "CreepSore",
            description: "Echos Hello World as Alert or as Console print"
        };
        /** @type {IUserscriptConfig} */
        this.config = {
            apiversion: "1.0",
            locations: ["all"],
            platforms: ["all"],
            settings: {
                outputType: {
                    id: "outputType",
                    name: "Output Type",
                    cat: "Misc",
                    type: "select",
                    options: {
                        alert: "Alert",
                        document: "Document"
                    },
                    val: "alert",
                    html: () => {
                        return this.clientUtils.genCSettingsHTML(this.config.settings["outputType"]);
                    }
                }
            }
        };

        // ############################################ //
        //  Injected Properties by UserscriptInitiator  //
        // ############################################ //
        /** @type {IClientUtil} */
        this.clientUtils = null;
    }

    load(config) {
        let setting = config.get("outputType");
        switch(setting) {
            case "document":
                document.write("Hello World!");
                break;
            case "alert":
            default:
                alert("Hello World!");
                break;
        }
    }

    unload() {
        
    }
}

return new Userscript();
```

## Glossary
### API-Versions
Currently there is only one api-version available, which is version 1.0.
This may differ in future releases. We don't guarantee 100% backwards-compatibility, however using this system it shouldn't be that difficult to maintain.
