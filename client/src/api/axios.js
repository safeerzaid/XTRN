import axios from "axios"
import { getAccessTokenStore, setAccessTokenStore, clearAccessTokenStore } from './tokenStore'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenStore()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true

      try {
        const response = await api.post("/auth/refresh")

        const newAccessToken = response.data.accessToken

        setAccessTokenStore(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        clearAccessTokenStore()

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api