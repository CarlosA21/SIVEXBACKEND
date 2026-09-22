import { Entity, PrimaryColumn } from 'typeorm';

@Entity('role_permission')
export class RolePermission {
    @PrimaryColumn({ name: 'id' })
    roleId: number;

    @PrimaryColumn({ name: 'id' })
    permissionId: number;
}