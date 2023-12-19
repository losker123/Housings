import { $authHost, $host } from ".";

export const getAllCategory = async () => {
    const {data} = await $host.get('api/category')
    return data
}

export const createCategory = async (name) => {
    const {data} = await $authHost.post('api/category/create', name)
    return data
}

export const deleteCategory = async (id) => {
    const {data} = await $host.get('api/category/delete/' + id)
    return data
}
