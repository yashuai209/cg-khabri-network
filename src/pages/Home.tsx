import { useEffect, useState } from 'react';
import { Post } from '../types';
import { NewsCard } from '../components/NewsLayout';
import Sidebar from '../components/Sidebar';
import { fetchApi } from '../lib/api';

export default function Home() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          fetchApi('posts?featured=true'),
          fetchApi('posts')
        ]);
        const featuredData = await featuredRes.json();
        const latestData = await latestRes.json();
        
        setFeaturedPost(featuredData[0] || latestData[0]);
        setLatestPosts(latestData.filter((p: Post) => p.id !== (featuredData[0]?.id || latestData[0]?.id)));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Section */}
      {featuredPost && (
        <section className="mb-16">
          <NewsCard post={featuredPost} variant="featured" />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest Stories</h2>
            <div className="h-1 flex-1 mx-6 bg-gray-50 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {latestPosts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>

          {latestPosts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500">No news stories found yet. Check back later!</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
