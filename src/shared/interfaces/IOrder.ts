import IProduct from "./IProduct";

export default interface IOrder {
    id: number;
    address: string;
    code: string;
    createdDate: string;
    isDelivery: boolean;
    delivered: string;
    disapproved: string;
    estimatedTime: string;
    inDelivery: string;
    preparing: string;
    observation: string;
    ready: string;
    price: number;
    userId: number;
    status: string;
    createdDateFormated: string;
    deliveryManId: number | null;
    products: IProduct[]
}