import { useNavigate } from 'react-router-dom'

function ExploreByItems() {
  const navigate = useNavigate()
  const categories = [

    {
      id: 1,
      label: 'Shoes',
      image: 'https://res.cloudinary.com/duvfdxql9/image/upload/v1789019386/shoe_banner_ksbnz2.png',
      alt: 'Shoes collection',
    },
    {
      id: 2,
      label: 'Apparel',
      image: 'https://res.cloudinary.com/duvfdxql9/image/upload/v1789019381/apperal_banner_i52mrk.png',
      alt: 'Apparel collection',
    },
    {
      id: 3,
      label: 'Accessories',
      image: 'https://res.cloudinary.com/duvfdxql9/image/upload/v1789019382/accessoies_banner_yts4sz.png',
      alt: 'Accessories collection',
    },
  ]

  return (
    <section className="mx-auto mt-16 md:mt-40 max-w-[1600px] 2xl:max-w-[2200px] px-0 sm:px-6 md:px-14 2xl:px-20 pb-10 md:pb-16 overflow-x-hidden">

      {/* Heading row — mirrors TrendingProducts exactly */}
      <div className="mb-5 md:mb-10 flex items-center justify-between">
        <h2 className="font-nav text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold px-4 sm:px-0">
          Featured Collection
        </h2>
      </div>

      {/* 3-column banner grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/featured/${cat.label.toLowerCase()}`)}
            className="group relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-[4px] cursor-pointer border-r border-gray-200"
          >
            {/* Banner image */}
            <img
              src={cat.image}
              alt={cat.alt}
              className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />

            {/* Category label — bottom-left, mirrors ProductCard name style */}
            <h3
              className="
                absolute bottom-0 left-0 right-0
                pl-2 pb-1.5
                sm:pl-3 sm:pb-2
                md:pl-4 md:pb-2.5
                lg:pl-5 lg:pb-3
                font-nav font-semibold text-white
                text-[20px]
                sm:text-[14px]
                md:text-[15px]
                lg:text-[18px]
                xl:text-[22px]
                leading-tight
                truncate
              "
            >
              {cat.label}
            </h3>
          </div>
        ))}
      </div>

    </section>
  )
}

export default ExploreByItems