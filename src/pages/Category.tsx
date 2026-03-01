import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../types';
import { NewsCard } from '../components/NewsLayout';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';

import { fetchApi } from '../lib/api';

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi(`posts?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton className="mb-8" />
      <div className="mb-12">
        <span className="text-xs font-bold text-red-600 uppercase tracking-[0.2em] mb-4 block">Category</span>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">{category} News</h1>
        <div className="w-24 h-1.5 bg-red-600 mt-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {posts.map(post => (
            <NewsCard key={post.id} post={post} />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500">No stories found in this category yet.</p>
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
