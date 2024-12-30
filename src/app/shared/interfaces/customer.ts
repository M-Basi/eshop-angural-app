import { Order } from "./order";
import { User } from "./java-backend";
import { CustomerInfo } from "./customer-info";
import { PaymentInfo } from "./payment-info";

export interface Customer {
    uuid: string;
    firstname: string;
    lastname: string;
    userReadOnlyDTO: User;
    
    customerInfoReadOnlyDTO: CustomerInfo | null;  
    paymentInfoReadOnlyDTO: PaymentInfo | null;
    ordersReadOnlyDTOs: Order[]
}
