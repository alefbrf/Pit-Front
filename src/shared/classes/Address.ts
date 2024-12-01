import IAddress from "../interfaces/IAddress";

export class Address implements IAddress {
    constructor(address: IAddress) {
        this.id = address.id;
        this.neighborhood = address.neighborhood;
        this.street = address.street;
        this.postalCode = address.postalCode;
        this.number = address.number;
        this.complement = address.complement;
    }
    id: number;
    neighborhood: string;
    street: string;
    postalCode: string;
    number: string;
    complement: string;
}