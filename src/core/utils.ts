import '@core/declarations'
import { Request, Response, NextFunction } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import Mustache from 'mustache'
import axios from 'axios'
import Crypto from 'node:crypto'
import ApiQueryParams from 'api-query-params'
import { IUser } from '@models/user'

export const FileExistsSync = (FilePath) => {
  return fs.existsSync(`${FilePath}.js`) || fs.existsSync(`${FilePath}.ts`)
}

export function GenerateRandomStringOfLength(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function GenerateRandomNumberOfLength(length) {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function Wrap(controller: CallableFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next)
    } catch (error) {
      Logger.error(error)
      return res.internalServerError({ error })
    }
  }
}

export const BasicAuthCredentialFetch = (options: any) => {
  const authorization = options.authorization
  if (!authorization || authorization.indexOf('Basic ') === -1) {
    return null
  }

  // verify auth credentials
  const base64Credentials = authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')
  return {
    username,
    password,
  }
}

export const GetPackageJson = () => {
  const packageJson = fs
    .readFileSync(path.resolve(__dirname, '../../package.json'))
    .toString()
  return JSON.parse(packageJson)
}

export const FetchCollectionFromOrigin = async (
  collectionName: string,
  _record: string
) => {
  if (!App.CollectionOrigin(collectionName)) {
    return null
  }

  const { data } = await axios
    .get(`${App.CollectionOrigin(collectionName)}/${_record}`, {
      headers: {
        authorization: `Bearer ${App.Config.INTERNAL_COMMUNICATION_TOKEN}`,
      },
    })
    .catch((e: any) => e.response)

  if (data?.data?.items[0]) {
    return data.data.items[0]
  } else {
    return null
  }
}


export function GenerateCallableMessages(_Messages: any) {
  const Messages: { [key: string]: any } = {}

  function _GenerateCallableMessages(
    target: any,
    values: { [key: string]: any }
  ) {
    try {
      for (const key in values) {
        if (typeof values[key] == 'string') {
          target[key] = (params: { [key: string]: string }) => {
            return Mustache.render(values[key], params)
          }
        } else {
          target[key] = {}
          _GenerateCallableMessages(target[key], values[key])
        }
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  _GenerateCallableMessages(Messages, _Messages)
  return Messages
}

export function GetBuildIdentifier() {
  const buildIdentifierPath = path.resolve('./run-identifier.txt')
  let BUILD_IDENTIFIER = null
  if (!fs.existsSync(buildIdentifierPath)) {
    const randomString = GenerateRandomStringOfLength(10)
    fs.writeFileSync(buildIdentifierPath, randomString)
    BUILD_IDENTIFIER = randomString
  } else {
    BUILD_IDENTIFIER = fs.readFileSync(buildIdentifierPath).toString().trim()
  }
  BUILD_IDENTIFIER = `-${BUILD_IDENTIFIER}`
  return BUILD_IDENTIFIER
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function GetKeyByValue(o: any, v: any) {
  return Object.keys(o).find((key) => o[key] === v)
}

export async function GeolocationByIp(
  ip: string
): Promise<{ [key: string]: string } | undefined> {
  const { data: geolocationResponse } = await axios.get(
    `http://ip-api.com/json/${ip}`
  )
  if (geolocationResponse.status == 'success') {
    geolocationResponse.address = [
      geolocationResponse?.regionName,
      geolocationResponse?.city,
      geolocationResponse?.country,
      geolocationResponse?.zip,
    ]
      .filter((e) => e != undefined)
      .join(', ')
    return geolocationResponse
  } else {
    return undefined
  }
}

export function GenerateHashFrom(params: any) {
  if (!Array.isArray(params)) {
    params = [params]
  }

  params = params
    .filter((e: any) => e != undefined || e != null)
    .sort()
    .map((e: any) => e.toString())
    .join('-')
  return Crypto.createHash('sha256').update(params.toString()).digest('hex')
}

export function GetDatabaseFilterQueryFromString(query: {
  [key: string]: any
}): { query: any; sort: any } {
  const r = ApiQueryParams(query as { criteria: any; options: any })
  return {
    query: r?.filter ?? {},
    sort: r?.sort ?? {},
  }
}

export async function GenerateNewLoginSession(payload: { [key: string]: any }) {
  const { existingLoginSessions, sessionIdentifier } = payload

  const loginSession: IUser['loginSessions'][0] = {
    signinAt: new Date(),
    sessionIdentifier,
  }

  const _existingLoginSessions: IUser['loginSessions'] =
    existingLoginSessions as IUser['loginSessions']
  let newSession = true
  if (sessionIdentifier) {
    for (let i = 0; i < existingLoginSessions.length; i++) {
      const _loginSession = existingLoginSessions[i]
      if (_loginSession.sessionIdentifier == sessionIdentifier) {
        existingLoginSessions[i] = loginSession
        newSession = false
      }
    }
  }

  if (newSession) {
    loginSession.sessionIdentifier = GenerateRandomStringOfLength(100)
    _existingLoginSessions.push(loginSession)
  }

  return {
    all: _existingLoginSessions,
    current: loginSession,
  }
}
