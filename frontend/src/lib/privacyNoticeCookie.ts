const PRIVACY_NOTICE_COOKIE_NAME = "privacy_notice_seen";
const PRIVACY_NOTICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function hasSeenPrivacyNotice(): boolean {
  if (typeof document === "undefined") return true;

  return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${PRIVACY_NOTICE_COOKIE_NAME}=`));
}

export function setPrivacyNoticeSeen(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${PRIVACY_NOTICE_COOKIE_NAME}=1; path=/; max-age=${PRIVACY_NOTICE_COOKIE_MAX_AGE}`;
}

export { PRIVACY_NOTICE_COOKIE_NAME, PRIVACY_NOTICE_COOKIE_MAX_AGE };

