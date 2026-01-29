"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const security_interceptor_1 = require("./auth/security.interceptor");
const http_exception_filter_1 = require("./common/http-exception.filter");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: false,
        exceptionFactory: (errors) => {
            console.error('❌ [ValidationPipe] Validation errors:', errors);
            const messages = errors.map(error => {
                return Object.values(error.constraints || {}).join(', ');
            });
            return new common_1.HttpException({
                statusCode: 400,
                message: 'Validation failed',
                errors: messages,
            }, 400);
        },
    }));
    app.useGlobalInterceptors(new security_interceptor_1.SecurityInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3002',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:8080',
                'https://motorclient.vercel.app',
                'https://*.vercel.app',
            ];
            if (!origin) {
                console.log('🌐 [CORS] Allowing request with no origin');
                return callback(null, true);
            }
            const isAllowed = allowedOrigins.some(allowed => {
                if (allowed.includes('*')) {
                    const pattern = allowed.replace('*', '.*');
                    return new RegExp(pattern).test(origin);
                }
                return origin === allowed;
            });
            if (isAllowed) {
                console.log(`✅ [CORS] Allowing origin: ${origin}`);
                callback(null, true);
            }
            else {
                console.log(`❌ [CORS] Blocking origin: ${origin}`);
                callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400,
    });
    const port = process.env.PORT ?? 5009;
    const host = process.env.HOST ?? '0.0.0.0';
    await app.listen(port, host);
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`🌐 Server accessible from: http://139.59.2.43:${port}`);
    console.log(`🔒 Security features enabled: Helmet, CORS, Validation`);
}
bootstrap();
//# sourceMappingURL=main.js.map