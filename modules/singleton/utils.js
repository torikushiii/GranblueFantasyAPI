module.exports = class UtilsSingleton extends require("./template") {
	static version = null;
	static versionExpiration = 300_000;
	// eslint-disable-next-line no-return-assign
	static versionInternal = setInterval(() => UtilsSingleton.version = null, UtilsSingleton.versionExpiration);

	/**
     * @inheritdoc
     * @returns {UtilsSingleton}
     */
	static singleton () {
		if (!UtilsSingleton.module) {
			UtilsSingleton.module = new UtilsSingleton();
		}

		return UtilsSingleton.module;
	}

	async getVersion () {
		if (UtilsSingleton.version) {
			return {
				error: false,
				build: UtilsSingleton.version
			};
		}

		const { statusCode, body } = await app.Got({
			url: "http://game.granbluefantasy.jp/",
			responseType: "text",
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
				"Accept-Language": "en",
				"Accept-Encoding": "gzip, deflate",
				Host: "game.granbluefantasy.jp",
				Connection: "close"
			}
		});

		if (statusCode !== 200) {
			return {
				error: true,
				statusCode
			};
		}

		const version = body.match(/Game\.version = "(\d+)";/);
		if (!version) {
			return {
				error: true,
				message: "version-not-found"
			};
		}

		UtilsSingleton.version = version[1];

		return {
			error: false,
			build: version[1]
		};
	}

	isValidInteger (input, minLimit = 0) {
		if (typeof input !== "number") {
			return false;
		}

		return Boolean(Number.isFinite(input) && Math.trunc(input) === input && input >= minLimit);
	}

	removeHTML (string) {
		return string.replace(/<\s*br.*?>/g, "\n").replace(/<(.*?)>/g, "");
	}

	cheerio (html) {
		const cheerio = require("cheerio");
		return cheerio.load(html);
	}
};
