import { isOperationalError } from "./infra/errors/error-handle.ts"
import { SyncPressureToNotion } from "./infra/service/sync-pressure-to-notion.ts"
import { eventBus } from "./lib/event-bus/emiter.ts"
import { Server } from "./lib/fastify/server.ts"
import { prisma } from "./lib/prisma/client.ts"


class Main {
	private server = new Server()
	public init = async () => {
		eventBus.removeAllListeners('pressure.created')
		eventBus.on('pressure.created', ({ patientId }) => {
			setImmediate(async () => {
				try {
					const service = new SyncPressureToNotion()
					await service.execute({ patientId })
				} catch (err) {
					console.error(err)
				}
			})
		})

		await this.server.init()
	}
}


const app = new Main()
app.init().catch(async err => {
	console.error(err);
	eventBus.removeAllListeners('pressure.created')
	await prisma.$disconnect();
	process.exit(1);
})

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error)
	throw error
})

process.on('uncaughtException', error => {
	console.error(error);
	if (!isOperationalError(error)) {
		process.exit(1)
	}
})
