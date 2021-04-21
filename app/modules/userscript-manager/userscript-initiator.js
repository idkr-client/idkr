"use strict";

let fs = require("fs");
let path = require("path");

let userscriptsDirConfig = config.get("userscriptsPath", "");
let scriptsPath = isValidPath(userscriptsDirConfig) ? userscriptsDirConfig : path.join(documentsPath, "idkr/scripts");
try {
	fs.readdirSync(scriptsPath).filter(filename => path.extname(filename).toLowerCase() === ".js").forEach(filename => {
		try {
			let script = new Userscript(require(path.join(scriptsPath, filename)));
			if (!script.isLocationMatching()){
				console.log(`[USH] Ignored, location not matching: ${script.name}`);
			}
			else if (!script.isPlatformMatching()){
				console.log(`[USH] Ignored, platform not matching: ${script.name}`);
			}
			else {
				if (script.settings){
					Object.assign(window._clientUtil.settings, script.settings);
				}
				if (script.run){
					script.run(config);
				}
				console.log(`[USH] Loaded userscript: ${script.name} by ${script.author}`);
			}
		}
		catch (err){
			console.error("[USH] Failed to load userscript:", err);
		}
	});
}
catch (err){
	console.error("[USH] Failed to load scripts:", err);
}
