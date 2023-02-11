module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No weapon ID/Name provided"));

	Router.get("/:weapon", async (req, res) => {
		const { weapon } = req.params;

		const isId = req.query.id || false;
		const target = isId ? Number(weapon) : weapon;

		const data = await app.Weapon.get(target);
		if (!data) {
			return res.notFound("No matching weapon found with the provided ID/Name");
		}

		return res.send(data);
	});

	done();
};
