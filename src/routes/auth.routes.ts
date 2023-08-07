import express from 'express';
import  {AuthController}  from '@src/controllers';
const auth = new AuthController();
const router = express.Router();

router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.get('/refresh', auth.refreshToken);
router.get('/me', auth.authByToken);
router.get('/logout', auth.logout);

export default router