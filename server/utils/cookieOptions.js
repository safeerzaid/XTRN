export const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
  
  if (maxAge !== undefined) {
    options.maxAge = maxAge;
  }
  
  return options;
};
