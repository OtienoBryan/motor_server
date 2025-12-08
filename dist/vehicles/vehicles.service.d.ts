import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesService {
    private vehicleRepository;
    private keyAccountRepository;
    constructor(vehicleRepository: Repository<Vehicle>, keyAccountRepository: Repository<KeyAccount>);
    findByKeyAccount(keyAccountId: number): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    create(createVehicleDto: CreateVehicleDto): Promise<Vehicle>;
    update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: number): Promise<void>;
}
