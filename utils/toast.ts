import toast from 'react-hot-toast';

// Base style for the glassy, sleek look
const BASE_GLASS_STYLE = {
  borderRadius: '12px',
  padding: '16px 20px',
  fontSize: '15px',
  fontWeight: '600',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.20)', // Subtle shadow for depth
  minWidth: '300px',
  color: '#fff', // Very light purple/white text
};

export const showToast = {
  /** Displays a successful, purple-themed glassy toast. */
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        ...BASE_GLASS_STYLE,
        background: 'rgba(76, 29, 149, 0.95)', // Deep purple (indigo-900) with high opacity
        border: '1px solid #4C1D95',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff', // White icon
        secondary: '#4C1D95', // Deep purple border
      },
      ariaProps: {
        role: 'alert',
        'aria-live': 'polite',
      },
    });
  },

  /** Displays an error, red-themed glassy toast. */
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'semibold',
        minWidth: '350px',
      },
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive',
      },
    });
  },

  /** Displays a loading, purple-themed glassy toast. */
  loading: (message: string) => {
    toast.loading(message, {
      duration: 4000,
      style: {
        background: '#3B82F6',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'semibold',
        minWidth: '350px',
      },
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  },

  /** Handles a promise and displays appropriate glassy toasts for each state. */
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }, {
      position: 'top-center',
      style: {
        ...BASE_GLASS_STYLE,
        // Using a neutral background for promise initial state
        background: 'rgba(156, 163, 175, 0.3)', // Gray/neutral with opacity
        border: '1px solid rgba(156, 163, 175, 0.5)',
        minWidth: '350px',
      },
      // Override default success/error styles for promise result
      success: {
        duration: 3000,
        iconTheme: { primary: '#6D28D9', secondary: '#C4B5FD' },
        style: {
            ...BASE_GLASS_STYLE,
            background: 'rgba(139, 92, 246, 0.5)',
            border: '1px solid rgba(139, 92, 246, 0.8)',
        },
        ariaProps: {
          role: 'alert',
          'aria-live': 'polite',
        },
      },
      error: {
        duration: 4000,
        iconTheme: { primary: '#FCA5A5', secondary: '#991B1B' },
        style: {
            ...BASE_GLASS_STYLE,
            background: 'rgba(239, 68, 68, 0.5)',
            border: '1px solid rgba(239, 68, 68, 0.8)',
        },
        ariaProps: {
          role: 'alert',
          'aria-live': 'assertive',
        },
      },
      loading: {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      },
    });
  },
};
