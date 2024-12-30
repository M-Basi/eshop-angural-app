import { OrderItem } from "./order-item";

export interface Order {
    id: number | null;
    uuid: string | null;
    createdDate: string | null;
    orderTrackingNumber: string| null;
    totalPrice: number| null;
    status: string| null;
    orderItems: OrderItem[] | null;

}
