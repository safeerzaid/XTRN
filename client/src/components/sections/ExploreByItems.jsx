import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import apperalImage from '../../assets/images/covers/apperal.png'
import accessoriesImage from '../../assets/images/covers/accessories.png'
import casualShoeImage from '../../assets/images/covers/casual shoe.jpg'
import hikingShoeImageJpg from '../../assets/images/covers/hiking.jpg'
import runningShoeImage from '../../assets/images/covers/running shoe.jpg'

function ExploreByItems() {
  const navigate = useNavigate()
  const categories = [

    {
      id: 2,
      label: 'Apparel',
      image: apperalImage,
      alt: 'Apparel collection',
    },
    {
      id: 3,
      label: 'Accessories',
      image: accessoriesImage,
      alt: 'Accessories collection',
    },
  ]

  const shoeCards = [
    { label: 'Running Shoes', image: runningShoeImage, path: '/products/running-shoes' },
    { label: 'Casual Shoes', image: casualShoeImage, path: '/products/casual-shoes' },
    { label: 'Hiking Shoes', image: hikingShoeImageJpg, path: '/products/hiking-shoes' },
  ]

  return (
    <section className="w-full mt-2 md:mt-4 pb-10 md:pb-16 overflow-x-hidden">


      {/* 2-column banner grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/featured/${cat.label.toLowerCase()}`)}
            className="group relative overflow-hidden h-[100vh] bg-gray-100 cursor-pointer"
          >
            {/* Banner image */}
            <img
              src={cat.image}
              alt={cat.alt}
              className={`w-full h-full object-cover ${cat.id === 2 ? 'object-[center_35%]' : 'object-center'}`}
            />
            
            {/* Black overlay for better text readability and aesthetics */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />

            {/* Centered pill button */}
            <div
              className="
                absolute bottom-10 left-1/2 -translate-x-1/2
                bg-white text-black 
                px-7 py-3.5 rounded-full 
                text-[13px] md:text-[14px] font-bold tracking-wide uppercase
                whitespace-nowrap
                hover:bg-black hover:text-white transition-colors cursor-pointer
              "
            >
              {cat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Shoes for Every Move Section */}
      <div className="w-full px-4 md:px-8 mt-12 md:mt-20">
        <h2 className="text-[22px] md:text-[26px] font-bold text-black mb-6">
          Shoes for Every Move
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {shoeCards.map((shoe, idx) => (
            <div
              key={idx}
              onClick={() => navigate(shoe.path)}
              className="group relative overflow-hidden h-[400px] md:h-[550px] rounded-sm cursor-pointer bg-gray-100"
            >
              {/* Banner image */}
              <img
                src={shoe.image}
                alt={shoe.label}
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500 pointer-events-none" />
              
              {/* Text and Arrow exactly like screenshot */}
              <div className="absolute top-0 left-0 right-0 p-5 md:p-6 flex justify-between items-start pointer-events-none text-white">
                <span className="font-semibold text-[18px] md:text-[20px] tracking-wide">
                  {shoe.label}
                </span>
                <span className="text-[20px] md:text-[24px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                  <FiArrowRight />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default ExploreByItems