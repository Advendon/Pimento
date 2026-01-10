export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    passwordHash: string;
    phone?: string;
    timezone: string;
    locale: string;
    isActive: boolean;
    settings?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    ADMIN = "admin",
    SALES = "sales",
    PRODUCTION = "production",
    CLIENT = "client",
    PRODUCTION_MANAGER = "production_manager",
    SHOP_MANAGER = "shop_manager",
    ACCOUNTANT = "accountant"
}
//# sourceMappingURL=User.d.ts.map