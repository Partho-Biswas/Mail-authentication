// Supabase Configuration
const SUPABASE_URL = 'https://lkrihehnmdczdorzfsmm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OQFuW_gIawSAZ8klFenYRA_-7QLPapj';

// Initialize Supabase Client
let supabaseClient;

try {
    if (typeof supabase === 'undefined') {
        throw new Error('Supabase library not loaded. Please check your internet connection or disable ad-blockers.');
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Configuration Error:', error.message);
    alert('Network Error: Unable to connect to authentication server. If you are using a VPN, ensure it is configured correctly.');
}

// Global helper to check session
async function checkAuthSession(redirectIfNoUser = true) {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user && window.location.pathname.includes('auth.html')) {
            window.location.href = 'index.html';
        } else if (!user && redirectIfNoUser && !window.location.pathname.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
        return user;
    } catch (e) {
        console.error('Session check failed:', e);
        return null;
    }
}
