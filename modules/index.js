const logger = require("../lib/logger");

module.exports = (async function (options = {}) {
	/**
     * Global namespace
     * @namespace
     * @type {Object}
     */
	globalThis.app = {
		internal: {}
	};

	const files = [
		"internal/player",
		"internal/account",
		"internal/gacha",

		"singleton/utils",
		"singleton/cache",
		"singleton/query"

		// "classes/character",
		// "classes/summon",
		// "classes/weapon"
	];

	const {
		whitelist,
		skip = []
	} = options;

	const gotInstance = await import("got");
	app.Config = require("./config");
	app.Got = gotInstance.default;

	console.log("Loading GranblueFantasy module");

	for (const file of files) {
		if (whitelist && !whitelist.includes(file)) {
			continue;
		}

		logger.info(`[LOADER] || Loading ${file}`);
		const start = process.hrtime.bigint();
        
		const [type, moduleName] = file.split("/");
		if (type === "singleton") {
			switch (moduleName) {
				case "cache": {
					const Component = require("./singleton/cache");
					app.Cache = Component.singleton();
					break;
				}

				case "utils": {
					const Component = require("./singleton/utils");
					app.Utils = Component.singleton();
					break;
				}

				case "query": {
					const Component = require("./singleton/query");
					app.Query = Component.singleton().client;
					break;
				}
			}
		}
		else if (type === "internal") {
			switch (moduleName) {
				case "player": {
					const Component = require("./internal/player");
					app.internal.Player = Component.singleton();
					break;
				}

				case "account": {
					const Component = require("./internal/account");
					app.internal.Account = Component.singleton();
					break;
				}

				case "gacha": {
					const Component = require("./internal/gacha");
					app.internal.Gacha = Component.singleton();
					break;
				}
			}
		}
		else if (type === "classes") {
			const component = require(`./${file}`);
			if (skip.includes(file)) {
				app[component.name] = component;
			}
			else {
				app[component.name] = await component.initialize();
			}
		}

		const end = process.hrtime.bigint();
		logger.warn(`[LOADER] || ${moduleName} loaded in ${Number(end - start) / 1e6}ms`);
	}
});
