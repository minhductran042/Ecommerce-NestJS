

export interface AccessTokenPayloadCreate {
    userId: number,
    deviceId: number,
    roleId: number,
    roleName: string,
}

export interface RefreshTokenPayloadCreate {
    userId: number,
}


export interface AccessTokenPayload extends AccessTokenPayloadCreate {
    exp: number
    iat: number
}


export interface RefreshTokenPayLoad extends RefreshTokenPayloadCreate {
    exp: number
    iat: number
}