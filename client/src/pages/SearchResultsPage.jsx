import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListCard from '../components/ui/ProductListCard';
import api from '../api/axios';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Reset state on new query
    setProducts([]);
    setPage(1);
    setTotalPages(1);
    setTotalProducts(0);
    setError('');
    
    if (query.trim() === '') return;

    fetchResults(query, 1);
  }, [query]);

  const fetchResults = async (q, pageNum) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(q)}&page=${pageNum}&limit=12`);
      if (pageNum === 1) {
        setProducts(response.data.products);
      } else {
        setProducts(prev => [...prev, ...response.data.products]);
      }
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(query, nextPage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <main className="flex-grow px-4 md:px-8 py-8 w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-nav font-bold uppercase mb-2">
            Search Results for "{query}"
          </h1>
          {!isLoading && query && (
            <p className="text-gray-600 font-nav">
              {totalProducts} {totalProducts === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center font-nav">
            {error}
          </div>
        )}

        {!query.trim() && (
          <div className="text-center py-20">
            <h2 className="text-xl font-nav text-gray-500">Please enter a search term</h2>
          </div>
        )}

        {isLoading && products.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          </div>
        )}

        {!isLoading && products.length === 0 && query.trim() !== '' && !error && (
          <div className="text-center py-20">
            <h2 className="text-xl font-nav text-gray-500 mb-4">No results found for '{query}'</h2>
            <p className="text-gray-400">Try checking your spelling or using different keywords.</p>
          </div>
        )}

        {products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <ProductListCard key={product._id} product={product} />
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-12 mb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-black text-white font-nav uppercase tracking-wider text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
