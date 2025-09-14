import { UnauthorizedException, Unlock, UnprocessableEntityException } from "@nestjs/common";

export const InvalidOTPException = new UnprocessableEntityException({
    message: 'Error.InvalidOTP',
    path: 'code'
})

export const OTPExpireException = new UnprocessableEntityException({
    message: 'Error.OTPExpired',
    path: 'code'
})

export const FailToSendOTPException = new UnprocessableEntityException({
    message: 'Error.FailedToSendOTP',
    path: 'code'
})

export const EmailAlreadyExistesException = new UnprocessableEntityException({
    message: 'Error.EmailAlreadyExists',
    path: 'email'
})

export const EmailNotFoundException = new UnprocessableEntityException({
    message: 'Error.EmailNotFound',
    path: 'email'
})

export const UserNotFoundException = new UnprocessableEntityException({
    message: 'Error.UserNotFound',
    path: 'code'
})


export const RefreshTokenAlreadyUseException = new UnauthorizedException(
    'Error.RefreshTokenAlreadyUse'
)


export const UnauthorizedAccessTokenException = new UnauthorizedException('Error.UnauthorizedAccess')

export const GoogleUserInfoError = new Error('Error.FailedToGetUserInfoFromGoogle')


export const TOTPAlreadyEnableException = new UnprocessableEntityException({
    path: 'totpCode',
    message: 'Error.TOTPAlreadyEnableException'
})

export const TOTPNotEnableException = new UnprocessableEntityException({
    message: 'Error.TOTPNotEnableException',
    path: 'totpCode'
})

export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
    {
    message: 'Error.INVALIDOTPCODE',
    path: 'totpCode'
},  {
    message: 'Error.INVALIDOTPCODE',
    path: 'totpCode'
}
])

export const InvalidTOTPException = new UnprocessableEntityException({
    message: "Error.InvalidOTPException",
    path: 'totpCode'

})