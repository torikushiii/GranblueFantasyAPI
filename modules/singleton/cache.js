const Redis = require("ioredis");
const logger = require("../../lib/logger");

module.exports = class CacheSingleton extends require("./template") {
	/** @type {Redis} */
	#server = null;
	#active = false;

	/**
     * @returns {CacheSingleton}
     */
	static singleton () {
		if (!CacheSingleton.module) {
			CacheSingleton.module = new CacheSingleton();
		}

		return CacheSingleton.module;
	}

	/**
     * @hideconstructor
     */
	constructor () {
		super();

		if (app.Config.redis_configuration) {
			this.connect(app.Config.redis_configuration);
		}
		else {
			logger.warn("[CACHE] || Redis configuration not found. Cache will not be used.");
		}
	}

	connect (configuration) {
		if (this.#active) {
			throw new Error("[CACHE] || Redis connection already active");
		}
		else if (this.#server) {
			this.#server.connect();
			this.#active = true;
		}
		else if (!configuration) {
			throw new Error("[CACHE] || No configuration provided");
		}
		else if (typeof configuration !== "object") {
			throw new Error("[CACHE] || Invalid configuration provided");
		}

		this.#server = new Redis(configuration);
		this.#active = true;
	}

	disconnect () {
		if (!this.#active) {
			throw new Error("[CACHE] || Redis connection inactive");
		}
		else if (!this.#server) {
			throw new Error("[CACHE] || No Redis server instance");
		}

		this.#server.disconnect();
		this.#active = false;
	}

	async set (data = {}) {
		if (!this.#active) {
			throw new Error("[CACHE] || Redis connection inactive");
		}
		else if (typeof data.value === "undefined") {
			throw new Error("[CACHE] || No value provided");
		}

		const args = [
			CacheSingleton.resolveKey(data.key),
			JSON.stringify(data.value)
		];

		if (data.expiry && data.expiresAt) {
			throw new Error("[CACHE] || Cannot set both expiry and expiresAt");
		}

		if (data.expiry) {
			if (!app.Utils.isValidInteger(data.expiry)) {
				throw new Error("[CACHE] || Invalid expiry provided");
			}

			args.push("PX", data.expiry);
		}

		if (data.expiresAt) {
			data.expiresAt = data.expiresAt.valueOf();

			if (!app.Utils.isValidInteger(data.expiresAt)) {
				throw new Error("[CACHE] || Invalid expiresAt provided");
			}

			const now = Date.now().valueOf();
			if (now > data.expiresAt) {
				throw new Error("[CACHE] || expiresAt cannot be in the past");
			}

			args.push("PX", data.expiresAt - now);
		}

		return await this.#server.set(...args);
	}

	async get (keyIdentifier) {
		if (!this.#active) {
			throw new Error("[CACHE] || Redis connection inactive");
		}

		const key = CacheSingleton.resolveKey(keyIdentifier);
		return JSON.parse(await this.#server.get(key));
	}

	/**
     * @param {*} value
     * @returns {string}
     */
	static resolveKey (value) {
		if (value === null || typeof value === "undefined") {
			throw new Error("[CACHE] || No value provided");
		}

		if (typeof value !== "object") {
			return String(value);
		}
		else {
			throw new Error("[CACHE] || Cannot stringify object");
		}
	}

	destroy () {
		if (this.#server) {
			if (this.#active) {
				this.#server.disconnect();
				this.#active = false;
			}

			this.#server.end();
		}

		this.#server = null;
	}

	get active () { return this.#active; }

	get server () { return this.#server; }

	get modulePath () { return "cache"; }
};
