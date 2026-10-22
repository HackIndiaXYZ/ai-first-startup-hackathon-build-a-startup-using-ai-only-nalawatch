import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/FirebaseAuthContext.jsx';

function getAuthErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
    'auth/invalid-credential': 'Email or password is incorrect. Check your details and try again.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
    'auth/too-many-requests': 'There have been too many attempts. Wait a little and try again.',
    'auth/network-request-failed': 'Network connection failed. Check your connection and try again.',
  };

  return messages[error?.code] ?? 'Sign-in could not be completed. Please try again.';
}

export default function AccountControl() {
  const { user, loading, configured, authError, signInWithGoogle, signInWithEmail, createEmailAccount, signOut } =
    useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!dialogOpen) return undefined;

    const dialog = dialogRef.current;
    const closeButton = dialog?.querySelector('.auth-close');
    closeButton?.focus();

    function handleDialogKeyDown(event) {
      if (event.key === 'Escape') {
        setDialogOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;

      const focusable = [...dialog.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), [href], select:not(:disabled), textarea:not(:disabled)',
      )];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.removeEventListener('keydown', handleDialogKeyDown);
      if (triggerRef.current?.isConnected) {
        triggerRef.current.focus();
      } else {
        document.querySelector('.account-sign-out')?.focus();
      }
    };
  }, [dialogOpen]);

  async function runAuthAction(action) {
    setError('');
    setBusy(true);
    try {
      await action();
      setDialogOpen(false);
      setPassword('');
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await runAuthAction(signOut);
  }

  return (
    <>
      {loading ? (
        <span className="account-loading" role="status">Checking account…</span>
      ) : user ? (
        <div className="account-menu">
          <div className="account-identity">
            {user.photoURL ? (
              <img className="account-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="account-avatar account-avatar-initial" aria-hidden="true">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <span className="account-email" title={user.email || ''}>{user.displayName || user.email}</span>
          </div>
          <button className="account-button account-sign-out" type="button" onClick={handleSignOut} disabled={busy}>
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : (
        <button
          className="account-button account-sign-in"
          type="button"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setError('');
            setDialogOpen(true);
          }}
        >
          Sign in
        </button>
      )}

      {dialogOpen && (
        <div className="auth-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <section
            className="auth-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              type="button"
              aria-label="Close sign-in"
              onClick={() => setDialogOpen(false)}
            >
              ×
            </button>
            <div className="auth-brand-mark" aria-hidden="true">N</div>
            <span className="eyebrow">Your NalaWatch workspace</span>
            <h2 id="auth-title">{creatingAccount ? 'Create your account' : 'Welcome back'}</h2>
            <p className="auth-description">
              Sign in to keep your scenario work private and available on your account.
            </p>

            {!configured ? (
              <div className="auth-setup-notice" role="status">
                <strong>Authentication setup required</strong>
                <span>
                  Add your Firebase web app settings to <code>.env.local</code>, enable Google and Email/Password
                  providers, and restart the app. See the Firebase setup steps in the README.
                </span>
              </div>
            ) : (
              <>
                {(authError || error) && (
                  <p className="auth-error" role="alert">
                    {error || 'Your sign-in status could not be checked. Refresh the page and try again.'}
                  </p>
                )}
                <button
                  className="google-sign-in"
                  type="button"
                  disabled={busy}
                  onClick={() => runAuthAction(signInWithGoogle)}
                >
                  <span className="google-g" aria-hidden="true">G</span>
                  Continue with Google
                </button>
                <div className="auth-divider"><span>or with email</span></div>
                <form
                  className="auth-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    runAuthAction(() =>
                      creatingAccount
                        ? createEmailAccount(email, password, displayName)
                        : signInWithEmail(email, password),
                    );
                  }}
                >
                  {creatingAccount && (
                    <label>
                      Name <span>(optional)</span>
                      <input
                        type="text"
                        autoComplete="name"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        maxLength={80}
                      />
                    </label>
                  )}
                  <label>
                    Email
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      autoComplete={creatingAccount ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={6}
                      required
                    />
                  </label>
                  <button className="account-button auth-submit" type="submit" disabled={busy}>
                    {busy ? 'Please wait…' : creatingAccount ? 'Create account' : 'Sign in with email'}
                  </button>
                </form>
                <p className="auth-mode-switch">
                  {creatingAccount ? 'Already have an account?' : 'New to NalaWatch?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCreatingAccount((current) => !current);
                      setError('');
                    }}
                  >
                    {creatingAccount ? 'Sign in' : 'Create account'}
                  </button>
                </p>
                <p className="auth-privacy-note">
                  Your saved scenarios are associated with your account. Do not store sensitive or emergency-response data here.
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
