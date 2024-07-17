import '@core/declarations'
import { Request, Response } from 'express'

export default async function _Me(req: Request, res: Response) {
  const { user: __user } = req

  // No need to fetch the user info again, as it is getting fetch at authorization
  const existingUser = __user

  // All Done
  return res.success({
    message: App.Messages.GetMe.Success.FetchedSuccessfully(),
    item: existingUser,
  })
}
