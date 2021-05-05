// This file serves as typedefinitions to make
// collaborating more efficient
// This file should only be imported by JSDOC comments

export interface IInjectedContext {
    clientUtil: IClientUtil;
    console: {
        log(...args): void;
    };
};

export interface IUserscript extends IInjectedContext {
    name?: string;
    version?: string;
    author?: string;
    description?: string;
    locations?: ("all"|"docs"|"game"|"social"|"viewer"|"editor"|"unknown")[]|string[];
    platforms?: ("all")[]|string[];
    settings?: ISettingsCollection;

    run(config: import("electron-store")): void;
};

export interface ISetting {
    id: string;
    name: string;
    info?: string;
    cat: string;
    platforms?: NodeJS.Platform[];
    type: "checkbox"|"select"|"text"|"slider"|string;
    needsRestart?: Boolean;
    html(): string;
    set?(): void;
};

export interface ISelectSetting extends ISetting {
    type: "select";
    options: {[key: Any]: string};
    val: string;
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
	setCSetting(name: string, value: Any);
    genCSettingsHTML(setting: ISetting);
	delayIDs: {[key: string]: NodeJS.Timeout};
	delaySetCSetting(name: string, target: HTMLInputElement, delay?: Number);
    searchMatches(entry: ISetting);
    genCSettingsHTML(setting: ISelectSetting|ICheckboxSetting|ISliderSetting)
	initUtil();
};
