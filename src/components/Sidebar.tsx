import { useEffect, useState } from 'react';
import { Post } from '../types';
import { NewsCard } from './NewsLayout';

import { fetchApi } from '../lib/api';

export default function Sidebar() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchApi('posts')
      .then(res => res.json())
      .then(data => setRecentPosts(data.slice(0, 5)));
  }, []);

  return (
    <aside className="space-y-12">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b-2 border-red-600 pb-2 inline-block">
          Recent News
        </h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <NewsCard key={post.id} post={post} variant="horizontal" />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
          Newsletter
        </h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Get the latest news directly in your inbox. Subscribe to our daily newsletter.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
          <button className="w-full py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors">
            Subscribe
          </button>
        </form>
      </div>

      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Advertisement</span>
        <div className="mt-4 h-64 flex items-center justify-center text-xs text-gray-300">
          AdSense Placeholder
        </div>
      </div>
    </aside>
  );
}
