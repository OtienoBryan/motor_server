import { StaffService } from './staff.service';
import { Staff } from '../entities/staff.entity';
import { Department } from '../entities/department.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class StaffController {
    private readonly staffService;
    private readonly cloudinaryService;
    constructor(staffService: StaffService, cloudinaryService: CloudinaryService);
    findAll(): Promise<Staff[]>;
    getDepartments(): Promise<Department[]>;
    create(createStaffDto: Partial<Staff>): Promise<Staff>;
    update(id: number, updateStaffDto: Partial<Staff>): Promise<Staff>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        public_id: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
