import { Role } from "shared/Enums/Role";

export default interface IUser {
    id: number;
    name: string,
    email: string,
    role: Role
}