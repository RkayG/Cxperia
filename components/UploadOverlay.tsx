import React from 'react';

interface UploadOverlayProps {
  visible: boolean;
  progress?: number; // 0-100
  title?: string;
  fileName?: string;
  error?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  inline?: boolean; // when true, overlay is positioned absolutely within parent instead of fixed fullscreen
}

const UploadOverlay: React.FC<UploadOverlayProps> = ({
  visible,
  progress = 0,
  title = 'Uploading',
  fileName,
  error = false,
  onCancel,
  onRetry,
  inline = false,
}) => {
  if (!visible) return null;

  const percent = Math.min(100, Math.max(0, Math.round(progress)));

  if (inline) {
    // Render overlay absolutely positioned to cover the parent container (expects parent to be relative)
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
        <div className="absolute inset-0 rounded-2xl bg-black/40" />
        <div className="relative z-30 w-full max-w-sm rounded-xl bg-white p-4 shadow-lg mx-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              {fileName && <p className="text-xs text-gray-500 mt-1 truncate">{fileName}</p>}
            </div>
            <div className="text-sm font-medium text-gray-700">{percent}%</div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full bg-purple-600 transition-all duration-200`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {error ? (
              <>
                <button
                  onClick={onRetry}
                  className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Retry
                </button>
                <button
                  onClick={onCancel}
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  Close
                </button>
              </>
            ) : (
              <button
                onClick={onCancel}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {fileName && <p className="text-sm text-gray-500 mt-1">{fileName}</p>}
          </div>
          <div className="text-sm font-medium text-gray-700">{percent}%</div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full bg-purple-600 transition-all duration-200`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          {error ? (
            <>
              <button
                onClick={onRetry}
                className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Retry
              </button>
              <button
                onClick={onCancel}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadOverlay;
