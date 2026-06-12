import axios from 'axios'
import { ref } from 'vue'

const SESSION_KEY = import.meta.env.VITE_SESSION_KEY || 'session'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
        const token = JSON.parse(session)?.access_token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response?.status === 401) {
        //     localStorage.removeItem('token')
        //     window.location.href = '/login'
        // }
        return Promise.reject(error)
    }
)

export function useHttp() {

    const loading = ref(false)

    const request = async (config) => {

        loading.value = true
        
        try {
            const response = await api(config)

            return { success: true, status: response.status, response: response.data, message: response.data?.message ?? null }

        } catch (error) {

            return { success: false, status: error.response?.status ?? 500, response: error.response?.data ?? null, message: error.response?.data?.message ?? error.message ?? 'Error desconocido' }

        } finally {
            loading.value = false
        }

    }

    const setToken = (session) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
    }

    const clearToken = () => {
        delete api.defaults.headers.common['Authorization']
    }

    return { loading, request, setToken, clearToken }

}
