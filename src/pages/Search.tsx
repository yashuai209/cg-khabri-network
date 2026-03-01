import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { NewsCard } from '../components/NewsLayout';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import BackButton from '../components/BackButton';

import { fetchApi } from '../lib/api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`posts?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <BackButton />
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Search Results</h1>
          <p className="text-gray-500 mt-1">Showing results for "{query}"</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Searching for news...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <SearchIcon className="text-gray-300" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            We couldn't find any news matching your search. Try different keywords or browse categories.
          </p>
        </div>
      )}
    </div>
  );
}
