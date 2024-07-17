import '@core/declarations'
import { Request, Response, Router } from 'express'
import AuthController from '@modules/auth/controller'
import { Wrap } from '@core/utils'
import { authorize } from '@middlewares/authorizer'

const authController = new AuthController()
const router = Router()

router.get('/ping', (_req: Request, res: Response) => {
  return res.success()
})

router.get('/signup.availability-check', Wrap(authController.AvailabilityCheck))

router.post('/signup', Wrap(authController.Signup))

router.post('/signin', Wrap(authController.Signin))

router.post('/loginVerify2fa', Wrap(authController.LoginVerify2Fa))

router.post(
  '/securityUpdate2fa',
  authorize,
  Wrap(authController.SecurityUpdateRequest2Fa)
)

router.post('/securityVerify2fa', authorize, Wrap(authController.Verify2Fa))

router.post('/signout', authorize, Wrap(authController.SignOut))

router.post('/reset.forgot-password', Wrap(authController.ForgotPasswordReset))

export const AuthRouter = router
