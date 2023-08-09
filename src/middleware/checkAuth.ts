import { TokenHandler } from "@src/utils";
import { NextFunction, Request, Response } from "express";

interface IUser {
	[key: string]: any;
}
declare module 'express-serve-static-core' {
	interface Request {
		user?: IUser;
	}
}
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token
		const user = await TokenHandler.verifyToken(token)
		req.user = user
		next()
	}catch (err) {
		res.status(403).json({ message: 'Token invalide' })
	}
}

export default checkAuth