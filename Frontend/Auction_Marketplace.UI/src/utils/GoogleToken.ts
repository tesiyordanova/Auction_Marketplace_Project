export const getToken = (): string | null => {
  return sessionStorage.getItem('token');
};

export const setToken = (token: string): void => {
  sessionStorage.setItem('token', token);
};

export const clearToken = (): void => {
  sessionStorage.removeItem('token');
};

export const isTokenExpired = (): boolean => {
  const token = getToken();
  
  if (token) {
    const decodedToken = parseToken(token);
    const currentTime = Math.floor(Date.now() / 1000); 
    return currentTime >= decodedToken.exp;
  }

  return true; 
};

export const parseToken = (token: string): any => {
  const payloadBase64 = token.split('.')[1];
  const decodedPayload = atob(payloadBase64);
  return JSON.parse(decodedPayload);
};
