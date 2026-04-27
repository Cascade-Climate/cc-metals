const TERMS_VERSION = 'v1';
const COOKIE_NAME = `erw_mac_terms_${TERMS_VERSION}`;
const COOKIE_TTL_DAYS = 122;

export function hasAgreedToTerms(): boolean {
  return document.cookie
    .split('; ')
    .some((entry) => entry === `${COOKIE_NAME}=true`);
}

export function setAgreedToTerms(): void {
  const maxAgeSeconds = COOKIE_TTL_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}
