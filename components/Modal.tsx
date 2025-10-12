import React from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  color?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  color,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  disabled = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
        {title && (
          <h2 className="text-lg font-bold mb-2 text-gray-800">{title}</h2>
        )}
        {description && <p className="text-gray-900 mb-4">{description}</p>}
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={disabled}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            onClick={onConfirm}
            disabled={disabled}
            style={{ backgroundColor: disabled ? '#9CA3AF' : (color ? `${color}` : "#6B46C1") }}
          >
            {disabled && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
