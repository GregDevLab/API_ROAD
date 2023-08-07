import { TokenHandler } from "@src/utils";
import { NextFunction, Request, Response } from "express";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token
		await TokenHandler.verifyToken(token)
		next()
	}catch (err) {
		res.status(403).json({ message: 'Token invalide' })
	}
}

export default checkAuth