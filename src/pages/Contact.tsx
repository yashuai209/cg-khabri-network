import { Mail, Phone, MapPin, Send } from 'lucide-react';
import BackButton from '../components/BackButton';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <BackButton className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">Get in Touch</h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            Have a news tip, feedback, or inquiry? Our team is here to listen and respond. Reach out to CG Khabri Network today.
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-red-50 p-4 rounded-2xl text-red-600 mr-6">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-500">yashwantkhutte4@gmail.com</p>
                <p className="text-gray-500">news@cgkhabri.network</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-red-50 p-4 rounded-2xl text-red-600 mr-6">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-500">+91 62650 80534</p>
                <p className="text-gray-500">+91 987 654 3210</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-red-50 p-4 rounded-2xl text-red-600 mr-6">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Our Office</h3>
                <p className="text-gray-500">Rampur, Chhattisgarh</p>
                <p className="text-gray-500">Pincode: 493555</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                placeholder="News Tip / Inquiry"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Message</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none min-h-[150px]"
                placeholder="How can we help you?"
              />
            </div>

            <button className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center space-x-2">
              <Send size={18} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
