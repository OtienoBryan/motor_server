import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      // Check if the route is marked as public
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        console.log('✅ [GlobalAuthGuard] Route is public, allowing access');
        return true;
      }

      console.log('🔒 [GlobalAuthGuard] Route requires authentication, checking JWT');
      // Apply JWT authentication for all other routes
      return this.jwtAuthGuard.canActivate(context);
    } catch (error) {
      console.error('❌ [GlobalAuthGuard] Error during authentication:', error);
      throw error;
    }
  }
}
