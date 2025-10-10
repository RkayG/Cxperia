// lib/utils/subdomain.ts

export function getSubdomainUrl(path: string = '/', subdomain?: string): string {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3001';
  
  // Clean the root domain
  const cleanDomain = rootDomain.replace('https://', '').replace('http://', '');
  
  if (subdomain) {
    return `${protocol}://${subdomain}.${cleanDomain}${path}`;
  }
  
  return `${protocol}://${cleanDomain}${path}`;
}

export function redirectToSubdomain(path: string = '/', subdomain?: string): void {
  const url = getSubdomainUrl(path, subdomain);
  window.location.href = url;
}

export function getDashboardUrl(path: string = '/'): string {
  return getSubdomainUrl(path, 'app');
}

export function redirectToDashboard(path: string = '/'): void {
  redirectToSubdomain(path, 'app');
}

