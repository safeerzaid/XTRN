import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProductListCard from "../ui/ProductListCard";
import api from "../../api/axios";

function TrendingProducts() {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchPopularPicks = async () => {
      try {
        setLoading(true);
        // Fetch all real products from the backend (seeded from CSV)
        const response = await api.get("/products");
        const allProducts = response.data || [];

        // Filter out Accessories and ensure they have images
        const eligible = allProducts.filter((p) => p.category !== "Accessories" && (p.images || p.image));
        
        // Select first 8 products for consistency
        const selected = eligible.slice(0, 8).map((p) => ({
          ...p,
          _id: p._id || p.id // Ensure _id is present for ProductListCard Link
        }));
        
        setDisplayProducts(selected);
      } catch (error) {
        console.error("Failed to fetch popular picks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPicks();
  }, []);

  if (loading) return null; // or a subtle skeleton/spinner

  return (
    <section className="mt-12 md:mt-32 w-full px-0 sm:px-6 md:px-8 2xl:px-12 pb-10 md:pb-16 overflow-x-hidden">

      {/* Heading Row */}
      <div className="mb-5 md:mb-10 flex flex-col md:flex-row md:items-end justify-between px-4 sm:px-0 gap-4">
        <h2 className="font-nav text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
          Popular Picks
        </h2>
        
        <div className="flex items-center gap-6">
          <Link to="/products" className="font-nav text-gray-900 text-sm md:text-base font-medium hover:underline underline-offset-4">
            see more &rarr;
          </Link>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black"
            >
              <IoIosArrowBack size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black"
            >
              <IoIosArrowForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="px-4 sm:px-0">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 1.5,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 2.8,
              spaceBetween: 8,
            },
          }}
          className="!overflow-visible"
        >
          {displayProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductListCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}

export default TrendingProducts;
