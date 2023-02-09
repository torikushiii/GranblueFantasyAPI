module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No character ID/Name provided"));

	Router.get("/:character", async (req, res) => {
		const { character } = req.params;

		const isId = req.query.id || false;
		const target = isId ? Number(character) : character;

		const data = await app.Character.get(target);
		if (!data) {
			return res.notFound("No matching character found with the provided ID/Name");
		}

		return res.send(data);
	});

	done();
};
