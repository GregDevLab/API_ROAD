import { Response } from "express";

export default interface IController {
	sendSuccess: (res: Response,code: number,message: string,object: any) => void;
	sendError: (res: Response,code: number,message: string,error: any) => void;
}