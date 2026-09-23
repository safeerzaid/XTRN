import React from 'react';
import heroImage from '../../assets/images/covers/hero  club.png';

function CommunityHero() {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      <img src={heroImage} alt="XTRN Club Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
    </section>
  );
}

export default CommunityHero;
