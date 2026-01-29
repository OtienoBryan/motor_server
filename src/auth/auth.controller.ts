import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('🔐 [AuthController] Login request received:', { email: loginDto.email });
      const result = await this.authService.login(loginDto);
      console.log('✅ [AuthController] Login successful');
      return result;
    } catch (error) {
      console.error('❌ [AuthController] Login error:', error);
      console.error('❌ [AuthController] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : typeof error,
        stack: error instanceof Error ? error.stack : 'No stack',
      });
      // Re-throw the error so NestJS can handle it properly
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const staff = await this.authService.getStaffById(req.user.sub);
    if (!staff) {
      throw new Error('Staff not found');
    }

    return {
      id: staff.id,
      email: staff.business_email,
      firstName: staff.name.split(' ')[0] || staff.name,
      lastName: staff.name.split(' ').slice(1).join(' ') || '',
      role: staff.role,
      department: staff.department || '',
    };
  }
}
