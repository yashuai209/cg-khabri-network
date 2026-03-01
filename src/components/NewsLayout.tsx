import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Calendar, ChevronRight, Newspaper, Instagram, Linkedin, Youtube } from 'lucide-react';

export function NewsCard({ post, variant = 'default' }: { post: Post; variant?: 'default' | 'horizontal' | 'featured' }) {
  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleClick = async () => {
    try {
      await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, type: 'click' })
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (variant === 'featured') {
    return (
      <Link to={`/post/${post.slug}`} onClick={handleClick} className="group relative block overflow-hidden rounded-2xl aspect-[16/9]">
        <img
          src={post.image_url || `https://picsum.photos/seed/${post.id}/800/450`}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
          <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded mb-3">
            {post.category}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-red-400 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar size={14} className="mr-2" />
            {date}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/post/${post.slug}`} onClick={handleClick} className="group flex gap-4 py-4 border-b border-gray-100 last:border-0">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={post.image_url || `https://picsum.photos/seed/${post.id}/200/200`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1 block">
            {post.category}
          </span>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} onClick={handleClick} className="group block">
      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
        <img
          src={post.image_url || `https://picsum.photos/seed/${post.id}/600/400`}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2 block">
          {post.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mt-3 line-clamp-2">
          {post.content.replace(/[#*`]/g, '').substring(0, 120)}...
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400 flex items-center">
            <Calendar size={12} className="mr-1" />
            {date}
          </span>
          <span className="text-xs font-bold text-gray-900 flex items-center group-hover:translate-x-1 transition-transform">
            Read More <ChevronRight size={14} className="ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex flex-col mb-6 group">
              <div className="flex items-center">
                <div className="relative bg-white/5 p-2 rounded-lg">
                  <img 
                    src="/logo.png" 
                    alt="CG Khabri Network" 
                    className="h-20 w-auto object-contain transition-opacity"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col ml-3">
                  <div className="flex items-baseline font-black tracking-tighter leading-none">
                    <span className="text-2xl text-white">CG</span>
                    <span className="text-2xl text-red-600 mx-1">KHABRI</span>
                    <span className="text-2xl text-white">NETWORK</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 mt-1">Chhattisgarh's No. 1 News Network</span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed mb-6">
              CG Khabri Network is Chhattisgarh's leading digital news platform, delivering the most accurate and timely news from across the state and beyond.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/yashwa_ntlifestyle?igsh=Mm5lZjdianhvZ2hh" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-red-600 rounded-xl transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/in/yashwant-kumar-94888b343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://www.youtube.com/@Yashmusicmp3" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-red-600 rounded-xl transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Categories</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/category/State" className="hover:text-white transition-colors">State News</Link></li>
              <li><Link to="/category/National" className="hover:text-white transition-colors">National</Link></li>
              <li><Link to="/category/Sports" className="hover:text-white transition-colors">Sports</Link></li>
              <li><Link to="/category/Technology" className="hover:text-white transition-colors">Technology</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CG Khabri Network. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed for Chhattisgarh.</p>
        </div>
      </div>
    </footer>
  );
}
