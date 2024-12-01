import IProduct from "../../../interfaces/IProduct";
import api from "../config/axios";

async function getAll(page: number, filter: string) {
    const { data } = await api.get<IProduct[]>(`/favorite?name=${filter}&page=${page}`);
    return data;
}

async function getTotalCount() {
    const { data } = await api.get<number>('/favorite/count');
    return data;
}

async function addFavorite(id: number) {
    const { data } = await api.post<IProduct>('/favorite', id);
    return data;
}

async function removeFavorite(id: number) {
    const { data } = await api.delete(`/favorite/${id}`);
    return data;
}
export const FavoriteService = {
    getAll,
    getTotalCount,
    addFavorite,
    removeFavorite
}