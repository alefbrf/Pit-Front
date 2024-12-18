import { Role } from "../Enums/Role";
import IUser from "../interfaces/IUser";

export class User implements IUser {
    constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
    id: number;
    email: string;
    name: string;
    role: Role;
}