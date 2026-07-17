const BASE = '/api/v1';

let refreshPromise = null;

function getStored() {
  try {
    return JSON.parse(localStorage.getItem('herlegal_user') || 'null');
  } catch { return null; }
}

function setStored(data) {
  localStorage.setItem('herlegal_user', JSON.stringify(data));
}

function clearStored() {
  localStorage.removeItem('herlegal_user');
}

async function tryRefresh() {
  const stored = getStored();
  if (!stored?.refreshToken) return null;

  const res = await fetch(`${BASE}/auth/refreshToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: stored.refreshToken }),
  });
  if (!res.ok) {
    clearStored();
    return null;
  }
  const data = await res.json();
  const updated = {
    ...stored,
    token: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
  setStored(updated);
  return updated.token;
}

function buildOptions(options) {
  const { body, method = 'GET', headers: extraHeaders, ...rest } = options;
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  const lang = (() => {
    try {
      const fromUser = JSON.parse(localStorage.getItem('herlegal_user') || '{}')?.language;
      if (fromUser) return fromUser;
    } catch {}
    return localStorage.getItem('herlegal_language') || null;
  })();
  if (lang) headers['X-Language'] = lang;
  const opts = { method, headers, ...rest };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return opts;
}

function addAuthHeader(headers) {
  const stored = getStored();
  if (stored?.token) {
    headers['Authorization'] = `Bearer ${stored.token}`;
  }
}

export async function api(path, options = {}) {
  const opts = buildOptions(options);
  addAuthHeader(opts.headers);

  let res = await fetch(`${BASE}${path}`, opts);

  if (res.status === 401 && options.auth !== false) {
    if (!refreshPromise) refreshPromise = tryRefresh().catch(() => null);
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      opts.headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, opts);
    }
  }

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
