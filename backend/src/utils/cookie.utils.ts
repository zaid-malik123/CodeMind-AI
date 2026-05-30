import { AUTH_COOKIES, COOKIE_OPTIONS, COOKIE_EXPIRATION } from "../constants/constant.js"
import type { Response } from "express";

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {

    res.cookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: COOKIE_EXPIRATION.ACCESS_TOKEN,
    })

    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: COOKIE_EXPIRATION.REFRESH_TOKEN,
    })

}