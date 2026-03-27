export const envConfig = () => ({
  port: Number(process.env.PORT ?? 8008),
  databaseUrl: process.env.DATABASE_URL,
});
