import { Controller } from "@src/core";
import multer from 'multer';
import path from "path";
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads');

export default class UploadController extends Controller {
	constructor() {
		super()
	}

	uploadFile = async (req: any, res: any) => {
		console.log("🚀 ~ file: uploadController.ts:23 ~ UploadController ~ upload ~ body:", req.file)
		console.log("🚀 ~ file: uploadController.ts:23 ~ UploadController ~ upload ~ body:", req.body)
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir);
		}
		try {
			
			const theStorage = multer.diskStorage({
				destination: (req, file, cb) => {
					cb(null, uploadsDir)
				},
				filename: (req, file, cb) => {
					cb(null, Date.now() + '-' + file.originalname)
				}
			})

			const uploader = multer({ storage: theStorage, limits: { fileSize: 100 * 1024 * 1024 }}).single('file')
			
			uploader(req, res, (err) => {
				if (err instanceof multer.MulterError) {
					return this.sendError(res, 500, 'Echec lors de l\'upload', err);
				} else if (err) {
					return this.sendError(res, 500, 'Echec lors de l\'upload', err);
				}
				return this.sendSuccess(res, 200, 'Upload réussi', req.file);
			})
		} catch (error) {
			return this.sendError(res, 500, 'Echec lors de l\'upload', error);
		}
	}
}