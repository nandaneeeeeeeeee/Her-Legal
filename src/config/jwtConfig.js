export const getJwtConfig = () => {
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'herlegal-local-secret-2026';

  if (!jwtSecret) {
    console.error("JWT secret is not configured!");
    throw new Error("JWT secret not configured. Check your .env file.");
  }

  return {
    accessToken: { secret: jwtSecret, options: { expiresIn: '7d' } },
    refreshToken: { secret: jwtSecret, options: { expiresIn: '15d' } },
  };
};
