import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);

const AuthContext = createContext(null);

function requireFirebaseClient(client) {
  if (!client) {
    throw new Error('Firebase is not ready. Check the Firebase setup and try again.');
  }
  return client;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [authError, setAuthError] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!firebaseConfigured) return undefined;

    let active = true;
    let unsubscribe = () => {};

    import('./firebaseClient.js')
      .then(({ createFirebaseClient }) => {
        if (!active) return;
        const firebaseClient = createFirebaseClient(firebaseConfig);
        setClient(firebaseClient);
        unsubscribe = firebaseClient.subscribe(
          (nextUser) => {
            if (!active) return;
            setUser(nextUser);
            setAuthError('');
            setLoading(false);
          },
          (error) => {
            if (!active) return;
            setAuthError(error.message);
            setLoading(false);
          },
        );
      })
      .catch(() => {
        if (!active) return;
        setAuthError('Firebase could not be initialized. Check your Firebase app configuration.');
        setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      configured: firebaseConfigured,
      signInWithGoogle: () => requireFirebaseClient(client).signInWithGoogle(),
      signInWithEmail: (email, password) =>
        requireFirebaseClient(client).signInWithEmail(email, password),
      createEmailAccount: (email, password, displayName) =>
        requireFirebaseClient(client).createEmailAccount(email, password, displayName),
      signOut: () => requireFirebaseClient(client).signOut(),
      listUserScenarios: (userId) => requireFirebaseClient(client).listUserScenarios(userId),
      saveUserScenario: (userId, title, inputs) =>
        requireFirebaseClient(client).saveUserScenario(userId, title, inputs),
      deleteUserScenario: (userId, scenarioId) =>
        requireFirebaseClient(client).deleteUserScenario(userId, scenarioId),
    }),
    [user, loading, authError, client],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
