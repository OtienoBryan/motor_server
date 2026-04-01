export declare class CustomerCard {
    id: number;
    key_account_id: number;
    account_type: string;
    card_format: string;
    status: string;
    last_four: string | null;
    created_at: Date | null;
    pan_full: string | null;
    expiry_mm_yy: string | null;
    cvc: string | null;
    points_history: number;
    amount_balance: number;
}
