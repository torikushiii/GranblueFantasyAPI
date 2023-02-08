module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => {
		const gachaData = await app.internal.Gacha.getGachaData();
		if (gachaData.error) {
			return res.notFound(gachaData.message);
		}

		return res.send(gachaData);
	});

	done();
};
