import React from 'react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Alex K.', points: '245 km' },
  { rank: 2, name: 'Jordan M.', points: '210 km' },
  { rank: 3, name: 'Sarah J.', points: '198 km' },
  { rank: 4, name: 'David K.', points: '185 km' },
  { rank: 5, name: 'Priya R.', points: '160 km' },
];

function ChallengesLeaderboard() {
  const goal = 100;
  const current = 65;
  const progressPercent = Math.min((current / goal) * 100, 100);

  return (
    <section className="w-full py-16 bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Active Challenge */}
          <div>
            <h2 className="font-logo text-5xl md:text-6xl tracking-widest uppercase mb-6 text-white">Current Challenge</h2>
            <div className="bg-[#111] border border-gray-800 p-8 rounded-lg shadow-sm">
              <div className="inline-block px-3 py-1 bg-[#ea580c]/20 text-[#ea580c] rounded font-nav text-xs font-bold uppercase tracking-wider mb-4">
                Monthly Distance
              </div>
              <h3 className="font-nav text-3xl font-bold uppercase tracking-wide mb-2 text-white">The September 100K</h3>
              <p className="font-nav text-gray-400 mb-8">
                Log 100km this month across any discipline. Earn the exclusive digital badge and a 15% discount code upon completion.
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between font-nav text-sm font-bold tracking-widest uppercase mb-2">
                  <span>Your Progress</span>
                  <span className="text-[#ea580c]">{current} / {goal} KM</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#ea580c] transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <button className="mt-8 w-full md:w-auto px-8 py-3 bg-white text-black rounded-full font-nav font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Log Activity
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="font-logo text-5xl md:text-6xl tracking-widest uppercase mb-6 text-gray-600">Global Top 5</h2>
            <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full font-nav text-left">
                <thead className="bg-[#1a1a1a] border-b border-gray-800">
                  <tr>
                    <th className="py-4 px-6 text-xs text-gray-500 uppercase tracking-widest font-bold">Rank</th>
                    <th className="py-4 px-6 text-xs text-gray-500 uppercase tracking-widest font-bold">Athlete</th>
                    <th className="py-4 px-6 text-xs text-gray-500 uppercase tracking-widest font-bold text-right">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {MOCK_LEADERBOARD.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-black transition-colors">
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          entry.rank === 1 ? 'bg-[#ea580c] text-white' : 
                          entry.rank === 2 ? 'bg-gray-300 text-black' :
                          entry.rank === 3 ? 'bg-[#b45309] text-white' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold tracking-wide uppercase text-white">{entry.name}</td>
                      <td className="py-4 px-6 text-right font-bold text-[#ea580c]">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 text-center">
                <button className="font-nav text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  View Full Leaderboard →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ChallengesLeaderboard;
