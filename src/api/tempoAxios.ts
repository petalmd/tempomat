import axios from 'axios'
import authenticator from '../config/authenticator'

const tempoAxios = axios.create({
    baseURL: 'https://api.tempo.io/4'
})

tempoAxios.interceptors.request.use(async function (axiosConfig) {
    const tempoToken = await authenticator.getTempoToken()
    if ( tempoToken !== undefined ) {
        axiosConfig.headers.Authorization = `Bearer ${tempoToken}`
    }
    return axiosConfig
})

export default tempoAxios
