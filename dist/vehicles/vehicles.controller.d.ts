import { VehiclesService } from './vehicles.service';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findByKeyAccount(keyAccountId: string): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    create(createVehicleDto: CreateVehicleDto): Promise<Vehicle>;
    update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
