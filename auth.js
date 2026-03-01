document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    // 1. Check if user is already logged in (uses the global function from config.js)
    if (typeof checkAuthSession === 'function') {
        checkAuthSession(false);
    }

    const signupFullnameInput = document.getElementById('signup-fullname');
    const signupUsernameInput = document.getElementById('signup-username');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const signupErrorDiv = document.getElementById('signup-error');

    const loginIdentifierInput = document.getElementById('login-identifier');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorDiv = document.getElementById('login-error');

    // Helper: Simple email validation
    const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    // 2. Signup (Sends OTP)
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupErrorDiv.textContent = '';

            const fullname = signupFullnameInput.value.trim();
            const username = signupUsernameInput.value.trim().toLowerCase();
            const email = signupEmailInput.value.trim();
            const password = signupPasswordInput.value;
            const confirmPassword = signupConfirmPasswordInput.value;

            if (password !== confirmPassword) {
                signupErrorDiv.textContent = 'Passwords do not match.';
                return;
            }

            try {
                // Check if username is already taken in the profiles table
                const { data: existingUser, error: checkError } = await supabaseClient
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (existingUser) {
                    signupErrorDiv.textContent = 'Username is already taken. Please choose another.';
                    return;
                }

                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullname,
                            username: username
                        }
                    }
                });

                if (error) throw error;

                // After successful signup, redirect to verify.html and pass email in the URL
                alert('OTP Sent! Please check your email.');
                window.location.href = `verify.html?email=${encodeURIComponent(email)}`;

            } catch (error) {
                console.error('Signup error:', error);
                signupErrorDiv.textContent = error.message;
            }
        });
    }

    // 3. Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginErrorDiv.textContent = '';

            const identifier = loginIdentifierInput.value.trim();
            const password = loginPasswordInput.value;

            try {
                let emailToLogin = identifier;

                // If identifier is not an email, it's a username
                if (!isEmail(identifier)) {
                    // Find the user's email from the profiles table using their username
                    const { data, error } = await supabaseClient
                        .from('profiles')
                        .select('email')
                        .eq('username', identifier.toLowerCase())
                        .single();
                    
                    if (error || !data) {
                        throw new Error('Username not found.');
                    }
                    emailToLogin = data.email;
                }

                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: emailToLogin,
                    password: password
                });

                if (error) throw error;
                window.location.href = 'index.html';

            } catch (error) {
                console.error('Login error:', error);
                loginErrorDiv.textContent = error.message || 'Invalid login details.';
            }
        });
    }
});
