// src/services/uploadService.ts
// Service for uploading files (images, videos, etc.) to the backend

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

function getToken(): string | null {
  function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  return getCookie('token') || localStorage.getItem('token');
}

const DEFAULTS = {
  maxImageSize: 10 * 1024 * 1024,
  maxVideoSize: 100 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
  allowedVideoTypesPrefix: 'video/',
};

type UploadResult = { url?: string; raw?: any };

function extractUrlFromUploadResponse(json: any): string | null {
  if (!json) return null;
  if (typeof json === 'string') return json;
  if (json.url) return json.url;
  if (json.secure_url) return json.secure_url;
  const r = json.raw || json.data || json;
  if (!r) return null;
  if (r.url) return r.url;
  if (r.secure_url) return r.secure_url;
  if (r.cloudinary && (r.cloudinary.secure_url || r.cloudinary.url)) return r.cloudinary.secure_url || r.cloudinary.url;
  if (r.upload_record && (r.upload_record.secure_url || r.upload_record.url)) return r.upload_record.secure_url || r.upload_record.url;
  if (Array.isArray(r) && r[0] && (r[0].secure_url || r[0].url)) return r[0].secure_url || r[0].url;
  return null;
}

function parseXhrResponse(xhr: XMLHttpRequest): UploadResult {
  try {
    const json = JSON.parse(xhr.responseText || '{}');
    const url = extractUrlFromUploadResponse(json);
    if (url) return { url, raw: json };
    return { raw: json };
  } catch (err) {
    return { raw: null };
  }
}

// uploadFileCancelable: returns { promise, cancel }
export function uploadFileCancelable(
  file: File,
  folder: string = 'experience_uploads',
  options?: { onProgress?: (p: number) => void; maxSize?: number; allowedTypes?: string[] }
) {
  const token = getToken();
  const isVideo = file.type.startsWith(DEFAULTS.allowedVideoTypesPrefix);
  const maxSize = options?.maxSize ?? (isVideo ? DEFAULTS.maxVideoSize : DEFAULTS.maxImageSize);
  const allowed = options?.allowedTypes ?? (isVideo ? null : DEFAULTS.allowedImageTypes);

  if (file.size > maxSize) {
    return { promise: Promise.reject(new Error(`File too large. Max ${(maxSize / (1024 * 1024)).toFixed(1)}MB`)), cancel: () => {} };
  }
  if (allowed && !allowed.includes(file.type)) {
    return { promise: Promise.reject(new Error('Invalid file type')), cancel: () => {} };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  let xhr: XMLHttpRequest | null = new XMLHttpRequest();

  const promise: Promise<UploadResult> = new Promise((resolve, reject) => {
    try {
      xhr!.open('POST', `${API_BASE}/upload`, true);
      if (token) xhr!.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr!.upload.onprogress = (e) => {
        if (e.lengthComputable && options?.onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress(percent);
        }
      };
      xhr!.onload = () => {
        if (!xhr) return reject(new Error('Upload aborted'));
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(parseXhrResponse(xhr));
        } else {
          const parsed = parseXhrResponse(xhr);
          reject(parsed);
        }
      };
      xhr!.onerror = () => reject(new Error('Network error'));
      xhr!.send(formData);
    } catch (err) {
      reject(err);
    }
  });

  return {
    promise,
    cancel: () => {
      if (xhr) {
        try { xhr.abort(); } catch (e) {}
        xhr = null;
      }
    }
  };
}

// uploadFilesCancelable: multiple files
export function uploadFilesCancelable(
  files: File[],
  folder: string = 'experience_uploads',
  options?: { onProgress?: (p: number) => void; maxSize?: number; allowedTypes?: string[] }
) {
  const token = getToken();
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  for (const file of files) {
    const isVideo = file.type.startsWith(DEFAULTS.allowedVideoTypesPrefix);
    const maxSize = options?.maxSize ?? (isVideo ? DEFAULTS.maxVideoSize : DEFAULTS.maxImageSize);
    const allowed = options?.allowedTypes ?? (isVideo ? null : DEFAULTS.allowedImageTypes);
    if (file.size > maxSize) return { promise: Promise.reject(new Error(`File ${file.name} too large`)), cancel: () => {} };
    if (allowed && !allowed.includes(file.type)) return { promise: Promise.reject(new Error(`Invalid file type for ${file.name}`)), cancel: () => {} };
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('folder', folder);

  let xhr: XMLHttpRequest | null = new XMLHttpRequest();

  const promise: Promise<UploadResult> = new Promise((resolve, reject) => {
    try {
      xhr!.open('POST', `${API_BASE}/upload/multiple`, true);
      if (token) xhr!.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr!.upload.onprogress = (e) => {
        if (e.lengthComputable && options?.onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          options.onProgress(percent);
        } else if (options?.onProgress) {
          const percent = Math.round((e.loaded / totalSize) * 100);
          options.onProgress(percent);
        }
      };
      xhr!.onload = () => {
        if (!xhr) return reject(new Error('Upload aborted'));
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(parseXhrResponse(xhr));
        } else {
          reject(parseXhrResponse(xhr));
        }
      };
      xhr!.onerror = () => reject(new Error('Network error'));
      xhr!.send(formData);
    } catch (err) {
      reject(err);
    }
  });

  return {
    promise,
    cancel: () => {
      if (xhr) {
        try { xhr.abort(); } catch (e) {}
        xhr = null;
      }
    }
  };
}

// convenience wrappers that return a plain Promise (non-cancelable)
export function uploadFile(file: File, folder?: string, options?: { onProgress?: (p: number) => void; maxSize?: number; allowedTypes?: string[] }) {
  return uploadFileCancelable(file, folder, options).promise;
}

export function uploadFiles(files: File[], folder?: string, options?: { onProgress?: (p: number) => void; maxSize?: number; allowedTypes?: string[] }) {
  return uploadFilesCancelable(files, folder, options).promise;
}
