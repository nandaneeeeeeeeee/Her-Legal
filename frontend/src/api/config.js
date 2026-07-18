export function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api/v1';
  const base = raw.replace(/\/$/, '');
  return /\/api(?:\/v\d+)?$/i.test(base) ? base : `${base}/api/v1`;
}

export function getApiUrl(path) {
  const base = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
