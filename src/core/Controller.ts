import { IController } from "@src/interface";
import { Response } from "express";

export default class Controller implements IController {

		constructor() {
		}

		sendSuccess(res: Response,code: number,message: string,object: any) {
			res.status(code).json({ status: 'success', message, object});
		}

		sendError(res:Response,code: number,message: string,error: any) {
				res.status(code).json({ status: 'error', message, error});
		}
}