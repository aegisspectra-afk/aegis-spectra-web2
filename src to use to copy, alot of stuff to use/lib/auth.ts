export function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("spectra_token", token);
  if (typeof document !== "undefined") {
    const isProd = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secure = isProd ? '; Secure' : '';
    document.cookie = `spectra_token=${token}; Path=/; SameSite=Lax${secure}`;
  }
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const ls = localStorage.getItem("spectra_token");
  if (ls) return ls;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )spectra_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}
export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("spectra_token");
  if (typeof document !== "undefined") {
    document.cookie = `spectra_token=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}