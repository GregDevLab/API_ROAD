import 'module-alias/register'
import Server from '@src/server/Server'

const server = new Server()

server.middlewares()
server.routes()
server.protectedRoutes()
server.start()

