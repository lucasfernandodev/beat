import { Server } from "./lib/fastify/server.ts"


class Main {
	private server = new Server()
	public init = async () => {
  	await this.server.init() 
	}
}


const app = new Main()
app.init().then(async => {

}).catch(async err => {
	console.error(err);
	process.exit(1);
})