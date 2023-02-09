module.exports = class Character extends require("./template") {
	static data = new Map();

	constructor (data) {
		super();

		/**
         * Represents the character's ID
         * @type {Number}
         */
		this.id = Number(data.id);

		/**
         * Represents the character's name
         * @type {String}
         */
		this.name = data.name;

		/**
         * Represents the character's max level
         * @type {Number}
         */
		this.maxLevel = Number(data.max_level);

		/**
         * Represents the character's rarity
         * @type {String}
         */
		this.rarity = data.rarity_name;

		/**
         * Represents the character's HP
         * @type {Number}
         */
		this.hp = Number(data.max_hp);

		/**
         * Represents the character's ATK
         * @type {Number}
         */
		this.atk = Number(data.max_attack);

		/**
         * Represents the character's element
         * @type {Number}
         */
		this.element = Character.element(Number(data.attribute));

		/**
         * Represents the character's race
         * @type {Number}
         */
		this.race = Character.race(Number(data.tribe));

		/**
         * Represents the character's weapon types
         * @type {Number[]}
         */
		this.weaponTypes = data.specialty_weapon.map(Character.weaponTypes);

		/**
         * Represents the character's ultimate skill
         * @type {Object}
         */
		this.ultimate = Character.ultimate([data.special_skill, data.special_skill2]) || [];

		/**
         * Represents the character's ability skills
         * @type {Object[]}
         */
		this.abilities = Character.abilities(data.ability) || [];

		/**
         * Represents the character's passive skills
         * @type {Object[]}
         */
		this.passives = Character.passive(data.ability) || [];

		/**
         * Represents the character's voice actor
         * @type {String}
         */
		this.voiceActor = data.voice_acter || "???";
	}

	static loadData () {
		/** @type {Map<Number, Character>} */
		Character.data = Character.data || new Map();
	}

	static async get (target, options = {}) {
		if (target instanceof Character) {
			return target;
		}
		else if (typeof target === "number") {
			const mapCache = Character.getByProperty("id", target);
			if (mapCache) {
				return mapCache;
			}

			const character = await app.Query.collection("character_data").findOne({ id: target });
			if (!character) {
				return Character.get(String(target), { force: true });
			}

			return Character.get(character, options);
		}
		else if (typeof target === "string") {
			const mapCache = Character.data.get(target);
			if (mapCache) {
				return mapCache;
			}

			if (app.Cache && app.Cache.active) {
				const redisCache = await app.Cache.get(`character-${target}`);
				if (redisCache) {
					const character = new Character(redisCache);
					Character.data.set(target, character);

					return character;
				}
			}

			const dbCharaData = await app.Query.collection("character_data")
				.findOne({ $or: [
					{ id: target },
					{ name: target }
					// eslint-disable-next-line object-curly-spacing
				] });
			
			let charData;
			if (dbCharaData) {
				charData = new Character(dbCharaData);
			}
			else if (options.force) {
				const fetchData = await app.internal.Character.get(target, { id: true });
				if (fetchData.error) {
					return null;
				}

				charData = new Character(fetchData);

				await app.Query.collection("character_data").insertOne(fetchData);
				await this.populateCaches(fetchData);

				return charData;
			}
			else {
				return null;
			}

			const fetchData = await app.internal.Character.get(target);
			if (fetchData.error) {
				return null;
			}

			charData = new Character(fetchData);

			await app.Query.collection("character_data").insertOne(fetchData);
			await this.populateCaches(fetchData);

			return charData;
		}
	}

	static async populateCaches (charaData) {
		if (!Character.data.has(charaData.id)) {
			Character.data.set(charaData.id, charaData);
		}

		if (app.Cache && app.Cache.active) {
			await app.Cache.set({
				key: `character-${charaData.id}`,
				value: charaData,
				expiry: 300_000
			});
		}
	}

	static getByProperty (property, identifier) {
		const iterator = Character.data.values();
		let target = null;
		let value = iterator.next().value;

		while (!target && value) {
			if (value[property] === identifier) {
				target = value;
			}

			value = iterator.next().value;
		}

		return target;
	}

	static ultimate (ultimate) {
		const ultimateData = [];
		for (const ult of ultimate) {
			if (ult) {
				ultimateData.push({
					name: ult.name,
					description: app.Utils.removeHTML(ult.comment)
				});
			}
		}

		return ultimateData;
	}

	static abilities (abilities) {
		const abilityData = [];
		for (const [key, ability] of Object.entries(abilities)) {
			if (key.includes("action_ability") && ability) {
				abilityData.push({
					name: ability.name,
					description: app.Utils.removeHTML(ability.comment),
					cooldown: Number(ability.recast),
					readyIn: Number(ability.start_recast),
					details: ability.ability_detail ? this.getAbilityDetails(ability.ability_detail) : []
				});
			}
		}

		return abilityData;
	}

	static getAbilityDetails (ability) {
		const abilityDetails = [];
		for (const [key, value] of Object.entries(ability)) {
			if (key === "debuff") {
				for (const debuff of value) {
					abilityDetails.push({
						type: "Debuff",
						detail: debuff.detail,
						effect: (debuff.effect === "") ? null : debuff.effect
					});
				}
			}
			else if (key === "buff") {
				for (const buff of value) {
					abilityDetails.push({
						type: "Buff",
						detail: buff.detail,
						effect: (buff.effect === "") ? null : buff.effect
					});
				}
			}
		}

		return abilityDetails;
	}

	static passive (passives) {
		const passiveData = [];
		for (const [key, pasive] of Object.entries(passives)) {
			if (key.includes("support_ability") && pasive) {
				passiveData.push({
					name: pasive.name,
					description: app.Utils.removeHTML(pasive.comment)
				});
			}
		}

		return passiveData;
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

	static race (race) {
		switch (race) {
			case 1:
				return "Human";
			case 2:
				return "Erune";
			case 3:
				return "Draph";
			case 4:
				return "Harvin";
			case 5:
				return "Other";
			case 6:
				return "Primal";
			default:
				return "???";
		}
	}

	static weaponTypes (weaponType) {
		switch (Number(weaponType)) {
			case 1:
				return "Sabre";
			case 2:
				return "Dagger";
			case 3:
				return "Spear";
			case 4:
				return "Axe";
			case 5:
				return "Staff";
			case 6:
				return "Gun";
			case 7:
				return "Melee";
			case 8:
				return "Bow";
			case 9:
				return "Harp";
			case 10:
				return "Katana";
			default:
				return "Unknown";
		}
	}
};
