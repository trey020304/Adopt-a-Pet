/**
 * Session guard: Redirect unauthenticated users to the login page.
 * Uses auth state listener for reliable session detection.
 */

let userSession = null;
let authStateReceived = false;
let redirectScheduled = false;

console.log('[Session Guard] Initializing...');

// Wait for Supabase to be ready, then set up listener
function setupAuthListener() {
  if (!window.supabase || !window.supabase.auth) {
    console.log('[Session Guard] Supabase not ready, retrying...');
    setTimeout(setupAuthListener, 100);
    return;
  }

  console.log('[Session Guard] Supabase ready, setting up auth listener');
  
  supabase.auth.onAuthStateChange((event, session) => {
    userSession = session;
    authStateReceived = true;
    console.log('[Session Guard] Auth state:', event, 'User:', session?.user?.email || 'none');
    
    // Redirect immediately if no user
    if (!session?.user) {
      if (!redirectScheduled) {
        redirectScheduled = true;
        console.log('[Session Guard] No user in session, redirecting to login');
        window.location.href = '/login.html';
      }
    }
  });

  // Also do an explicit check in case listener doesn't fire immediately
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!authStateReceived) {
      userSession = session;
      authStateReceived = true;
      console.log('[Session Guard] Got session from getSession:', session?.user?.email || 'none');
      
      if (!session?.user) {
        if (!redirectScheduled) {
          redirectScheduled = true;
          console.log('[Session Guard] getSession: No user, redirecting');
          window.location.href = '/login.html';
        }
      }
    }
  });
}

// Start setup immediately
setupAuthListener();

// Safety timeout - if no auth check happened in 3 seconds, redirect
setTimeout(() => {
  if (!authStateReceived && !redirectScheduled) {
    console.log('[Session Guard] Timeout with no auth state, redirecting');
    redirectScheduled = true;
    window.location.href = '/login.html';
  }
}, 3000);

// On page show (back button), check again
window.addEventListener('pageshow', function() {
  console.log('[Session Guard] pageshow - authStateReceived:', authStateReceived, 'hasSession:', !!userSession?.user);
  if (authStateReceived && !userSession?.user && !redirectScheduled) {
    redirectScheduled = true;
    console.log('[Session Guard] pageshow: No session, redirecting');
    window.location.href = '/login.html';
  }
});
