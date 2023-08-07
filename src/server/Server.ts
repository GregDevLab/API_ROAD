import express, { Request, Response } from 'express'
import 'dotenv/config'
import prisma from '@src/prisma'
import { authRouter, userRouter } from '@src/routes'
import cookieParser from 'cookie-parser'
import checkAuth from '@src/middleware/checkAuth'
import cors from 'cors'

export default class Server {
		private app: express.Application
		private port: number

		constructor() {
				this.app = express()
				this.port = Number(process.env.PORT) || 3000
		}

		middlewares() {
				this.app.use(express.json())
				this.app.use(cookieParser())
				this.app.use(express.urlencoded({ extended: true }))
				this.app.use(cors({
					origin: 'http://localhost:5173',
					credentials: true,
					methods: ['GET', 'POST', 'PUT', 'DELETE'],
				}))
		}

		routes = ()  => {
			this.app.use('/api/auth', authRouter)
			// this.app.use('/api/user', userRouter)
		}

		protectedRoutes = () => {
			this.app.use(checkAuth)
			this.app.use('/api/user', userRouter)
		}

		start = () => {
				prisma.$connect()
				.then(() => 
					this.app.listen(this.port, () => console.log(`Application connectées sur le port ${this.port}`))
				)
				.catch((err) => 
					console.log(err)
				)
		}
}