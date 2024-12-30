export interface PaymentInfo {
    id?: number | null
    card: string | null;
    cardName: string | null;
    expiredDate: string | null;
    cardValidation: string | null;
}
