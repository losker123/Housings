import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    const { data } = await $host.post("api/user/registration", { email, password, role: 'USER' })
    localStorage.setItem('token', data.token)
    localStorage.setItem('isAuth', true)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const { data } = await $host.post("api/user/login", { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('isAuth', true)
    return jwtDecode(data.token)
}

export const check = async () => {
    const response = await $authHost.post('api/user/check')
    localStorage.setItem('token', response.data)
    return response
}

export const getAllRentls = async (id) => {
    const {data} = await $authHost.get('api/user/renters/' + id)
    return data
} 

export const getAllUserReviews = async (id) => {
    const {data} = await $authHost.get('api/user/reviews/' + id)
    return data
}

export const getUserHousing = async (id) => {
    const {data} = await $authHost.get('api/user/owner/' + id)
    return data
}