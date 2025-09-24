export const REQUEST_USER_KEY= 'user'
export const REQUEST_ROLE_PERMISSIONS = 'role_permissions'

export const AuthType = {
    Bearer: 'Bearer',
    None: 'None',
    ApiKey: 'ApiKey',
} as const

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType] // Lấy tất cả các giá trị của AuthType và tạo thành kiểu dữ liệu

export const ConditionGuard = {
    And: 'and',
    Or: 'or'
} as const

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard] // Lấy tất cả các giá trị của ConditionGuard và tạo thành kiểu dữ liệu

export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BLOCKED: 'BLOCKED'
} as const


export const TypeOfVerificationCode = {
    REGISTER: 'REGISTER',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    LOGIN: 'LOGIN',
    DISABLE_2FA: 'DISABLE_2FA'
} as const

export type TypeOfVerificationCodeType = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode] // Lấy tất cả các giá trị của TypeOfVerificationCode và tạo thành kiểu dữ liệu