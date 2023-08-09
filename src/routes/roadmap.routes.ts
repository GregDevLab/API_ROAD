import express from 'express';
const router = express.Router();

import { RoadmapController } from '@src/controllers';
const roadmapController = new RoadmapController();

router.get('/', roadmapController.getAll);
router.get('/show/:id', roadmapController.getById);
router.post('/new', roadmapController.create);
router.put('/update/:id', roadmapController.update);
router.delete('/delete/:id', roadmapController.delete);

export default router