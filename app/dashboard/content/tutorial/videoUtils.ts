// videoUtils.ts
// Shared video helpers for YouTube, Vimeo, direct URLs, etc.

export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return true;
    if (hostname.includes('vimeo.com')) return true;
    const pathname = urlObj.pathname.toLowerCase();
    if (pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.mov') || pathname.endsWith('.avi')) return true;
    if (hostname.includes('cloudinary.com') || hostname.includes('amazonaws.com') || hostname.includes('googleapis.com')) return true;
    return false;
  } catch {
    return false;
  }
}

export function getVideoType(url: string): 'youtube' | 'vimeo' | 'direct' | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('vimeo.com')) return 'vimeo';
    const pathname = urlObj.pathname.toLowerCase();
    if (pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.mov') || pathname.endsWith('.avi')) return 'direct';
    if (hostname.includes('cloudinary.com') || hostname.includes('amazonaws.com') || hostname.includes('googleapis.com')) return 'direct';
    return null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

export function getVimeoEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.pathname.split('/').pop();
    if (videoId && !isNaN(Number(videoId))) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  } catch {
    return url;
  }
}
