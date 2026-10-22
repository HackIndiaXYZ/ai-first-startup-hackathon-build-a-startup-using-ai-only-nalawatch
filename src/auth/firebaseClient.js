import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseApp } from './firebaseApp.js';

export function createFirebaseClient(config) {
  const app = getFirebaseApp(config);
  const auth = getAuth(app);
  let scenarioStorePromise;
  const getScenarioStore = () => {
    if (!scenarioStorePromise) {
      scenarioStorePromise = import('./firebaseScenarioStore.js').then(
        ({ createFirebaseScenarioStore }) => createFirebaseScenarioStore(app),
      );
    }
    return scenarioStorePromise;
  };

  return {
    subscribe: (onUser, onError) => onAuthStateChanged(auth, onUser, onError),
    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    },
    signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
    createEmailAccount: async (email, password, displayName) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() });
      }
    },
    signOut: () => signOut(auth),
    listUserScenarios: async (userId) =>
      (await getScenarioStore()).listUserScenarios(userId),
    saveUserScenario: async (userId, title, inputs) =>
      (await getScenarioStore()).saveUserScenario(userId, title, inputs),
    deleteUserScenario: async (userId, scenarioId) =>
      (await getScenarioStore()).deleteUserScenario(userId, scenarioId),
  };
}
