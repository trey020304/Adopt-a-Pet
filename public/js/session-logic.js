// Session handling and logout logic for non-React pages
// This file is for static HTML pages that don't use React
// React pages use the Navigation component instead

document.addEventListener('DOMContentLoaded', async () => {
    // Only run on non-React pages (pages without #root)
    if (document.getElementById('root')) {
        return; // Skip on React pages
    }

    async function updateUserArea() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && session.user) {
                const email = session.user.email;
                
                // Find the Login/Register link and replace it
                const navLinks = document.querySelectorAll('.navbar-nav li a[href="/login.html"]');
                navLinks.forEach(link => {
                    const li = link.parentElement;
                    li.innerHTML = `
                            <div class="nav-account">
                                <div class="nav-account-email" style="display: flex; align-items: center; gap: 8px;">
                                    <i class="fa fa-user" style="font-size: 18px; color: white;"></i>
                                    <span class="nav-account-email-text" style="font-weight: 500; font-size: 14px; color: white;">${email}</span>
                                </div>
                                <button type="button" id="logout-link" class="nav-account-logout">Logout</button>
                            </div>
                        `;

                        // Add logout handler
                        const logoutLink = li.querySelector('#logout-link');
                        if (logoutLink) {
                            logoutLink.onclick = async (e) => {
                                e.preventDefault();
                                if (confirm('Are you sure you want to logout?')) {
                                    await supabase.auth.signOut();
                                    window.location.href = 'index.html';
                                }
                            };
                            logoutLink.onmouseover = () => { logoutLink.style.textDecoration = 'underline'; };
                            logoutLink.onmouseout = () => { logoutLink.style.textDecoration = 'none'; };
                        }
                });
            }
        } catch (err) {
            console.error('Error updating user area:', err);
        }
    }

    await updateUserArea();
    
    // Listen for auth changes and update UI when session changes
    supabase.auth.onAuthStateChange((event, session) => {
        updateUserArea();
    });
});

