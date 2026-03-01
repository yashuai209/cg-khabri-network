import BackButton from '../components/BackButton';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <BackButton className="mb-8" />
      <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">About CG Khabri Network</h1>
      <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
        <p>
          Welcome to <strong>CG Khabri Network</strong>, your premier source for the most accurate, timely, and comprehensive news coverage from across the vibrant state of Chhattisgarh.
        </p>
        <p>
          Established with a vision to bridge the information gap in our state, we are dedicated to delivering news that matters to you. From the bustling streets of Raipur to the remote forests of Bastar, our network of reporters works tirelessly to bring you stories that shape our society.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
        <p>
          Our mission is simple: To provide unbiased, factual, and high-quality journalism that empowers the citizens of Chhattisgarh. we believe in the power of information to drive positive change and foster a more informed community.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What We Cover</h2>
        <ul>
          <li><strong>State News:</strong> In-depth coverage of political, social, and cultural events across all 33 districts.</li>
          <li><strong>National:</strong> Major headlines from across India that impact our state.</li>
          <li><strong>Sports:</strong> Local talent and international sporting events.</li>
          <li><strong>Technology & Entertainment:</strong> The latest trends and updates from the digital and creative worlds.</li>
        </ul>

        <div className="mt-20 p-10 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-10">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white flex-shrink-0">
            <img src="/author.jpg" alt="Yashwant Kumar Sahani" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Yashwant Kumar Sahani</h2>
            <p className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4">Founder & Editor-in-Chief</p>
            <p className="text-gray-600 leading-relaxed mb-6">
              With a passion for digital storytelling and a deep connection to the roots of Chhattisgarh, Yashwant Kumar Sahani founded CG Khabri Network to provide a voice to the people and a platform for authentic journalism.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/yashwa_ntlifestyle?igsh=Mm5lZjdianhvZ2hh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/in/yashwant-kumar-94888b343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">LinkedIn</a>
              <a href="https://www.youtube.com/@Yashmusicmp3" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
