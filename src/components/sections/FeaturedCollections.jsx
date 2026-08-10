import trekkingImg from "../../assets/images/product banner/trekking.png";
import fisherImg   from "../../assets/images/product banner/fisher.png";
import climbImg    from "../../assets/images/product banner/climb.png";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const categories = [
  {
    id: 1,
    title: "Trekking",
    image: trekkingImg,
    alt:   "Trekking essentials",
  },
  {
    id: 2,
    title: "Fishing",
    image: fisherImg,
    alt:   "Fishing essentials",
  },
  {
    id: 3,
    title: "Climbing",
    image: climbImg,
    alt:   "Climbing essentials",
  },
];

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */

function CategoryBannerCard({ title, image, alt }) {
  return (
    <div
      className="
        group relative flex items-stretch
        h-[120px] sm:h-[145px] md:h-[160px] lg:h-[178px]
        bg-[#f6f6f4] hover:bg-[#edede9]
        overflow-hidden
        cursor-pointer
        transition-colors duration-300
      "
    >
      {/* LEFT: text */}
      <div
        className="
          relative z-10
          flex flex-col justify-center
          pl-6 sm:pl-10 md:pl-14 lg:pl-16
          flex-1 min-w-0
        "
      >
        <h3
          className="
            font-nav font-normal leading-none text-black
            text-[24px] sm:text-[34px] md:text-[44px] lg:text-[54px]
          "
        >
          {title}
        </h3>

        <div className="mt-3 sm:mt-4">
          <span
            className="
              block font-nav font-medium uppercase tracking-[0.15em]
              text-[9px] sm:text-[10px] md:text-[11px]
              text-black
            "
          >
            View
          </span>
          <div className="mt-0 h-px w-5 sm:w-6 bg-black" />
        </div>
      </div>

      {/* RIGHT: product image */}
      <div
        className="
          flex-none relative
          w-[38%] sm:w-[36%] md:w-[34%] lg:w-[34%]
        "
      >
        <img
          src={image}
          alt={alt}
          className="
            absolute bottom-0 right-0
            h-[115%] sm:h-[118%] md:h-[120%]
            w-auto max-w-none
            object-contain
          "
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION
───────────────────────────────────────────── */

function FeaturedCollections() {
  return (
    <section
      className="
        mx-auto
        mt-16 sm:mt-20 md:mt-28 lg:mt-36
        max-w-[1600px] 2xl:max-w-[2200px]
        px-4 sm:px-6 md:px-14 2xl:px-20
        pb-16 md:pb-24
      "
    >
      {/* Section heading */}
      <h2 className="font-nav text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold mb-6 sm:mb-8 md:mb-10">
        Explore Activities
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
        {categories.map((cat) => (
          <CategoryBannerCard
            key={cat.id}
            title={cat.title}
            image={cat.image}
            alt={cat.alt}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollections;