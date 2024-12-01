
import IOrder from "shared/interfaces/IOrder";
import api from "../config/axios";
import IUser from "shared/interfaces/IUser";
import IConfigs from "shared/interfaces/IConfigs";


async function getDeliveryMans() {
    return await api.get<IUser[]>('/admin/delivery-man');
}

async function updateOrderDeliveyMan(id: number, deliveryManId: number | null) {
    return await api.post<IOrder>(`/admin/update-delivery-man/${id}`, deliveryManId);
}

async function getConfigs() {
    return await api.get<IConfigs>('/admin/config');
}

async function saveConfigs(config: IConfigs) {
    return await api.post<IConfigs>('/admin/config', config);
}

async function createDeliveryMan(userDTO: {
    name: string,
    email: string,
    password: string,
}) {
    return await api.post('admin/create-delivery-man', userDTO);
}

export const AdminService = {
    getDeliveryMans,
    updateOrderDeliveyMan,
    getConfigs,
    saveConfigs,
    createDeliveryMan
}