// Supabase Configuration
const SUPABASE_URL = 'https://lsmilspxymyppnwtybso.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_I-cq5ZzXIfvPqSUn83X50w_DPPAvk7h';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    const signupFullnameInput = document.getElementById('signup-fullname');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const signupErrorDiv = document.getElementById('signup-error');

    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorDiv = document.getElementById('login-error');

    // 1. Check if user is already logged in
    const checkUser = async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) window.location.href = 'index.html';
    };
    checkUser();

    // 2. Signup (Sends OTP)
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupErrorDiv.textContent = '';

            const fullname = signupFullnameInput.value.trim();
            const email = signupEmailInput.value.trim();
            const password = signupPasswordInput.value;
            const confirmPassword = signupConfirmPasswordInput.value;

            if (password !== confirmPassword) {
                signupErrorDiv.textContent = 'Passwords do not match.';
                return;
            }

            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullname
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

            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value;

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                window.location.href = 'index.html';

            } catch (error) {
                console.error('Login error:', error);
                loginErrorDiv.textContent = error.message;
            }
        });
    }
});
