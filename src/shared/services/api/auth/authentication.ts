import IUser from "shared/interfaces/IUser";

const TOKEN_KEY = "token";
const USER_KEY = "user";
export function isAuthenticated () {
    return localStorage.getItem(TOKEN_KEY) !== null;
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(Token: string) {
    if (!Token) {
        return;
    }
    localStorage.setItem(TOKEN_KEY, Token);

    const user = JSON.parse(atob(Token.split('.')[1])) as IUser;
    if (!user) return;

    setUser(user);
}

export function setUser(user: IUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    let data: any = localStorage.getItem(USER_KEY);
    if (!data) return null;

    const user = JSON.parse(data) as IUser;
    if (!user) return null;
    return user;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}