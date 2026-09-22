import React from 'react'
import NavBar from '../components/layout/NavBar'
import Hero from '../components/sections/Hero'
import TrendingProducts from '../components/sections/TrendingProducts'
import ExploreItems from '../components/sections/ExploreByItems'
import GenderBanners from '../components/sections/GenderBanners'
import CommunityBanner from '../components/sections/CommunityBanner'
import Footer from '../components/layout/Footer'

function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <ExploreItems />
      <TrendingProducts />
      <GenderBanners />
      <CommunityBanner />
      <Footer />
    </div>
  )
}

export default Home