import { getApp, getApps, initializeApp } from 'firebase/app';

export function getFirebaseApp(config) {
  return getApps().length > 0 ? getApp() : initializeApp(config);
}
