import IOrder from "shared/interfaces/IOrder";
import api from "../config/axios";

export type orderDTO = {
    isDelivery: boolean,
    addressId: number | null | undefined,
    observation: string,
    products: {
        id: number,
        quantity: number
      }[]
}

async function getAll() {
    return await api.get<IOrder[]>('/order');
}

async function getMyOrders() {
    return await api.get<IOrder[]>('/order/my');
}

async function getById(id:number) {
    return await api.get<IOrder>(`/order/${id}`);    
}

async function create(orderDTO: orderDTO) {
    return await api.post<IOrder>('/order', orderDTO);
}

async function getDeliveries() {
    return await api.get<IOrder[]>('/order/deliveries');    
}

async function getPending() {
    return await api.get<IOrder[]>('/order/pending');    
}

async function approve(id: number) {    
    return await api.post<IOrder>('/order/approve', id);    
}

async function disapprove(id: number) {    
    return await api.post<IOrder>('/order/disapprove', id);    
}

async function makeReady(id: number) {    
    return await api.post<IOrder>('/order/make-ready', id);    
}

async function sent(id: number) {    
    return await api.post<IOrder>('/order/sent', id);    
}

async function deliver(id: number) {    
    return await api.post<IOrder>('/order/deliver', id);    
}
export const OrderService = {
    getAll,
    getMyOrders,
    getById,
    create,
    getDeliveries,
    getPending,
    approve,
    disapprove,
    makeReady,
    sent,
    deliver
}