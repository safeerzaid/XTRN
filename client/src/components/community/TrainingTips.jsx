import React from 'react';

const MOCK_TIPS = [
  {
    id: 1,
    category: 'Training',
    title: 'Mastering the Long Run Pace',
    excerpt: 'Learn how slowing down can actually make you faster on race day. The science behind Zone 2 training.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    category: 'Nutrition',
    title: 'Fueling for Ultra Distances',
    excerpt: 'When gels aren\'t enough. Real food strategies for sustaining energy over 50k+ distances.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    category: 'Gear Guide',
    title: 'Trail Shoes vs Road Shoes',
    excerpt: 'Anatomy of a trail shoe. Why grip, stack height, and rock plates matter when transitioning off-road.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
  }
];

function TrainingTips() {
  return (
    <section className="w-full py-16 bg-gray-50 text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-logo text-5xl md:text-6xl tracking-widest uppercase">The Editorial</h2>
            <p className="font-nav text-gray-500 mt-2 text-lg">Insights from the pros.</p>
          </div>
          <button className="hidden md:block font-nav text-sm uppercase tracking-widest text-black border-b border-black hover:text-gray-600 hover:border-gray-600 transition-all pb-1">
            Read The Blog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TIPS.map(tip => (
            <div key={tip.id} className="group cursor-pointer flex flex-col h-full">
              <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mb-6">
                <img 
                  src={tip.image} 
                  alt={tip.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="font-nav text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2">{tip.category}</span>
                <h3 className="font-nav text-2xl font-bold uppercase tracking-wide leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                  {tip.title}
                </h3>
                <p className="font-nav text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {tip.excerpt}
                </p>
                <div className="font-nav text-xs font-bold uppercase tracking-widest text-black flex items-center group-hover:text-[#ea580c] transition-colors">
                  Read Article <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrainingTips;
