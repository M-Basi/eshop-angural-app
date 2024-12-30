import { Category } from "./java-backend";
import { Brand } from "./java-backend";

export interface OrderItem {
        id: number | null;
        name: string;
        brand: Brand | null
        sku: string;
        price: number | null;
        category: Category | null
        quantity: number | null;
        image: {
                filename: string,
                savedName: string,
                filePath: string,
                contentType: string,
                extension: string,
            }
        totalPrice: number | null;
}
