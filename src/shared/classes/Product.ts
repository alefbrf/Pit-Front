import IProduct from "../interfaces/IProduct";
import PriceFormat from "../Utils/PriceFormat";

export class Product implements IProduct {
    constructor(product: IProduct) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.imageUrl = product.imageUrl;
        this.favorite = product.favorite;
        this.checked = product.checked;
        this.quantity = product.quantity;
    }
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    favorite: boolean;
    checked: boolean;
    quantity: number;
    get formatedPrice() {
        return PriceFormat(this.price);
    }
}