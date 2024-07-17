import '@core/declarations'
import _Signin from './signin'
import _SignUp from './signup'
import _SignOut from './sign-out'
import _AvailabilityCheck from './availability-check'
import _ForgotPasswordReset from './forgot-password-reset'
import _SecurityUpdateRequest2Fa from './update-request-2fa'
import _Verify2Fa from './verify-2fa'
import _LoginVerify2Fa from './login-verify-2fa'

export default class AuthController {
  Signin = _Signin

  Signup = _SignUp

  SignOut = _SignOut

  AvailabilityCheck = _AvailabilityCheck

  ForgotPasswordReset = _ForgotPasswordReset

  SecurityUpdateRequest2Fa = _SecurityUpdateRequest2Fa

  Verify2Fa = _Verify2Fa

  LoginVerify2Fa = _LoginVerify2Fa
}
