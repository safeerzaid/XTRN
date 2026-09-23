import React from 'react';

function CommunityIntro() {
  return (
    <section className="w-full py-24 bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-16">
          
          {/* Top: Intro, CTA, Stats */}
          <div className="max-w-4xl">
            <p className="font-nav text-2xl md:text-3xl leading-relaxed text-white mb-10">
              XTRN Club is a community of runners, trail athletes, and everyday movers who push each other forward. Log your runs, join local groups, take on monthly challenges, and earn rewards all powered by people who train like you do.
            </p>
            
            <div className="mb-12">
              <button className="bg-black text-white border border-white px-10 py-4 rounded-full font-nav font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">
                Join The Club
              </button>
            </div>
          </div>

          {/* Bottom: Value Props in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="border-l-2 border-gray-800 pl-6 hover:border-white transition-colors duration-500">
              <h3 className="font-nav text-xl font-bold uppercase tracking-wide mb-3">Connect</h3>
              <p className="font-nav text-gray-400 leading-relaxed text-lg">
                Find local groups and training partners near you.
              </p>
            </div>
            
            <div className="border-l-2 border-gray-800 pl-6 hover:border-white transition-colors duration-500">
              <h3 className="font-nav text-xl font-bold uppercase tracking-wide mb-3">Compete</h3>
              <p className="font-nav text-gray-400 leading-relaxed text-lg">
                Join monthly km challenges and climb the leaderboard.
              </p>
            </div>
            
            <div className="border-l-2 border-gray-800 pl-6 hover:border-white transition-colors duration-500">
              <h3 className="font-nav text-xl font-bold uppercase tracking-wide mb-3">Earn</h3>
              <p className="font-nav text-gray-400 leading-relaxed text-lg">
                Redeem points for gear discounts and rewards.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default CommunityIntro;
