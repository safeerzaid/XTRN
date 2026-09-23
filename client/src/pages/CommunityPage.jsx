import React from 'react';
import CommunityNavBar from '../components/layout/CommunityNavBar';
import CommunityHero from '../components/community/CommunityHero';
import CommunityIntro from '../components/community/CommunityIntro';
import UpcomingEvents from '../components/community/UpcomingEvents';
import CommunityFeed from '../components/community/CommunityFeed';
import RewardsBanner from '../components/community/RewardsBanner';
import Testimonials from '../components/community/Testimonials';
import Footer from '../components/layout/Footer';

function CommunityPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <CommunityNavBar />
      <CommunityHero />
      <CommunityIntro />
      <RewardsBanner />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default CommunityPage;
