import React, { useEffect, useState, useRef } from "react";

export const Navigation = (props) => {
  const [session, setSession] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    let subscription = null;

    // handler defined outside loop to avoid function-in-loop eslint warning
    const authChangeHandler = (event, newSession) => {
      console.log('[Navigation] onAuthStateChange event:', event, newSession);
      if (isMountedRef.current) setSession(newSession);
    };

    // Wait for supabase to be available globally
    const checkSupabase = async () => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds with 100ms interval

      while (attempts < maxAttempts) {
        if (typeof window !== 'undefined' && window.supabase && window.supabase.auth) {
          try {
            console.log('[Navigation] supabase found on window');
            // Get initial session
            const { data: { session: initialSession } } = await window.supabase.auth.getSession();
            console.log('[Navigation] initialSession ->', initialSession);
            if (isMountedRef.current) {
              setSession(initialSession);
            }

            // fallback: try to hydrate session from Supabase stored values in localStorage
            if (!initialSession) {
              try {
                console.log('[Navigation] initialSession empty — checking auth.getUser()');
                const { data: userData } = await window.supabase.auth.getUser();
                console.log('[Navigation] auth.getUser ->', userData);
                if (userData && isMountedRef.current) {
                  // some Supabase builds return a user object; construct a minimal session-like object
                  setSession({ user: userData });
                }
              } catch (e) {
                console.warn('[Navigation] auth.getUser failed', e);
              }

              if (!window.supabase.auth) {
                console.warn('[Navigation] supabase.auth is not available for fallback');
              }

              // Inspect localStorage keys for supabase data as a last resort
              try {
                const keys = Object.keys(window.localStorage || {});
                const supaKey = keys.find(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('sb:') || k.toLowerCase().includes('supabase.auth'));
                if (supaKey) {
                  console.log('[Navigation] found localStorage key for supabase:', supaKey);
                  const raw = window.localStorage.getItem(supaKey);
                  try {
                    const parsed = JSON.parse(raw);
                    // try to find a user inside parsed object
                    const candidateUser = parsed?.currentSession?.user || parsed?.user || parsed?.currentUser || parsed?.session?.user;
                    if (candidateUser && isMountedRef.current) {
                      console.log('[Navigation] hydrating session from localStorage candidateUser', candidateUser);
                      setSession({ user: candidateUser });
                    }
                  } catch (pe) {
                    // raw may not be JSON
                  }
                }
              } catch (lsErr) {
                console.warn('[Navigation] localStorage inspect failed', lsErr);
              }
            }

            // Set up listener for auth changes
            const { data } = window.supabase.auth.onAuthStateChange(authChangeHandler);

            subscription = data?.subscription;
            return;
          } catch (err) {
            console.error('Error with Supabase:', err);
          }
        }

        // Wait 100ms before trying again
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      console.warn('Supabase did not load within 5 seconds');
    };

    checkSupabase();

    return () => {
      isMountedRef.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await window.supabase.auth.signOut();
        setSession(null);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            <img src="img/nav-logo.png" alt="logo" className="navbar-logo" />
            Adopt a Pet
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Services
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
            <li>
              <a href="#adoption" className="page-scroll">
                Adopt
              </a>
            </li>
            <li>
              <a href="#rescue-donate-section" className="page-scroll">
                Rescue & Donate
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            <li>
              {session && session.user ? (
                <div className="nav-account">
                  <div className="nav-account-email" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <i className="fa fa-user" style={{ fontSize: "18px", color: "white" }}></i>
                    <span className="nav-account-email-text" style={{fontWeight: 500, fontSize: "14px", color: "white" }}>
                      {session.user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="nav-account-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a href="/login.html" title="Login/Register" className="nav-account" style={{display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none'}}>
                  <i className="fa fa-user" style={{ fontSize: "22px", color: "white" }}></i>
                  <span style={{fontWeight: 500, fontSize: "15px", color: "white"}}>Login/Register</span>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
