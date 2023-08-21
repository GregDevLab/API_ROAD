import express, { Request, Response } from 'express'
import 'dotenv/config'
import prisma from '@src/prisma'
import { authRouter, fetchUrlRouter, reactionRouter, roadmapRouter, stepRouter, uploadRouter, userRouter } from '@src/routes'
import cookieParser from 'cookie-parser'
import checkAuth from '@src/middleware/checkAuth'
import cors from 'cors'
import path from 'path'

const uploadsDirectory = path.join(__dirname, '../uploads');
export default class Server {
		private app: express.Application
		private port: number

		constructor() {
				this.app = express()
				this.port = Number(process.env.PORT) || 3000
		}

		middlewares() {
				this.app.use(express.json({ limit: '100mb' }))
				this.app.use(cookieParser())
				this.app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit: 50000}))
				this.app.use('/image',express.static(uploadsDirectory))
				this.app.use(cors({
					origin: 'http://localhost:5173',
					credentials: true,
					methods: ['GET', 'POST', 'PUT', 'DELETE'],
				}))
		}

		routes = ()  => {
			this.app.use('/api/auth', authRouter)
			this.app.use('/api/fetchurl', fetchUrlRouter)
			// this.app.use('/api/user', userRouter)
		}
		
		protectedRoutes = () => {
			this.app.use(checkAuth)
			this.app.use('/api/user', userRouter)
			this.app.use('/api/roadmap', roadmapRouter)
			this.app.use('/api/reaction', reactionRouter)
			this.app.use('/api/upload', uploadRouter)
			this.app.use('/api/step', stepRouter)
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