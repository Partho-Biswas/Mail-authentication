document.addEventListener('DOMContentLoaded', async () => {
    const verifyForm = document.getElementById('verify-form');
    const otpCodeInput = document.getElementById('otp-code');
    const verifyErrorDiv = document.getElementById('verify-error');
    const resendBtn = document.getElementById('resend-otp-btn');

    // 1. Get email from the URL (e.g., verify.html?email=user@example.com)
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    if (!email) {
        window.location.href = 'auth.html';
        return;
    }

    // 2. Handle OTP Verification
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            verifyErrorDiv.textContent = '';
            
            const token = otpCodeInput.value.trim();

            // Updated check for 8-digit OTP
            if (token.length !== 8) {
                verifyErrorDiv.textContent = 'Please enter an 8-digit code.';
                return;
            }

            try {
                // Verify the OTP using Supabase
                const { data, error } = await supabaseClient.auth.verifyOtp({
                    email,
                    token,
                    type: 'signup'
                });

                if (error) throw error;

                // Success! User is now confirmed and logged in
                alert('Email verified successfully!');
                window.location.href = 'index.html';

            } catch (error) {
                console.error('Verification error:', error);
                verifyErrorDiv.textContent = error.message;
            }
        });
    }

    // 3. Handle OTP Resend
    if (resendBtn) {
        resendBtn.addEventListener('click', async () => {
            resendBtn.disabled = true;
            resendBtn.textContent = 'Resending code...';
            verifyErrorDiv.textContent = '';

            try {
                const { data, error } = await supabaseClient.auth.resend({
                    type: 'signup',
                    email: email
                });

                if (error) throw error;
                alert('A new OTP code has been sent to your email.');

            } catch (error) {
                console.error('Resend error:', error);
                verifyErrorDiv.textContent = 'Failed to resend code: ' + error.message;
            } finally {
                resendBtn.disabled = false;
                resendBtn.textContent = "Didn't receive code? Resend OTP";
            }
        });
    }
});
