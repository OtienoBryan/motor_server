import { KeyAccount } from './key-account.entity';
export declare class Vehicle {
    id: number;
    key_account_id: number;
    keyAccount?: KeyAccount;
    registration_number: string;
    model: string;
    driver_name: string;
    driver_contact: string;
    created_at: Date;
    updated_at: Date;
}
