// Enhanced validation utilities
const ValidationUtils = {
  // Phone number validation with international support
  validatePhone: (phone: string): string => {
    if (!phone.trim()) return '';
    
    // Remove all non-digit characters except + and spaces for counting
    const cleanPhone = phone.replace(/[^\d+\s]/g, '');
    const digitsOnly = cleanPhone.replace(/[^\d]/g, '');
    
    // Check for valid characters (digits, +, -, (), spaces)
    if (!/^[\d+\-() \s]+$/.test(phone)) {
      return 'Phone number can only contain digits, +, -, (), and spaces';
    }
    
    // Must start with + for international or be at least 7 digits
    if (phone.startsWith('+')) {
      if (digitsOnly.length < 8 || digitsOnly.length > 15) {
        return 'International number must be 8-15 digits';
      }
    } else {
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return 'Phone number must be 7-15 digits';
      }
    }
    
    return '';
  },

  // Enhanced email validation
  validateEmail: (email: string): string => {
    if (!email.trim()) return '';
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common typos
   // const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (domain && domain.includes('..')) {
      return 'Email domain cannot contain consecutive dots';
    }
    
    return '';
  },

  // Enhanced URL validation with specific platform checks
  validateUrl: (url: string, platform?: string): string => {
    if (!url.trim()) return '';
    
    try {
      const urlObj = new URL(url);
      
      // Must be HTTPS
      if (urlObj.protocol !== 'https:') {
        return 'URL must use HTTPS (https://)';
      }
      
      // Platform-specific domain validation
      if (platform) {
        const hostname = urlObj.hostname.toLowerCase();
        switch (platform) {
          case 'facebook':
            if (!hostname.includes('facebook.com') && !hostname.includes('fb.com')) {
              return 'Must be a valid Facebook URL';
            }
            break;
          case 'instagram':
            if (!hostname.includes('instagram.com')) {
              return 'Must be a valid Instagram URL';
            }
            break;
          case 'twitter':
            if (!hostname.includes('twitter.com') && !hostname.includes('x.com')) {
              return 'Must be a valid Twitter/X URL';
            }
            break;
          case 'tiktok':
            if (!hostname.includes('tiktok.com')) {
              return 'Must be a valid TikTok URL';
            }
            break;
          case 'youtube':
            if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
              return 'Must be a valid YouTube URL';
            }
            break;
        }
      }
      
      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  },

  // WhatsApp number specific validation
  validateWhatsApp: (phone: string): string => {
    const phoneError = ValidationUtils.validatePhone(phone);
    if (phoneError) return phoneError;
    
    if (phone.trim() && !phone.startsWith('+')) {
      return 'WhatsApp number should include country code (e.g., +1234567890)';
    }
    
    return '';
  }
};

// Enhanced validation function
const validateField = (id: string, value: string, fieldType: string): { error: string; warning: string } => {
    let error = '';
    let warning = '';

    if (!value.trim()) {
      return { error: '', warning: '' };
    }

    switch (id) {
      case 'whatsAppNumber':
        error = ValidationUtils.validateWhatsApp(value);
        break;
      case 'supportEmail':
        error = ValidationUtils.validateEmail(value);
        // Warning for non-business emails
        if (!error && (value.includes('@gmail.com') || value.includes('@yahoo.com') || value.includes('@hotmail.com'))) {
          warning = 'Consider using a business email for better credibility';
        }
        break;
      case 'faqPageUrl':
        error = ValidationUtils.validateUrl(value);
        break;
      case 'facebookUrl':
        error = ValidationUtils.validateUrl(value, 'facebook');
        break;
      case 'instagramUrl':
        error = ValidationUtils.validateUrl(value, 'instagram');
        break;
      case 'twitterUrl':
        error = ValidationUtils.validateUrl(value, 'twitter');
        break;
      case 'tiktokUrl':
        error = ValidationUtils.validateUrl(value, 'tiktok');
        break;
      case 'youtubeUrl':
        error = ValidationUtils.validateUrl(value, 'youtube');
        break;
      default:
        if (fieldType === 'url') {
          error = ValidationUtils.validateUrl(value);
        }
    }

    return { error, warning };
  };

export { validateField };