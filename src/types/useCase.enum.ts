export enum UseCase {
    DEFAULT = "default",
    SIGNIN = "singin",
    SIGNUP = "signup"
}

export type UseCaces = (typeof UseCase)[keyof typeof UseCase];