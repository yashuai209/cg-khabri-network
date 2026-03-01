import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, CATEGORIES } from '../types';
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, FileText, Image as ImageIcon, CheckCircle, XCircle, FileUp, Bold, Italic, List, Link as LinkIcon, Eye, Heart, Share2, MessageSquare, MousePointerClick, BarChart3 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import * as mammoth from 'mammoth';

import { fetchApi } from '../lib/api';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics'>('posts');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'State',
    is_featured: false,
    tags: '',
    seo_title: '',
    seo_description: '',
    sponsor_name: '',
    sponsor_link: '',
    external_link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sponsorImageFile, setSponsorImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('admin_token');

  const handleWordImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setFormData({ ...formData, content: result.value });
      setSuccess('MS Word file imported successfully!');
    } catch (err) {
      setError('Failed to import MS Word file. Please check the file format.');
      console.error(err);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await fetchApi('admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setStats(data);
        setPosts(data.posts || []);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = fetchStats;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('is_featured', String(formData.is_featured));
    data.append('tags', formData.tags);
    data.append('seo_title', formData.seo_title);
    data.append('seo_description', formData.seo_description);
    data.append('sponsor_name', formData.sponsor_name);
    data.append('sponsor_link', formData.sponsor_link);
    data.append('external_link', formData.external_link);
    
    if (imageFile) {
      data.append('image', imageFile);
    }
    if (sponsorImageFile) {
      data.append('sponsor_image', sponsorImageFile);
    }

    const endpoint = editingPost ? `posts/${editingPost.id}` : 'posts';
    const method = editingPost ? 'PUT' : 'POST';

    try {
      const res = await fetchApi(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const resData = await res.json().catch(() => ({ message: 'Failed to parse server response' }));

      if (res.ok) {
        setSuccess(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
        setIsFormOpen(false);
        setEditingPost(null);
        setFormData({ 
          title: '', 
          content: '', 
          category: 'State', 
          is_featured: false,
          tags: '',
          seo_title: '',
          seo_description: '',
          sponsor_name: '',
          sponsor_link: '',
          external_link: '',
        });
        setImageFile(null);
        setSponsorImageFile(null);
        fetchPosts();
      } else {
        setError(resData.message || 'Operation failed');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setError('');
    setSuccess('');

    try {
      const res = await fetchApi(`posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({ message: 'Failed to parse server response' }));

      if (res.ok) {
        setSuccess('Post deleted successfully');
        fetchPosts();
      } else {
        setError(data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError('Failed to delete post. Please check your connection.');
    }
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      is_featured: post.is_featured === 1,
      tags: post.tags || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      sponsor_name: post.sponsor_name || '',
      sponsor_link: post.sponsor_link || '',
      external_link: post.external_link || '',
    });
    setIsFormOpen(true);
  };

  if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:block">
        <div className="p-8">
          <div className="flex items-center space-x-2 mb-12">
            <div className="bg-red-600 p-1 rounded">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900 tracking-tight uppercase text-sm">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'posts' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <FileText size={18} />
              <span>Posts</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-bold text-sm transition-all">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Manage News</h1>
              <p className="text-gray-500 mt-2">Create, edit and manage your news stories.</p>
            </div>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setFormData({ 
                    title: '', 
                    content: '', 
                    category: 'State', 
                    is_featured: false,
                    tags: '',
                    seo_title: '',
                    seo_description: '',
                    sponsor_name: '',
                    sponsor_link: '',
                    external_link: '',
                  });
                  setImageFile(null);
                  setSponsorImageFile(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          </div>

          {success && (
            <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 text-sm rounded-xl border border-emerald-100 flex items-center">
              <CheckCircle size={18} className="mr-2" />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center">
              <XCircle size={18} className="mr-2" />
              {error}
            </div>
          )}

          {activeTab === 'analytics' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {[
                { label: 'Total Views', value: stats.totalStats.total_views || 0, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Likes', value: stats.totalStats.total_likes || 0, icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Comments', value: stats.totalStats.total_comments || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Total Shares', value: stats.totalStats.total_shares || 0, icon: Share2, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Link Clicks', value: stats.totalStats.total_clicks || 0, icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stat.value.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Posts List */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Image</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stats</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <img src={post.image_url || `https://picsum.photos/seed/${post.id}/100/60`} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-bold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-gray-400">
                          <div className="flex items-center gap-1" title="Views">
                            <Eye size={14} />
                            <span className="text-xs font-bold">{post.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Likes">
                            <Heart size={14} />
                            <span className="text-xs font-bold">{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Comments">
                            <MessageSquare size={14} />
                            <span className="text-xs font-bold">{post.comment_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Shares">
                            <Share2 size={14} />
                            <span className="text-xs font-bold">{post.shares || 0}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Clicks">
                            <MousePointerClick size={14} />
                            <span className="text-xs font-bold">{post.clicks || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded tracking-wider">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => openEdit(post)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Post Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    placeholder="Enter news headline..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                      <span className="ml-2 text-sm font-bold text-gray-600">Featured Post</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Featured Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <ImageIcon className="text-gray-300 mb-2" size={32} />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Content (Rich Text Editor)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        ref={wordInputRef}
                        onChange={handleWordImport}
                        className="hidden"
                        accept=".docx"
                      />
                      <button
                        type="button"
                        onClick={() => wordInputRef.current?.click()}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-100 transition-all"
                      >
                        <FileUp size={14} />
                        <span>Import Word (.docx)</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={quillModules}
                      placeholder="Write your news story here..."
                      className="h-[400px] mb-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">External Link</label>
                    <input
                      type="url"
                      value={formData.external_link}
                      onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                      placeholder="news, cg, khabri"
                    />
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">SEO Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SEO Title</label>
                      <input
                        type="text"
                        value={formData.seo_title}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                        placeholder="Custom SEO title..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SEO Description</label>
                      <textarea
                        value={formData.seo_description}
                        onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-red-600/20 outline-none text-sm min-h-[80px]"
                        placeholder="Custom SEO description..."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-50/50 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest">Sponsorship / Promotion</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Sponsor Name</label>
                      <input
                        type="text"
                        value={formData.sponsor_name}
                        onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-red-100 rounded-lg focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                        placeholder="Product/App name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Sponsor Link</label>
                      <input
                        type="url"
                        value={formData.sponsor_link}
                        onChange={(e) => setFormData({ ...formData, sponsor_link: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-red-100 rounded-lg focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Sponsor Image</label>
                    <input
                      type="file"
                      onChange={(e) => setSponsorImageFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-4 font-bold rounded-xl transition-all shadow-lg ${
                    submitting 
                      ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editingPost ? 'Updating...' : 'Publishing...'}
                    </span>
                  ) : (
                    editingPost ? 'Update Post' : 'Publish Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
