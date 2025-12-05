// Session handling and logout logic for Supabase

document.addEventListener('DOMContentLoaded', async () => {
    // Check session and update UI
    const userArea = document.createElement('div');
    userArea.id = 'user-area';
    userArea.style.position = 'absolute';
    userArea.style.top = '20px';
    userArea.style.right = '20px';
    userArea.style.zIndex = '9999';
    document.body.appendChild(userArea);

    async function updateUserArea() {
        const { data: { session } } = await supabase.auth.getSession();
        userArea.innerHTML = '';
        if (session && session.user) {
            const email = session.user.email;
            userArea.innerHTML = `
                <div style="text-align:right;">
                    <span style="font-weight:bold;">${email}</span><br>
                    <button id="logout-btn" style="font-size:12px;">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').onclick = async () => {
                if (confirm('Are you sure you want to logout?')) {
                    await supabase.auth.signOut();
                    window.location.href = 'index.html';
                }
            };
        } else {
            userArea.innerHTML = `
                <a href="login.html">Login</a> / <a href="register.html">Register</a>
            `;
        }
    }

    await updateUserArea();
    // Optionally, listen for auth changes
    supabase.auth.onAuthStateChange(updateUserArea);
});
