import { MOBILE_APP_LINKS } from "@/models/Business";

export function isAndroid(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android/i.test(userAgent);
}

export function isMac(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(userAgent);
}

export function openAppAsAndroid() {
  window.location.href = MOBILE_APP_LINKS.android.deepLink;
  setTimeout(() => {
    window.location.href = MOBILE_APP_LINKS.android.store;
  }, 1500);
}

export function openAppAsMac() {
  window.location.href = MOBILE_APP_LINKS.mac.deepLink;
  setTimeout(() => {
    window.location.href = MOBILE_APP_LINKS.mac.store;
  }, 1500);
}

export function openApp() {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/android/i.test(userAgent)) {
    openAppAsAndroid();
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    openAppAsMac();
  } else {
    openAppAsAndroid();
  }
}
