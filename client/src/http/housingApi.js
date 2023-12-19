import { $authHost, $host } from ".";

export const deleteHousing = async (id) => {
    const { data } = await $host.get('api/housing/delete/' + id);
    return data;
};

export const rentHousing = async (rentData) => {
    const { data } = await $host.post('api/housing/rent', rentData);
    return data;
};

export const canseleRent = async (id) => {
    const { data } = await $authHost.get('api/housing/censele/rent/' + id);
    return data;
};

export const getAllHousing = async () => {
    const { data } = await $host.get('api/housing/')
    return data
}

export const getOneHousing = async (id) => {
    const { data } = await $host.get('api/housing/' + id)
    return data
}

export const createHousing = async (housing) => {
    const { data } = await $authHost.post('api/housing/create', housing)
    return data
}

export const updateHousing = async (id, housing) => {
    const { data } = await $authHost.post(`api/housing/update/${id}`, housing);
    return data;
};

export const deleteCategory = async (id) => {
    const { data } = await $host.get('api/category/delete/' + id)
    return data
}

export const getRenters = async (id) => {
    const { data } = await $host.get('api/housing/renters/' + id)
    return data
}

export const getAllReviews = async (id) => {
    const { data } = await $host.get('api/housing/all-review/' + id)
    return data
}

export const deleteReview = async (id) => {
    const { data } = await $host.get('api/housing/del-review/' + id)
    return data
}

export const getOneReview = async (id) => {
    const { data } = await $host.get('api/housing/one-review/' + id)
    return data
}

export const addReview = async (id, reviewData) => {
    try {
        const { data } = await $authHost.post('api/housing/review/' + id, reviewData);
        return data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('Произошла ошибка при добавлении отзыва');
        }
    }
};
