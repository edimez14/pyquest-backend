export const envConfig = () => ({
  port: Number(process.env.PORT ?? 8008),
  databaseUrl: process.env.DATABASE_URL,
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
});
