import '@core/declarations'
import { Request, Response, NextFunction } from 'express'

export const interServiceAuthorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.unauthorized()
    }

    const token = req.headers.authorization.split(' ')[1]
    if (token != App.Config.INTERNAL_COMMUNICATION_TOKEN) {
      return res.unauthorized()
    }

    return next()
  } catch (error) {
    Logger.error(error)
    return res.internalServerError({ error })
  }
}
