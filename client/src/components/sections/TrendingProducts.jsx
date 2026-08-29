import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import ProductCard from "../ui/ProductCard";
import { trendingProducts } from "../../data/Products";

function TrendingProducts() {
  const swiperRef = useRef(null);

  return (
    <section className="mx-auto mt-16 md:mt-40 max-w-[1600px] 2xl:max-w-[2200px] px-0 sm:px-6 md:px-14 2xl:px-20 pb-10 md:pb-16 overflow-x-hidden">

      {/* Heading + nav arrows */}
      <div className="mb-5 md:mb-10 flex items-center justify-between">
      <h2 className="font-nav text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold px-4 sm:px-0">
          Popular Picks
        </h2>

        {/* Arrows: tablet + desktop */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="h-9 w-9 lg:h-12 lg:w-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black hover:scale-105"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="h-9 w-9 lg:h-12 lg:w-12 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black hover:scale-105"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Swiper wrapper */}
      <div>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            0: {
              slidesPerView: 1.18,
              slidesPerGroup: 1,
              spaceBetween: 12,
            },
            600: {
              slidesPerView: 2.2,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              spaceBetween: 8,
            },
            1536: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
          }}
          className="!overflow-visible"
        >
          {trendingProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
}

export default TrendingProducts;


