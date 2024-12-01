import IProduct from "../../../interfaces/IProduct";
import api from "../config/axios";

async function getAll(page: number, filter: string, limit = 10) {
    const { data } = await api.get<IProduct[]>(`/cart?name=${filter}&page=${page}&limit=${limit}`);
    return data;
}

async function getTotalCount() {
    const { data } = await api.get<number>('/cart/count');
    return data;
}

async function addItemCart(id: number) {
    return await api.post<IProduct>('/cart', id);
}

async function removeItemCart(id: number) {
    return await api.delete(`/cart/${id}`);
}

export const CartService = {
    getAll,
    getTotalCount,
    addItemCart,
    removeItemCart
}