import express from 'express'
const router = express.Router()

import { ReactionController } from '@src/controllers'
const reactionController = new ReactionController()

router.post('/roadmap', reactionController.reactHandler)

export default router