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

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          refreshQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      isRefreshing = true

      try {
        const response = await api.post("/auth/refresh")
        const newAccessToken = response.data.accessToken

        setAccessTokenStore(newAccessToken)

        refreshQueue.forEach(p => p.resolve(newAccessToken))
        refreshQueue = []

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        refreshQueue.forEach(p => p.reject(refreshError))
        refreshQueue = []
        clearAccessTokenStore()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api