import { Category } from "./java-backend"
import { Brand } from "./java-backend"

export interface Product {
    id: number
    uuid: string 
    name: string
    brand: Brand
    sku: string
    price: number
    category: Category
    quantity: number
    description: string
    isActive: boolean
    isInStock: boolean
    image: {
        filename: string,
        savedName: string,
        filePath: string,
        contentType: string,
        extension: string,
    }
}
