import { getToken, clearToken, isTokenExpired, parseToken } from './GoogleToken';

export const RefreshToken = (): void => {
    const token = getToken();

    if (token && !isTokenExpired()) {
        try {
            const refreshedToken = extendTokenExpiration(token);
            localStorage.setItem('token', refreshedToken);
            sessionStorage.setItem('token', refreshedToken);
        } catch (error) {
            console.error('Error refreshing token:', error);
            clearToken();
        }
    }
};

const extendTokenExpiration = (token: string): string => {
    const decodedToken = parseToken(token);
    const newExpirationTime = Math.floor(Date.now() / 1000) + 6600; 
    const newTokenPayload = { ...decodedToken, exp: newExpirationTime };
    return generateToken(newTokenPayload);
};

const generateToken = (payload: object): string => {
    const payloadBase64 = btoa(JSON.stringify(payload));
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payloadBase64}.signature`;
};
