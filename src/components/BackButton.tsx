import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center text-sm font-bold text-gray-500 hover:text-red-600 transition-colors group ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-red-50 transition-colors">
        <ArrowLeft size={16} />
      </div>
      Go Back
    </button>
  );
}
