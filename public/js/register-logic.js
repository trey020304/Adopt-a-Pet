document.addEventListener('DOMContentLoaded', () => {
    // Select the form and inputs based on their IDs and classes
    const registerForm = document.querySelector('form');
    // NOTE: Your HTML uses 'username' ID for the Email field. We will use that ID.
    const emailInput = document.getElementById('username'); 
    const passwordInput = document.getElementById('password');
    const registerButton = registerForm.querySelector('.btn-login');
    
    // Add event listener to the form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the default form submission/page reload
            
            const email = emailInput.value;
            const password = passwordInput.value;

            registerButton.disabled = true;
            const originalButtonText = registerButton.textContent;
            registerButton.textContent = 'Registering...';

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                alert('Registration failed: ' + error.message);
                console.error(error);
            } else {
                // Insert user into 'users' table
                if (data.user) {
                    await supabase.from('users').insert([
                        {
                            id: data.user.id,
                            email: data.user.email
                        }
                    ]);
                }
                if (data.user && data.user.aud === 'authenticated') {
                    // Success, with instant login (if email confirmation is OFF)
                    alert('Registration successful! Logging you in...');
                    window.location.href = 'index.html';
                } else {
                    // Success, but email confirmation is required (default Supabase behavior)
                    alert('Registration successful! Please check your email to verify and then log in.');
                    window.location.href = 'login.html';
                }
            }

            registerButton.disabled = false;
            registerButton.textContent = originalButtonText;
        });
    }
});