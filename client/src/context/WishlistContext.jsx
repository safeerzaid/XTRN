import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './authContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState(new Set());

  const fetchWishlist = useCallback(async (signal) => {
    if (!isLoggedIn) {
      setWishlist([]);
      setWishlistSet(new Set());
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/wishlist', { signal });
      const products = res.data.products || [];
      setWishlist(products);
      setWishlistSet(new Set(products.map(p => p._id)));
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        console.error('Failed to load wishlist', error);
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWishlist(controller.signal);
    return () => controller.abort();
  }, [fetchWishlist]);

  const isWishlisted = (productId) => wishlistSet.has(productId);
  const isPending = (productId) => pendingIds.has(productId);

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) return false;

    const productId = product._id;
    if (pendingIds.has(productId)) return false;

    setPendingIds(prev => {
      const newSet = new Set(prev);
      newSet.add(productId);
      return newSet;
    });

    const currentlyWishlisted = isWishlisted(productId);

    // Optimistic update
    setWishlistSet(prev => {
      const newSet = new Set(prev);
      if (currentlyWishlisted) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });

    setWishlist(prev => {
      if (currentlyWishlisted) {
        return prev.filter(p => p._id !== productId);
      } else {
        return [...prev, product];
      }
    });

    try {
      if (currentlyWishlisted) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post(`/wishlist/${productId}`);
      }
      return true;
    } catch (error) {
      // Revert on failure
      setWishlistSet(prev => {
        const newSet = new Set(prev);
        if (currentlyWishlisted) newSet.add(productId);
        else newSet.delete(productId);
        return newSet;
      });
      setWishlist(prev => {
        if (currentlyWishlisted) {
          return [...prev, product];
        } else {
          return prev.filter(p => p._id !== productId);
        }
      });
      console.error('Wishlist toggle failed:', error);
      return false;
    } finally {
      setPendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) return;

    // We need the product object for revert, finding it in current list
    const product = wishlist.find(p => p._id === productId);
    if (!product) return;

    setWishlistSet(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setWishlist(prev => prev.filter(p => p._id !== productId));

    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (error) {
      // Revert on failure
      setWishlistSet(prev => {
        const newSet = new Set(prev);
        newSet.add(productId);
        return newSet;
      });
      setWishlist(prev => [...prev, product]);
      console.error('Wishlist remove failed:', error);
    }
  };


  return (
    <WishlistContext.Provider value={{
      wishlist,
      count: wishlist.length,
      isWishlisted,
      isPending,
      toggleWishlist,
      removeFromWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
