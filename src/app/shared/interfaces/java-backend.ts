export interface ProductFilters {
    name?: string | null; // Allows null
    brand?: string | null;
    category?: string | null;
    isActive?: true | null;
    isInStock?: true | null;
    uuid?: string | null;
    id?: string | null;
    sku?: string | null;

}

export interface CustomerFilters {
    username?: string | null; // Allows null
    phoneNumber?: string | null;
    lastname?: string | null;
    active?: true | null;
    orderId?: true | null;
    uuid?: string | null;
    id?: string | null;
    

}

export interface User {
    uuid?: string,
    username: string,
    password?: string,
    role?: string,
    active?: boolean
}

export interface Credentials{
    username: string | undefined;
    password: string | undefined;
    
}

export interface LoggedInUser {
    firstname: string;
    userUuid: string,
    username: string,
    role: string,
    
}

export interface Brand {
    id: number
    brandName: string
}

export interface Category {
    id: number
    categoryName: string
}

export interface AuthenticationResponse {
    firstname: string
    userUuid: string
    token: string

}

export interface PaginatedResponse<T> {
    data: T[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    currentPage: number;
    pageSize: number;
  }


