module.exports = function (fastify, opts, done) {
	const Router = fastify;

	Router.get("/", async (req, res) => {
		const eventData = await app.Cache.get("granblue-events");
		if (!eventData) {
			return res.notFound("Event data has not been setup yet");
		}

		const { events, campaigns } = eventData;
		return res.send({
			events,
			campaigns
		});
	});

	done();
};
