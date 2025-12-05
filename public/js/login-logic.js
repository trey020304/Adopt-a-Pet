document.addEventListener('DOMContentLoaded', () => {
    // Select the form and inputs based on their IDs and classes
    const loginForm = document.querySelector('form');
    // NOTE: Your HTML uses 'username' ID for the Email field. We will use that ID.
    const emailInput = document.getElementById('username'); 
    const passwordInput = document.getElementById('password');
    const loginButton = loginForm.querySelector('.btn-login');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the default form submission/page reload
            
            const email = emailInput.value;
            const password = passwordInput.value;

            loginButton.disabled = true;
            const originalButtonText = loginButton.textContent;
            loginButton.textContent = 'Logging In...';
            
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Login failed: ' + error.message);
                console.error(error);
            } else {
                alert('Login successful! Redirecting...');
                // Redirect to the main application page upon success
                window.location.href = 'index.html'; 
            }

            loginButton.disabled = false;
            loginButton.textContent = originalButtonText;
        });
    }
});