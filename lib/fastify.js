/**
 * @type {import('fastify').FastifyInstance}
 */
const fastify = require("fastify")({
	trustProxy: true,
	logger: {
		level: "debug",
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "dd.mm.yyyy HH:MM:s.1",
				ignore: "pid,hostname"
			}
		}
	},
	disableRequestLogging: true
});

fastify.register(require("@fastify/sensible"));
fastify.register(require("@fastify/cors"), {
	origin: "*",
	methods: ["GET"],
	allowedHeaders: ["Content-Type", "Authorization"],
	exposedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
	maxAge: 86400
});

fastify.setErrorHandler(async (error, request, reply) => {
	const statusCode = error.statusCode ?? reply.statusCode;

	const responseObject = {
		statusCode,
		error: error.name,
		message: error.message
	};

	if (statusCode >= 500) {
		fastify.log.error(error);
	}

	reply.status(statusCode).send(responseObject);
});

module.exports = fastify;
