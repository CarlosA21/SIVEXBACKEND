import { Role } from "src/role/entities/role.entity";

export interface UserPayload {
  userId: number;
  firstName: string;
  lastName: string,
  email: string;
  role: Role;
  sid: number;
}
