import expresse from 'express'
const router = expresse.Router()
import { UserController } from '@src/controllers'

const user = new UserController()

router.get('/', user.getAll)
router.get('/show/:id', user.getById)
router.put('/update/:id', user.update)
router.delete('/delete/:id', user.delete)

export default router
