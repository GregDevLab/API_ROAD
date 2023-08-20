import express from 'express';
import {FetchUrlController} from '@src/controllers';
const router = express.Router();

const fetchUrl = new FetchUrlController().fetchUrl;

router.get('/', fetchUrl);

export default router;