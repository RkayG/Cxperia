import { CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  slug?: string;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, customerName, slug }) => {
  const { color, product } = usePublicExpStore();
  const router = useRouter();

  const handleContinueExploring = () => {
    onClose();
    if (slug) {
      // Navigate to home section using URL parameter
      router.push(`/experience/${slug}?section=home`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <CheckCircle 
                size={48} 
                style={{ color }} 
                className="drop-shadow-sm"
              />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Merci{customerName ? `, ${customerName}` : ''}!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Votre feedback sur <span className="font-semibold" style={{ color }}>
                {product?.name || 'notre produit'}
              </span> a été reçu et est très précieux pour nous.
            </p>
          </div>

          {/* Additional Message */}
          <div className="mb-8">
            <div 
              className="bg-gray-50 rounded-xl p-4 border-l-4"
              style={{ borderLeftColor: color }}
            >
              <p className="text-sm text-gray-700">
                Nous examinons tous les feedbacks avec soin pour améliorer nos produits et services. 
                Votre input nous aide à créer de meilleures expériences pour tout le monde.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleContinueExploring}
            className="w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            style={{ backgroundColor: color }}
          >
            Continuer l'exploration
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: color }} />
        
        {/* Floating Particles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-4 left-4 w-2 h-2 rounded-full opacity-30 animate-bounce"
            style={{ backgroundColor: color, animationDelay: '0s' }}
          />
          <div 
            className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full opacity-40 animate-bounce"
            style={{ backgroundColor: color, animationDelay: '0.5s' }}
          />
          <div 
            className="absolute bottom-12 left-8 w-1 h-1 rounded-full opacity-50 animate-bounce"
            style={{ backgroundColor: color, animationDelay: '1s' }}
          />
          <div 
            className="absolute bottom-8 right-12 w-2 h-2 rounded-full opacity-20 animate-bounce"
            style={{ backgroundColor: color, animationDelay: '1.5s' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
