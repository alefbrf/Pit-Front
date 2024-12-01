import IProduct from "../../../interfaces/IProduct";
import api from "../config/axios";

export type productDTO = {
    name: string,
    description: string,
    price: number,
    imageUrl: string
}

async function getAll(page: number, filter: string) {
    const { data } = await api.get<IProduct[]>(`/products?name=${filter}&page=${page}`);
    return data;
}

async function getById(id: number) {
    const { data } = await api.get<IProduct>(`/products/${id}`);
    return data;
}

async function getTotalCount() {
    const { data } = await api.get<number>('/products/count');
    return data;
}

async function create(productDTO: productDTO) {
    return await api.post<IProduct>('/products', productDTO);
}

async function update(id: number, productDTO: productDTO) {
    return await api.put<IProduct>(`/products/${id}`, productDTO);
}

async function remove(id: number) {
    return await api.delete<IProduct>(`/products/${id}`);
}


export const ProductService = {
    getAll,
    getById,
    getTotalCount,
    create,
    update,
    remove
}