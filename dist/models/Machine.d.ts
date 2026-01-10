export interface Machine {
    id: string;
    organizationId: string;
    name: string;
    machineType: MachineType;
    makeModel?: string;
    purchasePrice?: number;
    purchaseDate?: Date;
    usefulLifeHours?: number;
    usefulLifeYears?: number;
    powerKw?: number;
    warrantyInfo?: Record<string, any>;
    serialNumber?: string;
    consumableCodes?: string[];
    maintenanceSchedule?: Record<string, any>;
    insuranceCostYr?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum MachineType {
    DTF = "DTF",
    UV = "UV",
    SCREEN = "Screen",
    LASER = "Laser",
    VINYL = "Vinyl",
    THREE_D = "3D"
}
//# sourceMappingURL=Machine.d.ts.map