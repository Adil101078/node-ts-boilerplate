import '@core/declarations'
import { Router } from 'express'
import RateLimit from 'express-rate-limit'

import { AuthRouter } from '@modules/auth/routes'
import { codeVerificationRouter } from '@modules/code-verification/routes'
// import { MeRouter } from '@modules/me/routes'
// import { CollectionRouter } from '@modules/collection/routes'

import HashGeneratorFromArrayHelper from '@helpers/hash-generator-from-array.helper'

const rateLimiter = RateLimit({
  windowMs: 60 * 1000 * 1, // Time window of 1 minute
  max: 1000, // Max hits allowed
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) =>
    HashGeneratorFromArrayHelper.Generate([req.ip, req.originalUrl]),
})

const router = Router()
router.use(rateLimiter)

router.use('/auth', AuthRouter)
router.use('/code-verification', codeVerificationRouter)
// router.use('/me', MeRouter)
// router.use('/collection', CollectionRouter)
export const AppRoutes = router
