import IAddress from "../../../interfaces/IAddress";
import api from "../config/axios";

export type addressDTO = {
    neighborhood: string,
    street: string,
    postalCode: string,
    number: string,
    complement: string
}

async function getAll() {
    const { data } = await api.get<IAddress[]>('/address');
    return data;
}

async function getById(id: number) {
    const { data } = await api.get<IAddress>(`/address/${id}`);
    return data;
}

async function create(address: addressDTO) {
    return await api.post<IAddress>('/address', address);
}

async function update(id: number, address: addressDTO) {
    return await api.put<IAddress>(`/address/${id}`, address);
}

async function remove(id: number) {
    return await api.delete(`/address/${id}`);
}

export const AddressService = {
    getAll,
    getById,
    create,
    update,
    remove
}