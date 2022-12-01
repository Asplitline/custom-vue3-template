import { InjectionKey } from 'vue'

export type formatDateFunc = (v: number | string) => string
export type handleCodeFunc = (flag: boolean, message: string[], success?: () => void, fail?: () => void) => void

export const formateDateKey: InjectionKey<formatDateFunc> = Symbol('formateDate')
export const handleCodeKey: InjectionKey<handleCodeFunc> = Symbol('handleCode')
