import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StaffService, StaffStats } from './staff.service';
import { Staff } from '../entities/staff.entity';
import { Department } from '../entities/department.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get()
  async findAll(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Get('departments')
  async getDepartments(): Promise<Department[]> {
    return this.staffService.getDepartments();
  }

  @Post()
  async create(@Body() createStaffDto: Partial<Staff>): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStaffDto: Partial<Staff>
  ): Promise<Staff> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    if (!file) {
      throw new Error('No image file provided');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    return this.cloudinaryService.uploadImage(file, 'staff');
  }


  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.staffService.remove(id);
    return { message: 'Staff member deleted successfully' };
  }

}
