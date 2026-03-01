import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post as PostType } from '../types';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import { Calendar, User, Share2, Facebook, Twitter, MessageCircle, ExternalLink, Tag, Briefcase, Download, X, QrCode, Heart, MessageSquare, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';

import { fetchApi } from '../lib/api';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState({ author_name: '', content: '' });
  const [isCommenting, setIsCommenting] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchApi(`posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
        // Fetch comments
        fetchApi(`posts/${data.id}/comments`)
          .then(res => res.json())
          .then(commentsData => setComments(Array.isArray(commentsData) ? commentsData : []));
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleLike = async () => {
    if (!post) return;
    try {
      await fetchApi(`posts/${post.id}/like`, { 
        method: 'POST'
      });
      setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (platform: string) => {
    if (!post) return;
    try {
      await fetchApi(`posts/${post.id}/share`, { 
        method: 'POST'
      });
      setPost(prev => prev ? { ...prev, shares: (prev.shares || 0) + 1 } : null);
      
      if (platform === 'modal' && navigator.share) {
        try {
          await navigator.share({
            title: post.title,
            text: post.seo_description || post.title,
            url: window.location.href,
          });
          return;
        } catch (err) {
          // Fallback to modal if share fails or is cancelled
          console.log('Native share failed:', err);
        }
      }

      let url = '';
      if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      if (platform === 'twitter') url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
      if (platform === 'whatsapp') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`;
      
      if (url) window.open(url, '_blank');
      else setIsShareModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExternalClick = async (url: string) => {
    if (!post) return;
    try {
      await fetch(`/api/posts/${post.id}/click`, { method: 'POST' });
      setPost(prev => prev ? { ...prev, clicks: (prev.clicks || 0) + 1 } : null);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentForm.author_name || !commentForm.content) return;
    setIsCommenting(true);
    try {
      const res = await fetchApi(`posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm)
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [{ ...commentForm, id: newComment.id, created_at: new Date().toISOString() }, ...prev]);
        setCommentForm({ author_name: '', content: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommenting(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('post-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-${post?.slug}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <Link to="/" className="text-red-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const tagsList = post.tags ? post.tags.split(',').map(t => t.trim()) : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [
      post.image_url ? (post.image_url.startsWith('http') ? post.image_url : `${window.location.origin}${post.image_url}`) : `https://picsum.photos/seed/${post.id}/1200/675`
    ],
    "datePublished": new Date(post.created_at).toISOString(),
    "dateModified": new Date(post.created_at).toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "CG Khabri Team",
      "url": window.location.origin
    }],
    "publisher": {
      "@type": "Organization",
      "name": "CG Khabri Network",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{post.seo_title || `${post.title} | CG Khabri Network`}</title>
        <meta name="description" content={post.seo_description || (post.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : '')} />
        {/* Open Graph */}
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || (post.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : '')} />
        <meta property="og:image" content={post.image_url || ''} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <BackButton className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2">
          {/* Header */}
          <header className="mb-10">
            <Link 
              to={`/category/${post.category}`}
              className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded mb-6"
            >
              {post.category}
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-8 tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-100 py-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-100">
                  <img src="/author.jpg" alt="Yashwant Kumar Sahani" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-gray-900">By Yashwant Kumar Sahani</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-red-600" />
                <span>{date}</span>
              </div>
              <div className="flex items-center ml-auto gap-4">
                <button 
                  onClick={handleLike}
                  className="flex items-center space-x-1 p-2 hover:bg-red-50 rounded-full transition-colors text-red-600 group"
                >
                  <Heart size={18} className="group-hover:fill-red-600" />
                  <span className="text-xs font-bold">{post.likes || 0}</span>
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600"
                >
                  <Facebook size={18} />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-sky-400"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-green-500"
                >
                  <MessageCircle size={18} />
                </button>
                <button 
                  onClick={() => handleShare('modal')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <Share2 size={18} />
                </button>
                <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block" />
                <button 
                  onClick={() => setIsQRModalOpen(true)}
                  className="p-1 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all group relative"
                  title="Scan or Download QR"
                >
                  <QRCodeSVG 
                    value={window.location.href} 
                    size={32}
                    level="L"
                    includeMargin={false}
                  />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                </button>
              </div>
            </div>
          </header>

          {/* AdSense Top Placeholder */}
          <div className="my-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400 uppercase tracking-widest">
            Advertisement (AdSense)
            {/* <ins className="adsbygoogle" ... /> */}
          </div>

          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-gray-200">
            <img
              src={post.image_url || `https://picsum.photos/seed/${post.id}/1200/675`}
              alt={post.title}
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-red prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-700 quill-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* External Link */}
          {post.external_link && (
            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Read more on the source</h4>
                <p className="text-sm text-gray-500">Visit the external link for more details.</p>
              </div>
              <button 
                onClick={() => handleExternalClick(post.external_link!)} 
                className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shadow-sm"
              >
                <span>Visit Link</span>
                <ExternalLink size={16} />
              </button>
            </div>
          )}

          {/* AdSense Middle Placeholder */}
          <div className="my-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400 uppercase tracking-widest">
            Advertisement (AdSense)
          </div>

          {/* Sponsor Section */}
          {post.sponsor_name && (
            <div className="mt-12 p-8 bg-red-50 rounded-3xl border border-red-100">
              <div className="flex items-center space-x-2 text-red-600 mb-6">
                <Briefcase size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Sponsored Content / Promotion</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {post.sponsor_image && (
                  <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-white shadow-lg flex-shrink-0">
                    <img src={post.sponsor_image} alt={post.sponsor_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{post.sponsor_name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Check out this amazing product/app recommended by CG Khabri Network. Click below to learn more.</p>
                  <button 
                    onClick={() => handleExternalClick(post.sponsor_link!)}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                  >
                    <span>Get Started</span>
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-gray-400 mr-2">
                <Tag size={16} className="mr-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Tags:</span>
              </div>
              {tagsList.length > 0 ? tagsList.map(tag => (
                <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border border-gray-100">
                  #{tag}
                </span>
              )) : (
                ['Chhattisgarh', post.category, 'News'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border border-gray-100">
                    #{tag}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* AdSense Bottom Placeholder */}
          <div className="mt-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400 uppercase tracking-widest">
            Advertisement (AdSense)
          </div>

          {/* Comments Section */}
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="text-red-600" />
                Comments ({comments.length})
              </h3>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12">
              <h4 className="font-bold text-gray-900 mb-6">Leave a Comment</h4>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text"
                    placeholder="Your Name"
                    required
                    value={commentForm.author_name}
                    onChange={e => setCommentForm({ ...commentForm, author_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Share your thoughts..."
                  required
                  value={commentForm.content}
                  onChange={e => setCommentForm({ ...commentForm, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none min-h-[120px]"
                />
                <button 
                  disabled={isCommenting}
                  className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={18} />
                  {isCommenting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">{comment.author_name}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-10 text-gray-400 italic">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </section>
        </article>

        <Sidebar />
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Share2 className="text-red-600" />
                    Share Story
                  </h3>
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"
                  >
                    <Facebook size={24} className="mb-2" />
                    <span className="text-xs font-bold">Facebook</span>
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="flex flex-col items-center justify-center p-4 bg-sky-50 text-sky-400 rounded-2xl hover:bg-sky-100 transition-all"
                  >
                    <Twitter size={24} className="mb-2" />
                    <span className="text-xs font-bold">Twitter</span>
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-500 rounded-2xl hover:bg-green-100 transition-all"
                  >
                    <MessageCircle size={24} className="mb-2" />
                    <span className="text-xs font-bold">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    <ExternalLink size={24} className="mb-2" />
                    <span className="text-xs font-bold">Copy Link</span>
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 break-all text-[10px] text-gray-400 font-mono">
                  {window.location.href}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Enlarged Modal */}
      <AnimatePresence>
        {isQRModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center relative"
            >
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="text-red-600" size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Scan to Share</h3>
                <p className="text-sm text-gray-500 mt-2">Scan this code to open this news on your mobile device.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-4 border-red-50 inline-block mb-8 shadow-inner">
                <QRCodeSVG 
                  id="post-qr-code"
                  value={window.location.href} 
                  size={240}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo.png",
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={downloadQR}
                  className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-200"
                >
                  <Download size={20} />
                  Download QR Code
                </button>
                <button 
                  onClick={() => setIsQRModalOpen(false)}
                  className="w-full py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
