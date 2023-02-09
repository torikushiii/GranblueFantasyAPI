module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No player id provided"));

	Router.get("/:id", async (req, res) => {
		const { id } = req.params;

		const userData = await app.internal.Player.getPlayer(id);
		if (userData.error && !userData.internal) {
			return res.badRequest(userData.message);
		}
		else if (userData.error && userData.internal) {
			return res.internalServerError(userData.message);
		}
		else if (userData.error === "no-match") {
			return res.notFound("No player found with that id");
		}

		return res.send(userData.data);
	});

	done();
};
