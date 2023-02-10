module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => res.badRequest("No player id provided"));

	Router.get("/:user", async (req, res) => {
		const isId = req.query.id === "true";
		if (!isId) {
			return res.badRequest("At this time, only player ids are supported, append ?id=true to your request");
		}

		const userData = await app.internal.Player.getPlayer(req.params.user);
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
