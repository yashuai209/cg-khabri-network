import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, X, Newspaper, QrCode, Download, Share2, ArrowLeft, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('header-qr-code');
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
        downloadLink.download = `CG-Khabri-QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CG Khabri Network',
          text: 'Check out Chhattisgarh\'s No. 1 News Network',
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center h-16 lg:h-24">
          {isMobileSearchOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <form onSubmit={handleSearch} className="flex-1 flex items-center">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </form>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link to="/" className="flex items-center ml-2 lg:ml-0 group">
                  <div className="relative">
                    <img 
                      src="/logo.png" 
                      alt="CG Khabri Network" 
                      className="h-10 lg:h-16 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  </div>
                  <div className="flex flex-col ml-2 lg:ml-3">
                    <div className="flex items-baseline font-black tracking-tighter leading-none">
                      <span className="text-lg lg:text-2xl text-[#0F172A]">CG</span>
                      <span className="text-lg lg:text-2xl text-red-600 mx-0.5 lg:mx-1">KHABRI</span>
                      <span className="text-lg lg:text-2xl text-[#0F172A]">NETWORK</span>
                    </div>
                    <span className="text-[7px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-bold text-gray-500 mt-0.5 lg:mt-1">N0. 1 News Network</span>
                  </div>
                </Link>

                {/* Header QR Code - Small Version */}
                <div className="hidden md:flex items-center ml-8 pl-8 border-l border-gray-100">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsQRModalOpen(true)}
                    className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                  >
                    <div className="bg-white p-1 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      <QRCodeSVG 
                        value={window.location.origin} 
                        size={40}
                        level="L"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Scan Site</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Click to enlarge</p>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* YouTube Style Search Bar */}
              <div className="flex-1 max-w-2xl mx-2 lg:mx-8 hidden sm:block">
                <form onSubmit={handleSearch} className="relative group flex items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-l-full py-2 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-100 border border-l-0 border-gray-200 rounded-r-full px-5 py-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all flex items-center justify-center"
                    title="Search"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              <div className="flex items-center space-x-1 lg:space-x-4">
                <button 
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="p-2 text-gray-400 hover:text-red-600 sm:hidden"
                >
                  <Search size={20} />
                </button>
                <Link
                  to="/admin/login"
                  className="hidden sm:block text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Admin
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* YouTube Style Category Chips */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center space-x-3 whitespace-nowrap">
          <Link
            to="/"
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
              location.pathname === '/' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => {
            const isActive = location.pathname === `/category/${cat}`;
            return (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                  isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              location.pathname === '/' 
                ? 'bg-red-50 text-red-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            Home
          </Link>
          {CATEGORIES.map((cat) => {
            const isActive = location.pathname === `/category/${cat}`;
            return (
              <Link
                key={cat}
                to={`/category/${cat}`}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                }`}
              >
                {cat}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-gray-50">
            <button 
              onClick={() => {
                setIsQRModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-3 bg-gray-50 rounded-xl text-gray-900 font-bold"
            >
              <div className="flex items-center gap-3">
                <QrCode size={20} className="text-red-600" />
                <span>Scan Website QR</span>
              </div>
              <div className="bg-white p-1 rounded-lg">
                <QRCodeSVG value={window.location.origin} size={24} />
              </div>
            </button>
          </div>
        </div>
      )}


      {/* Enlarged QR Modal */}
      <AnimatePresence>
        {isQRModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Share Site</h3>
                <p className="text-sm text-gray-500 mt-2">Scan or share this code to invite others to CG Khabri Network.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border-4 border-red-50 inline-block mb-6 shadow-inner">
                <QRCodeSVG 
                  id="header-qr-code"
                  value={window.location.origin} 
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

              <div className="mb-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Website Link</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <p className="text-xs font-mono text-gray-500 truncate flex-1">{window.location.origin}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin);
                      alert('Link copied to clipboard!');
                    }}
                    className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-lg shadow-sm transition-all"
                    title="Copy Link"
                  >
                    <LinkIcon size={14} />
                  </button>
                </div>
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
                  onClick={handleShare}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
                >
                  <Share2 size={20} />
                  Share Website
                </button>
                <button 
                  onClick={() => setIsQRModalOpen(false)}
                  className="w-full py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
