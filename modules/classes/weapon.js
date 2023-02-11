module.exports = class Weapon extends require("./template") {
	static data = new Map();

	constructor (data) {
		super();

		/**
         * Represents the weapon ID
         * @type {Number}
         */
		this.id = Number(data.id);

		/**
         * Represents the weapon name
         * @type {String}
         */
		this.name = data.name;

		/**
         * Represents the weapon series type
         * @type {String}
         */
		this.series = data.series_name ?? null;

		/**
         * Represents the weapon max level
         * @type {Number}
         */
		this.maxLevel = Number(data.max_level);

		/**
         * Represents the weapon rarity
         * @type {String}
         */
		this.rarity = data.rarity_name;

		/**
         * Represents the weapon HP
         * @type {Number}
         */
		this.hp = Number(data.max_hp);

		/**
         * Represents the weapon ATK
         * @type {Number}
         */
		this.atk = Number(data.max_attack);

		/**
         * Represents the weapon element
         * @type {Number}
         */
		this.element = Weapon.element(Number(data.attribute));

		/**
         * Represents the weapon ability skills
         * @type {Object[]}
         */
		this.chargeAttack = Weapon.parseCall(data.special_skill) || [];

		/**
         * Represents the weapon aura skills
         * @type {Object[]}
         */
		this.skills = Weapon.skills(data) || [];
	}

	static loadData () {
		/** @type {Map<Number, Weapon>} */
		Weapon.data = Weapon.data || new Map();
	}

	static async get (target, options = {}) {
		if (target instanceof Weapon) {
			return target;
		}
		else if (typeof target === "number") {
			const mapCache = Weapon.getByProperty("id", target);
			if (mapCache) {
				return mapCache;
			}

			const weapon = await app.Query.collection("weapon_data").findOne({ id: target });
			if (!weapon) {
				return Weapon.get(String(target), { force: true });
			}

			return Weapon.get(weapon, options);
		}
		else if (typeof target === "string") {
			const mapCache = Weapon.data.get(target);
			if (mapCache) {
				return mapCache;
			}

			if (app.Cache && app.Cache.active) {
				const redisCache = await app.Cache.get(`weapon-${target}`);
				if (redisCache) {
					const weapon = new Weapon(redisCache);
					Weapon.data.set(target, weapon);

					return weapon;
				}
			}

			const dbWeaponData = await app.Query.collection("weapon_data")
				.findOne({ $or: [
					{ id: target },
					{ name: target }
					// eslint-disable-next-line object-curly-spacing
				] });
			
			let weaponData;
			if (dbWeaponData) {
				weaponData = new Weapon(dbWeaponData);

				await this.populateCaches(dbWeaponData);

				return weaponData;
			}
			else if (options.force) {
				const fetchData = await app.internal.Weapon.get(target, { id: true });
				if (!fetchData) {
					return null;
				}

				weaponData = new Weapon(fetchData);

				await app.Query.collection("weapon_data").insertOne(fetchData);
				await this.populateCaches(fetchData);

				return weaponData;
			}
			else {
				return null;
			}
		}
	}

	static async populateCaches (weaponData) {
		if (!Weapon.data.has(weaponData.id)) {
			Weapon.data.set(weaponData.id, weaponData);
		}

		if (app.Cache && app.Cache.active) {
			await app.Cache.set({
				key: `weapon-${weaponData.id}`,
				value: weaponData,
				expiry: 300_000
			});
		}
	}

	static getByProperty (property, identifier) {
		const iterator = Weapon.data.values();
		let weapon = undefined;
		let value = iterator.next().value;

		while (!weapon && value) {
			if (value[property] === identifier) {
				weapon = value;
			}

			value = iterator.next().value;
		}

		return weapon;
	}

	static parseCall (skill) {
		return {
			name: skill.name,
			description: skill.comment
		};
	}

	static skills (data) {
		const skills = [];

		const { skill1, skill2, skill3 } = data;
		if (skill1) {
			skills.push({
				name: skill1.name,
				description: skill1.comment
			});
		}

		if (skill2) {
			skills.push({
				name: skill2.name,
				description: skill2.comment
			});
		}

		if (skill3) {
			skills.push({
				name: skill3.name,
				description: skill3.comment
			});
		}

		return skills;
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
