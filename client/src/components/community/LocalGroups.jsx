import React from 'react';
import { FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';

const MOCK_GROUPS = [
  {
    id: 1,
    name: 'Kochi Runners Club',
    city: 'Kochi, KL',
    members: 1240,
    nextMeetup: 'Saturday, 5:30 AM',
    description: 'Weekly long runs starting from Marine Drive. All paces welcome.',
  },
  {
    id: 2,
    name: 'Kozhikode Trail Crew',
    city: 'Kozhikode, KL',
    members: 850,
    nextMeetup: 'Sunday, 6:00 AM',
    description: 'Exploring the Western Ghats one trail at a time.',
  },
  {
    id: 3,
    name: 'Bangalore Track Club',
    city: 'Bangalore, KA',
    members: 3200,
    nextMeetup: 'Tuesday, 6:30 PM',
    description: 'Speedwork and track sessions at Kanteerava Stadium.',
  }
];

function LocalGroups() {
  return (
    <section className="w-full py-16 bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h2 className="font-logo text-5xl md:text-6xl tracking-widest uppercase text-black">Local Squads</h2>
          <p className="font-nav text-gray-500 mt-2 text-lg">Find your crew. Train together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GROUPS.map(group => (
            <div key={group.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#ea580c] transition-colors group flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-nav text-2xl font-bold uppercase tracking-wide mb-2 group-hover:text-[#ea580c] transition-colors text-black">{group.name}</h3>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center text-gray-500 font-nav text-sm">
                    <FiMapPin className="mr-2 text-[#ea580c]" /> {group.city}
                  </div>
                  <div className="flex items-center text-gray-500 font-nav text-sm">
                    <FiUsers className="mr-2 text-[#ea580c]" /> {group.members.toLocaleString()} Members
                  </div>
                  <div className="flex items-center text-gray-500 font-nav text-sm">
                    <FiCalendar className="mr-2 text-[#ea580c]" /> {group.nextMeetup}
                  </div>
                </div>
                <p className="font-nav text-gray-600 text-sm leading-relaxed">
                  {group.description}
                </p>
              </div>
              
              <button className="mt-6 w-full py-3 border border-gray-300 rounded-full font-nav font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                Join Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LocalGroups;
