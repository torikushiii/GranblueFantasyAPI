module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No summon ID/Name provided"));

	Router.get("/:summon", async (req, res) => {
		const { summon } = req.params;

		const isId = req.query.id || false;
		const target = isId ? Number(summon) : summon;

		const data = await app.Summon.get(target);
		if (!data) {
			return res.notFound("No matching summon found with the provided ID/Name");
		}

		return res.send(data);
	});

	done();
};
