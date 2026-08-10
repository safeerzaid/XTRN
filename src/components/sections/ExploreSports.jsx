import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { sportsCategories } from "../../data/Sports";

function SportCard({ sport }) {
  return (
    <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
      {/* Background image */}
      <img
        src={sport.image}
        alt={sport.name}
        className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Sport name */}
      <h3 className="
        absolute bottom-0 left-0 right-0
        pl-3 pb-3
        md:pl-4 md:pb-4
        lg:pl-5 lg:pb-4
        font-nav font-medium text-white
        text-[18px] md:text-[20px] lg:text-[22px]
        leading-tight
      ">
        {sport.name}
      </h3>
    </div>
  );
}

function ExploreSports() {
  const swiperRef = useRef(null);

  return (
    <section className="mx-auto mt-20 md:mt-26 max-w-[1600px] 2xl:max-w-[2200px] px-0 sm:px-6 md:px-14 2xl:px-20 pb-16 md:pb-24"> 
      <div className="mb-5 md:mb-10 flex items-center justify-between">
      <h2 className="font-nav text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold px-4 sm:px-0">
          Explore Sports
        </h2>

        {/* Right side — button always visible, arrows only on md+ */}
        <div className="flex items-center gap-3 px-4 sm:px-0">

          {/* Explore More button — visible on all screens */}
          <button className="
            flex items-center justify-center
            bg-white text-black
            border border-black
            px-4 py-2 md:px-6 md:py-2.5
            rounded-full
            font-nav font-medium text-sm md:text-base
            mr-3
            transition-all duration-300 ease-in-out
            hover:bg-black hover:text-white hover:shadow-lg
          ">
            Explore More
          </button>

          {/* Arrow buttons — hidden on mobile/tablet, visible on md+ */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden lg:flex h-9 w-9 lg:h-12 lg:w-12 rounded-full border border-gray-300 items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black hover:scale-105"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden lg:flex h-9 w-9 lg:h-12 lg:w-12 rounded-full border border-gray-300 items-center justify-center transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:border-black hover:scale-105"
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
              spaceBetween: 3,
            },
            600: {
              slidesPerView: 2.25,
              slidesPerGroup: 1,
              spaceBetween: 3,
            },
            1024: {
              slidesPerView: 4.25,
              slidesPerGroup: 1,
              spaceBetween: 3,
            },
            1536: {
              slidesPerView: 4.25,
              slidesPerGroup: 1,
              spaceBetween: 3,
            },
          }}
          className="!overflow-visible"
        >
          {sportsCategories.map((sport) => (
            <SwiperSlide key={sport.id}>
              <SportCard sport={sport} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>



    </section>
  );
}

export default ExploreSports;
