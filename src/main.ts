import { isOperationalError } from "./infra/errors/error-handle.ts"
import { Server } from "./lib/fastify/server.ts"
import { prisma } from "./lib/prisma/client.ts"


class Main {
	private server = new Server()
	public init = async () => {
		await this.server.init()
	}
}


const app = new Main()
app.init().catch(async err => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
})

process.on('unhandledRejection', error => {
	throw error
})

process.on('uncaughtException', error => {
	console.error(error);
	if(!isOperationalError(error)){
		process.exit(1)
	}
 })
