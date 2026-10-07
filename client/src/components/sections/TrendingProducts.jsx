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

        // Exact IDs of the "Best Sellers" requested by the user
        const bestSellerIds = [
          "6ab37a798fb0c7a49c50cae4", // XTRN Crew Neck Sweatshirt
          "6ab37a798fb0c7a49c50cae0", // XTRN Heavyweight Cotton Hoodie
          "6ab37a798fb0c7a49c50cb27", // XTRN Trail Blazer Hiking Boots
          "6ab37a798fb0c7a49c50cacd", // XTRN Women's Oversized Tee
          "6ab37a798fb0c7a49c50cb35", // XTRN ProWet All-Weather Jacket
          "6ab37a798fb0c7a49c50cacf", // XTRN Classic Muscle Tank
          "6ab37a798fb0c7a49c50cb56", // XTRN ClassicShield Sunglasses
          "6ab37a798fb0c7a49c50cae6"  // XTRN Oversized Sweatshirt
        ];

        // Map IDs to product objects and preserve the exact order
        const selected = bestSellerIds
          .map(id => allProducts.find(p => p._id === id || p.id === id))
          .filter(Boolean)
          .map(p => ({
            ...p,
            _id: p._id || p.id
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
      <div className="mb-5 md:mb-10 flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-0 gap-4">
        <h2 className="font-nav text-[22px] sm:text-2xl md:text-3xl font-bold text-black">
          Our Best Sellers
        </h2>
        
        <div className="flex items-center gap-6">
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gray-200 text-gray-700"
            >
              <IoIosArrowBack size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-gray-200 text-gray-700"
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
              slidesPerView: 1.4,
              spaceBetween: 2,
            },
            480: {
              slidesPerView: 2.3,
              spaceBetween: 2,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 2,
            },
            1024: {
              slidesPerView: 3.6,
              spaceBetween: 4,
            },
            1280: {
              slidesPerView: 4.0,
              spaceBetween: 4,
            }
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
