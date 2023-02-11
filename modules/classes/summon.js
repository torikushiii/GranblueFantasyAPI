module.exports = class Summon extends require("./template") {
	static data = new Map();

	constructor (data) {
		super();

		/**
         * Represents the summon's ID
         * @type {Number}
         */
		this.id = Number(data.id);

		/**
         * Represents the summon's name
         * @type {String}
         */
		this.name = data.name;

		/**
         * Represents the summon's series type
         * @type {String}
         */
		this.series = data.series_name ?? null;

		/**
         * Represents the summon's max level
         * @type {Number}
         */
		this.maxLevel = Number(data.max_level);

		/**
         * Represents the summon's rarity
         * @type {String}
         */
		this.rarity = data.rarity_name;

		/**
         * Represents the summon's HP
         * @type {Number}
         */
		this.hp = Number(data.max_hp);

		/**
         * Represents the summon's ATK
         * @type {Number}
         */
		this.atk = Number(data.max_attack);

		/**
         * Represents the summon's element
         * @type {Number}
         */
		this.element = Summon.element(Number(data.attribute));

		/**
         * Represents the summon's ability skills
         * @type {Object[]}
         */
		this.call = Summon.parseCall(data.special_skill) || [];

		/**
         * Represents the summon's aura skills
         * @type {Object[]}
         */
		this.aura = Summon.parseAura(data) || [];

		/**
         * Represents the summon's voice actor
         * @type {String}
         */
		this.voiceActor = data.voice_acter || "???";
	}

	static loadData () {
		/** @type {Map<Number, Summon>} */
		Summon.data = Summon.data || new Map();
	}

	static async get (target, options = {}) {
		if (target instanceof Summon) {
			return target;
		}
		else if (typeof target === "number") {
			const mapCache = Summon.getByProperty("id", target);
			if (mapCache) {
				return mapCache;
			}

			const summon = await app.Query.collection("summon_data").findOne({ id: target });
			if (!summon) {
				return Summon.get(String(target), { force: true });
			}

			return Summon.get(summon, options);
		}
		else if (typeof target === "string") {
			const mapCache = Summon.data.get(target);
			if (mapCache) {
				return mapCache;
			}

			if (app.Cache && app.Cache.active) {
				const redisCache = await app.Cache.get(`summon-${target}`);
				if (redisCache) {
					const summon = new Summon(redisCache);
					Summon.data.set(target, summon);

					return summon;
				}
			}

			const dbSummonData = await app.Query.collection("summon_data")
				.findOne({ $or: [
					{ id: target },
					{ name: target }
					// eslint-disable-next-line object-curly-spacing
				] });
			
			let summonData;
			if (dbSummonData) {
				summonData = new Summon(dbSummonData);

				await this.populateCaches(dbSummonData);

				return summonData;
			}
			else if (options.force) {
				const fetchData = await app.internal.Summon.get(target, { id: true });
				if (!fetchData) {
					return null;
				}

				summonData = new Summon(fetchData);

				await app.Query.collection("summon_data").insertOne(fetchData);
				await this.populateCaches(fetchData);

				return summonData;
			}
			else {
				return null;
			}
		}
	}

	static async populateCaches (summonData) {
		if (!Summon.data.has(summonData.id)) {
			Summon.data.set(summonData.id, summonData);
		}

		if (app.Cache && app.Cache.active) {
			await app.Cache.set({
				key: `summon-${summonData.id}`,
				value: summonData,
				expiry: 300_000
			});
		}
	}

	static getByProperty (property, identifier) {
		const iterator = Summon.data.values();
		let summon = undefined;
		let value = iterator.next().value;

		while (!summon && value) {
			if (value[property] === identifier) {
				summon = value;
			}

			value = iterator.next().value;
		}

		return summon;
	}

	static parseCall (call) {
		return {
			name: call.name,
			description: call.comment,
			readyIn: (call.start_recast === "") ? null : Number(call.start_recast),
			cooldown: Number(call.recast)
		};
	}

	static parseAura (auraData) {
		const aura = { main: null, sub: null, transcended: null };
		const { skill, sub_skill, unreleased_sub_skill } = auraData;

		if (skill) {
			aura.main = {
				name: skill.name,
				description: skill.comment
			};
		}

		if (sub_skill) {
			aura.sub = {
				name: sub_skill.name,
				description: sub_skill.comment
			};
		}

		if (unreleased_sub_skill) {
			aura.transcended = {
				name: unreleased_sub_skill.name,
				description: unreleased_sub_skill.comment,
				requiredLevel: unreleased_sub_skill.open_condition.release_level
			};
		}

		return aura;
	}

	static element (element) {
		switch (element) {
			case 1:
				return "Fire";
			case 2:
				return "Water";
			case 3:
				return "Earth";
			case 4:
				return "Wind";
			case 5:
				return "Light";
			case 6:
				return "Dark";
			default:
				return "Unknown";
		}
	}
};
