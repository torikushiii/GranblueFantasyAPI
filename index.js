const fastify = require("./lib/fastify");
const logger = require("./lib/logger");

(async function () {
	require("./db-access.js");
	await require("./modules/index")();
	const subroutes = [
		"banner",
		"character",
		"events",
		"player",
		"summon",
		"weapon"
	];

	const config = app.Config;
	if (!config.host || !config.port) {
		logger.error("Config file is missing host or port");
		process.exit(1);
	}

	fastify.get("/robots.txt", (req, res) => {
		res.type("text/plain");
		res.send("User-agent: *\nDisallow: /");
	});

	fastify.get("/guraburu/", async (req, res) => {
		const version = await app.Utils.getVersion();
		res.send({
			status: 200,
			uptime: Math.round(Date.now() - process.uptime() * 1000),
			version: (version.error ? null : version.build),
			endpoints: subroutes
		});
	});

	for (const route of subroutes) {
		fastify.register(require(`./routes/${route}`), { prefix: `guraburu/${route}` });
	}

	fastify.get("*", (req, res) => {
		res.notFound("That endpoint does not exist");
	});

	fastify.listen({ port: config.port, host: config.host });
})();
