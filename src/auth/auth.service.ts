import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcryptjs';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  async validateStaff(email: string, password: string): Promise<Staff | null> {
    console.log('🔍 [AuthService] Validating staff with email:', email);
    
    try {
      // Input validation
      if (!email || !password) {
        console.log('❌ [AuthService] Missing email or password');
        return null;
      }

      if (!email.includes('@')) {
        console.log('❌ [AuthService] Invalid email format:', email);
        return null;
      }
      
      const staff = await this.staffRepository.findOne({ where: { business_email: email } });
      
      if (!staff) {
        console.log('❌ [AuthService] No staff found with email:', email);
        return null;
      }
      
      console.log('✅ [AuthService] Staff found:', {
        id: staff.id,
        name: staff.name,
        email: staff.business_email,
        is_active: staff.is_active
      });
      
      if (!staff.is_active) {
        console.log('❌ [AuthService] Staff is not active');
        return null;
      }

      // Secure password comparison using bcrypt
      if (!staff.password) {
        console.error('❌ [AuthService] Staff password is null or empty');
        return null;
      }
      
      let isPasswordValid = false;
      try {
        // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (staff.password.startsWith('$2')) {
          isPasswordValid = await bcrypt.compare(password, staff.password);
        } else {
          // If password is not hashed, compare directly (for migration purposes)
          console.warn('⚠️ [AuthService] Password is not hashed, comparing directly');
          isPasswordValid = password === staff.password;
        }
        console.log('🔐 [AuthService] Password validation result:', isPasswordValid);
      } catch (bcryptError) {
        console.error('❌ [AuthService] Bcrypt comparison error:', bcryptError);
        console.error('❌ [AuthService] Password hash format:', staff.password?.substring(0, 10));
        return null;
      }
      
      if (!isPasswordValid) {
        console.log('❌ [AuthService] Invalid password');
        return null;
      }

      console.log('✅ [AuthService] Staff validation successful');
      return staff;
    } catch (error) {
      console.error('❌ [AuthService] Database error during validation:', error);
      
      // Handle specific database errors
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ [AuthService] Database connection refused');
        throw new InternalServerErrorException('Database connection failed. Please try again later.');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('❌ [AuthService] Database request timeout');
        throw new InternalServerErrorException('Database request timeout. Please try again.');
      } else {
        console.error('❌ [AuthService] Unknown database error:', error);
        throw new InternalServerErrorException('Authentication service temporarily unavailable');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    console.log('🔐 [AuthService] Starting login process');
    
    try {
      const { email, password } = loginDto;
      
      // Basic input validation
      if (!email || !password) {
        console.log('❌ [AuthService] Missing email or password in login request');
        throw new UnauthorizedException('Email and password are required');
      }
      
      const staff = await this.validateStaff(email, password);
      if (!staff) {
        console.log('❌ [AuthService] Staff validation failed');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const tokenPayload = {
        sub: staff.id,
        email: staff.business_email,
        role: staff.role,
        name: staff.name,
        iat: Math.floor(Date.now() / 1000)
      };
      
      const token = this.jwtService.generateToken(tokenPayload);

      console.log('✅ [AuthService] Login successful for:', email);
      
      return {
        token,
        user: {
          id: staff.id,
          email: staff.business_email,
          firstName: staff.name.split(' ')[0] || staff.name,
          lastName: staff.name.split(' ').slice(1).join(' ') || '',
          role: staff.role,
          department: staff.department || '',
        },
      };
    } catch (error) {
      console.error('❌ [AuthService] Login error:', error);
      console.error('❌ [AuthService] Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('❌ [AuthService] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : typeof error,
        code: (error as any)?.code,
      });
      
      // Re-throw HTTP exceptions as-is (UnauthorizedException, InternalServerErrorException, etc.)
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      // Handle database connection errors
      if (error instanceof Error && (error.message.includes('Database') || error.message.includes('connection'))) {
        throw new InternalServerErrorException('Authentication service temporarily unavailable. Please try again later.');
      }
      
      // Handle JWT errors
      if (error instanceof Error && error.message.includes('Token')) {
        throw new InternalServerErrorException('Token generation failed. Please try again.');
      }
      
      // For any other unexpected errors, log them and return a generic error
      console.error('❌ [AuthService] Unexpected error type:', error);
      throw new InternalServerErrorException('Login failed. Please try again.');
    }
  }

  async getStaffById(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { id } });
  }

  async validateToken(token: string): Promise<Staff | null> {
    try {
      const payload = this.jwtService.verifyToken(token);
      if (!payload || !payload.sub) {
        console.log('❌ [AuthService] Invalid token payload');
        return null;
      }
      
      if (this.jwtService.isTokenExpired(token)) {
        console.log('❌ [AuthService] Token expired');
        return null;
      }
      
      return this.getStaffById(payload.sub);
    } catch (error) {
      console.error('❌ [AuthService] Token validation error:', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
