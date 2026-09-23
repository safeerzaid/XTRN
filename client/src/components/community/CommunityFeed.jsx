import React, { useState } from 'react';
import { FiHeart, FiMapPin, FiMessageCircle } from 'react-icons/fi';

const MOCK_POSTS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    location: 'Denver, CO',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800',
    caption: 'Morning trails never disappoint. 15km in the bag before breakfast. The new XTRN TrailRunner series is holding up great on the loose gravel! 🏔️🏃‍♀️',
    likes: 342,
    comments: 28,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    caption: 'Track Tuesday. Focused on 400m repeats today. Feeling strong heading into race month.',
    likes: 892,
    comments: 45,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    caption: 'Cycling the city limits. 60 miles done.',
    likes: 415,
    comments: 12,
  },
  {
    id: 4,
    name: 'David Kim',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1516481157830-054159c1fb16?auto=format&fit=crop&q=80&w=800',
    caption: 'Sunday long run through Central Park. Prep for the major is on.',
    likes: 1205,
    comments: 89,
  }
];

function CommunityFeed() {
  const [activeTab, setActiveTab] = useState('Recent');

  return (
    <section className="w-full py-16 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="font-logo text-5xl md:text-6xl tracking-widest uppercase">Athlete Feed</h2>
            <div className="flex gap-6 mt-6">
              {['Recent', 'Trending', 'Following'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-nav text-sm uppercase tracking-widest transition-colors ${
                    activeTab === tab 
                      ? 'text-[#ea580c] border-b-2 border-[#ea580c] pb-1' 
                      : 'text-gray-500 hover:text-gray-900 pb-1 border-b-2 border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-black text-white font-nav text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Post Your Run
          </button>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {MOCK_POSTS.map(post => (
            <div key={post.id} className="break-inside-avoid bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors">
              <img src={post.image} alt={post.caption} className="w-full h-auto object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-nav font-bold text-black text-lg">{post.name}</h4>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <FiMapPin className="mr-1" /> {post.location}
                    </div>
                  </div>
                </div>
                <p className="font-nav text-sm text-gray-600 leading-relaxed mb-4">
                  {post.caption}
                </p>
                <div className="flex items-center gap-4 text-gray-500 font-nav text-sm">
                  <button className="flex items-center gap-1.5 hover:text-[#ea580c] transition-colors">
                    <FiHeart /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <FiMessageCircle /> {post.comments}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CommunityFeed;
