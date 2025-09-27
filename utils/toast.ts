import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#10B981',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'semibold',
        minWidth: '350px',
      },
    });
  },

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
    });
  },

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
  });
  },

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
      position: 'top-right',
      style: {
        minWidth: '250px',
      },
    });
  },
};
