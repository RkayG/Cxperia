import React from 'react';

interface SavingOverlayProps {
  visible: boolean;
  message?: string;
}

const SavingOverlay: React.FC<SavingOverlayProps> = ({ visible, message = 'Saving your progress...' }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg w-80">
        <div className="flex items-center space-x-2 mb-4">
          <span className="dot-bounce bg-gray-500"></span>
          <span className="dot-bounce bg-gray-500" style={{ animationDelay: '0.2s' }}></span>
          <span className="dot-bounce bg-gray-500" style={{ animationDelay: '0.4s' }}></span>
          <span className="dot-bounce bg-gray-500" style={{ animationDelay: '0.6s' }}></span>
        </div>
        <style>{`
          .dot-bounce {
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 9999px;
            margin-right: 0.5rem;
            animation: bounceDot 0.8s infinite cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes bounceDot {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(-10px); opacity: 1; }
          }
        `}</style>
        <div className="text-lg font-medium text-gray-800 text-center">{message}</div>
        {/* <div className="text-sm text-gray-500 mt-2">This may take a few seconds.</div> */}
      </div>
    </div>
  );
};

export default SavingOverlay;
