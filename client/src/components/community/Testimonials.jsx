import React from 'react';

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Michael T.',
    achievement: 'Finished first 50K Ultra',
    quote: "The XTRN community kept me accountable through months of grueling winter training. The gear held up, but the group support is what actually got me across the finish line.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'Emily R.',
    achievement: 'Sub-3 Hour Marathon',
    quote: "I found my pacing group through the local squad feature. Hitting that sub-3 felt impossible until I started putting in the track work with these guys.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'James L.',
    achievement: '100 Day Run Streak',
    quote: "The monthly challenges turn consistency into a game. 100 days straight of hitting the pavement, regardless of the weather. The club is a game changer.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
  }
];

function Testimonials() {
  return (
    <section className="w-full py-24 bg-black text-white border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-12">
          
          <div className="w-full flex items-center justify-between">
            <h2 className="font-nav text-4xl md:text-5xl tracking-wide font-bold text-white whitespace-nowrap">
              Athlete Stories
            </h2>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="flex flex-col bg-[#323232] text-left">
                <div className="p-6 md:p-8 flex-grow">
                  <span className="text-gray-400 text-lg font-medium mb-4 block">
                    0{testimonial.id}
                  </span>
                  <p className="text-white text-base md:text-lg font-medium leading-relaxed font-nav">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex border-t border-[#1a1a1a]">
                  <div className="flex-grow p-4 md:p-6 flex flex-col justify-center">
                    <h4 className="text-white font-bold text-base md:text-lg font-nav">{testimonial.name}</h4>
                    <span className="text-gray-300 text-xs md:text-sm mt-1 font-nav">{testimonial.achievement}</span>
                  </div>
                  <div className="w-24 h-24 md:w-28 md:h-28 border-l border-[#1a1a1a] flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover grayscale" 
                    />
                  </div>
                </div>
                
                <div className="h-2 md:h-3 bg-[#ea580c] w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
