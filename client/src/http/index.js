import axios from "axios";

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL 
})

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const authIntercheptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authIntercheptor)

export {
    $host,
    $authHost
}