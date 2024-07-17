import Config, { ConfigInterface } from '@config'
const config: ConfigInterface = Config()

export const Messages = {
  GeneralError: {
    SomethingWentWrong: 'Something went wrong.',
    BadRequest: 'Bad Request',
    AccountBlockedByAdmin: `Your account has been deactivated by the administrator, for more updates kindly contact ${config.SUPPORT_EMAIL}.`,
  },
  Helpers: {
    OTPHelper: {
      CodeSentSuccessFullyOverEmail:
        'This is your One Time Password: {{OTP}} from {{BrandName}}',
    },
    VerifyLinkHelper: {
      ForgotPasswordSMS: 'Link {{verifyLink}} from {{BrandName}}',
    },
    JWTHelper: {
      TokenExpired: 'Token Expired! Please signin again.',
    },
  },
  CodeVerification: {
    Success: {
      GetSuccess: 'Verification status fetched successfully.',
      CodeSent: 'Verification {{type}} has been sent to your {{to}}.',
      CodeVerified: 'Verification code verified successfully.',
    },
    Error: {
      InvalidLink: 'Invalid Link!',
      UserNotExists: 'Sorry, we could not find your account.',
      ForgotPasswordSocialAccountNotAllowed:
        'Your account is created with Social Signup, please try with Social Login!',
      UserEmailUpdateInSocialAccountNotAllowed:
        "Your account is created with Social Signup, can't update email!",
      TwoFactorAuthenticationSettingsNotAvailable:
        'Your account did not have 2FA Settings.',
      TwoFactorAuthenticationAlreadySet: '2FA Already Set.',
      RequiredDetailFor2FANotAvailable: 'Please set your {{detail}} first.',
      ResendLimitExceeded:
        'You have exceeded the limits, please try again in some time.',
      ResendIsNotAvailable:
        'You are allowed to resend after {{resendShouldGetAllowedInSeconds}} seconds.',
      SessionExpired: 'This session has expired!',
      CodeVerificationExpired: 'Verification {{type}} has expired.',
      CodeVerificationFailed: 'Verification code is invalid.',
      IncorrectCode:
        'The verification code password is incorrect. Please try again',
      MissingRecordToVerify: 'No record found for verification.',
      AccountBlockedDueToMultipleAttempts:
        'Your account has been blocked for {{timeLeftToUnblock}}. Please try again later.',
      DisabledAccount: 'Your account has been disabled.',
      EmailAlreadyInUse: 'Email is already in use.',
      PhoneAlreadyInUse: 'Phone is already in use.',
    },
  },

  CodeVerificationResend: {
    Success: {
      CodeSent: 'Verification {{type}} has been re-sent to your {{to}}.',
    },
    Error: {
      CodeVerificationNotFound: 'Code verifction request is not found',
    },
  },

  Signup: {
    Success: {
      SignupSuccessful: 'Account created successfully.',
    },
    Error: {
      PreSignCodeVerificationFailed: 'Code verification failed.',
      UsernameAlreadyInUse: 'Username is not available.',
      EmailAlreadyInUse:
        'This email address already exists, please try logging in',
      PhoneAlreadyInUse:
        'This phone number already exists, Please try logging in.',
    },
  },

  Signin: {
    Success: {
      SigninSuccessful: 'Signin Successful.',
      SigninSuccessfulProceedFor2FA: 'Signin successful proceed for 2FA.',
    },
    Error: {
      UserNotExists: "User doesn't exist, Please Sign Up.",
      IncorrectPassword: 'The entered credentials are wrong, Please try again.',
      AccountBlockedDueToMultipleAttempts:
        'Due to multiple wrong attempts you are not allowed to log in for {{timeLeftToUnblock}}.',
      DisabledAccount: 'Your account has been disabled.',
      PasswordSignInNotAllowedInSocialAccount:
        'Your account is created with Social Signup, please try with Social Login!',
    },
  },
  SignOut: {
    Success: {
      SignOutSuccessful: 'Signed out successfully.',
    },
    Error: {
      UserNotExists: "User doesn't exist!",
      InvalidSessionIdentifier: 'Invalid session identifier.',
    },
  },

  ForgotPassword: {
    Success: {
      ResetSuccessful: 'Password reseted successfully.',
    },
  },


  // Me

  GetMe: {
    Success: {
      FetchedSuccessfully: 'Me data fetched successfully.',
    },
    Error: {},
  },

  MeUpdatePassword: {
    Success: {
      UpdateSuccessful: 'Password Update Successful.',
    },
    Error: {
      IncorrectOldPassword: 'Incorrect Old Password.',
    },
  },

  MeUpdatePhoneNumber: {
    Success: {
      UpdateSuccessful: 'Phone number Update Successful.',
    },
    Error: {},
  },

  MeUpdateSettings: {
    Success: {
      UpdateSuccessful: 'Settings updated successful.',
      AuthenticationSetSuccessfully: '2FA set to {{type}}.',
      AuthenticationTurnedOffSuccessfully: '2FA turned off.',
      AuthenticatorSecretGeneratedSuccessfully:
        'Setup 2FA in your Authenticator App.',
    },
    Error: {
      SettingAlreadySet: '{{setting}} already set to {{givenValueInRequest}}',
      AccountPrivacyUpdateDisabled:
        'Cannot change account privacy for {{duration}}.',
      InvalidCodeVerification: 'Invalid code verification.',
      InvalidSettingAndCodeVerification:
        'Setting type and code verification purpose not match.',
      SessionExpired: 'This session has expired!',
      RequiredDetailFor2FANotAvailable: 'Please set your {{detail}} first.',
      AuthenticatorAppOtpVerificationFailed: 'Invalid OTP!',
    },
  },
}
