import express from 'express';
import { StepController } from '@src/controllers';

const stepController = new StepController();
const router = express.Router();

router.get('/', stepController.getAll);
router.get('/show/:id', stepController.getById);
router.post('/new', stepController.create);
router.put('/update/:id', stepController.update);
router.delete('/delete/:id', stepController.delete);

export default router;