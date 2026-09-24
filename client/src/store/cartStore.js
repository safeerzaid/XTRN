import { create } from 'zustand'
import api from '../api/axios'

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/cart')
      set({ items: response.data.items || [], loading: false })
    } catch (error) {
      console.log('Failed to fetch cart:', error)
      set({ loading: false })
    }
  },

  addItem: async (productId, size, quantity = 1) => {
    try {
      const response = await api.post('/cart', { productId, size, quantity })
      set({ items: response.data.items })
    } catch (error) {
      console.log('Failed to add item:', error)
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cart/${itemId}`, { quantity })
      set({ items: response.data.items })
    } catch (error) {
      console.log('Failed to update quantity:', error)
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`)
      set({ items: response.data.items })
    } catch (error) {
      console.log('Failed to remove item:', error)
    }
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }
}))

export default useCartStore