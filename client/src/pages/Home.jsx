import React, { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import TrendingProducts from '../components/sections/TrendingProducts'
import ExploreItems from '../components/sections/ExploreByItems'
import GenderBanners from '../components/sections/GenderBanners'
import CommunityBanner from '../components/sections/CommunityBanner'

function Home() {
  useEffect(() => {
    document.title = "XTRN | Gear up for greatness";
  }, []);
  return (
    <div>
      <Hero />
      <ExploreItems />
      <TrendingProducts />
      <GenderBanners />
      <CommunityBanner />
    </div>
  )
}

export default Home