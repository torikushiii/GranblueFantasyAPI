module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No character ID/Name provided"));

	Router.get("/:character", async (req, res) => {
		const { character } = req.params;

        const isId = req.query.id || false;
	});

	done();
};
