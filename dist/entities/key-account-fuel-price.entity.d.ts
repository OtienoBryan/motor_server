import { KeyAccount } from './key-account.entity';
import { Staff } from './staff.entity';
export declare class KeyAccountFuelPrice {
    id: number;
    keyAccountId: number;
    keyAccount?: KeyAccount;
    price: number;
    notes: string | null;
    updatedBy: number | null;
    updatedByStaff?: Staff;
    created_at: Date;
}
