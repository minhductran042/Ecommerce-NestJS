import { SetMetadata } from "@nestjs/common";
import { AuthTypeType, ConditionGuard, ConditionGuardType } from "../constants/auth.constant";

export const AUTH_TYPES_KEY = 'authType';
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[]; 
  options: {
    condition: ConditionGuardType;
}}

export const Auth = (authTypes: AuthTypeType[], options?: { condition: ConditionGuardType } ) => {
    return SetMetadata(AUTH_TYPES_KEY, {authTypes, options: options ?? {condition: ConditionGuard.And}}) 
}