let accessToken = null;

export const setAccessTokenStore = (token) => {
  accessToken = token;
};

export const getAccessTokenStore = () => {
  return accessToken;
};

export const clearAccessTokenStore = () => {
  accessToken = null;
};