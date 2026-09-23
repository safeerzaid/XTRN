import React from 'react';


const MOCK_EVENTS = [
  {
    id: 1,
    title: <>XTRN <br /> Midnight Half</>,
    date: 'OCT 15, 2026',
    category: 'SPONSORED',
    isSponsored: true,
    description: 'Join us for a midnight run through the city streets. Experience the energy of the night with hundreds of other runners.',
  },
  {
    id: 2,
    title: 'Sunrise Trail 10K',
    date: 'NOV 02, 2026',
    category: 'TRAIL RUN',
    isSponsored: false,
    description: 'Experience the beauty of the trails at dawn. A perfect way to start your weekend with nature and community.',
  },
  {
    id: 3,
    title: <>XTRN <br /> Speed Project</>,
    date: 'NOV 20, 2026',
    category: 'TRACK SESSION',
    isSponsored: true,
    description: 'Push your limits on the track with our expert coaches. Perfect for those looking to improve their personal bests.',
  },
  {
    id: 4,
    title: 'Coastal Cycling Tour',
    date: 'DEC 05, 2026',
    category: 'CYCLING',
    isSponsored: false,
    description: 'A scenic 100km ride along the beautiful coastline. Open to all skill levels with multiple pace groups available.',
  }
];

function UpcomingEvents() {
  return (
    <section className="w-full py-24 bg-gray-50 text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-12">

          {/* Top Side: Title */}
          <div className="w-full flex items-center justify-between">
            <h2 className="font-nav text-4xl md:text-5xl tracking-wide font-bold text-black whitespace-nowrap">
              Upcoming Events
            </h2>
          </div>

          {/* Bottom Side: Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_EVENTS.slice(0, 3).map(event => (
              <div
                key={event.id}
                className="bg-white rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[420px] relative overflow-hidden"
              >


                {/* Top Row: Date & Category */}
                <div className="flex justify-between items-start mb-8 mt-2">
                  <span className="font-nav text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {event.date}
                  </span>
                  <div className="text-right">
                    <span className="block font-nav text-[10px] font-bold text-black uppercase tracking-widest mb-1">
                      XTRN
                    </span>
                    <span className="block font-nav text-[10px] font-bold text-[#b49e82] uppercase tracking-widest">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Middle: Title & Description */}
                <div className="flex-grow flex flex-col justify-center mb-8">
                  <h3 className="font-nav text-2xl md:text-3xl font-medium leading-tight text-black tracking-tight mb-4">
                    {event.title}
                  </h3>
                  <p className="font-nav text-lg text-black leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
// Triggering HMR

