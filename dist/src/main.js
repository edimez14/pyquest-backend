"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const rawOrigins = process.env.CORS_ALLOWED_ORIGINS ?? '';
    const allowedOrigins = rawOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.enableCors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const port = Number(process.env.PORT ?? 8218);
    await app.listen(port, '0.0.0.0');
}
void bootstrap();
//# sourceMappingURL=main.js.map