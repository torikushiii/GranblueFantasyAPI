module.exports = class Character extends require("./template") {
    static data = new Map();

    constructor (data) {
        super();

        /**
         * Represents the character's ID
         * @type {Number}
         */
        this.id = data.id;

        /**
         * Represents the character's name
         * @type {String}
         */
        this.name = data.name;
    }
}