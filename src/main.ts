import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SecurityInterceptor } from './auth/security.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security middleware
  app.use(helmet({
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
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Changed to false to allow extra fields without throwing errors
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
      return new HttpException(
        {
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        },
        400,
      );
    },
  }));

  // Global security interceptor
  app.useGlobalInterceptors(new SecurityInterceptor());
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  // Enhanced CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002', 
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8080',
        'https://motorclient.vercel.app',
        'https://*.vercel.app', // Allow all Vercel preview deployments
      ];
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log('🌐 [CORS] Allowing request with no origin');
        return callback(null, true);
      }
      
      // Check if origin matches allowed list or is a Vercel domain
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
      } else {
        console.log(`❌ [CORS] Blocking origin: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`🔒 Security features enabled: Helmet, CORS, Validation`);
}
bootstrap();
