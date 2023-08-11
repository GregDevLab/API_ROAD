import { UploadController } from "@src/controllers";
import express from 'express';


const router = express.Router();


const upload = new UploadController();
router.post('/file', upload.uploadFile)

export default router