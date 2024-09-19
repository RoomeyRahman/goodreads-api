export interface IBase {
    readonly id?: number;
    readonly isActive?: boolean;
    readonly isDeleted?: boolean;
    readonly createAt?: Date;
    readonly createdBy?: string;
    readonly updatedAt?: Date;
    readonly updatedBy?: string;
}
