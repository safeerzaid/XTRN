import React from 'react';

function RewardsBanner() {
  return (
    <section className="w-full bg-[#111] text-white min-h-[60vh] py-24 md:py-32 flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-4xl">
        <h2 className="font-nav text-2xl md:text-3xl font-bold uppercase mb-4">
          Rewards For All Members
        </h2>
        <p className="font-nav text-base md:text-lg text-white leading-relaxed max-w-3xl mx-auto">
          A time and space for shopping, swapping, and unlocking rewards. XTRN Club Days are back with new ways to earn and redeem more member points.
        </p>
      </div>
    </section>
  );
}

export default RewardsBanner;
