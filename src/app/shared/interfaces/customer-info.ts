import { Region } from "./region";
export interface CustomerInfo {
    id?: number | null;
    phoneNumber: string | null;
    country: string | null;
    region: Region | null;

    city: string | null;

    street: string | null;

    streetNumber: string | null;

    zipCode: string | null;
}
