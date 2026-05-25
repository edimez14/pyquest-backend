export declare const envConfig: () => {
    port: number;
    databaseUrl: string | undefined;
    corsAllowedOrigins: string;
    nodeEnv: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    compilerProviderUrl: string;
    compilerProviderApiKey: string;
    compilerPythonLanguageId: number;
    compilerMaxTimeoutMs: number;
};
