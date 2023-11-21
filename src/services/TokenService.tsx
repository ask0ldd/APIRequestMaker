class TokenService {
    public static setToken(userId : number, token : string) : void {
        document.cookie = `id=${userId}; Secure`
        document.cookie = `token=${ token}; Secure`
    }

    public static isTokenAlive() : boolean {
        const cookie = document.cookie
        return cookie.search("token")===-1 ? false : true
    }

    public static getToken() : string | null
    {   
        const token = document.cookie.split('; ').find((cookie) => cookie.startsWith('token='))?.split('=')[1]
        return token !== undefined ? token : null
    }
}

export default TokenService