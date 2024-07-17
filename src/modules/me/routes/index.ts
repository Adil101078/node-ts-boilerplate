import '@core/declarations'
import { Request, Response, Router } from 'express'

import MeController from '@modules/me/controller'

import { Wrap } from '@core/utils'
import { authorize } from '@middlewares/authorizer'

const meController = new MeController()

const router = Router()

router.get('/ping', (_req: Request, res: Response) => {
  return res.success()
})

router.use(authorize)

router.get('/', Wrap(meController.Me))

router.patch('/password/', Wrap(meController.UpdatePassword))

router.patch(
  '/phonenumber/:_codeVerification',
  Wrap(meController.UpdatePhoneNumber)
)

export const MeRouter = router
