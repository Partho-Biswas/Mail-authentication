document.addEventListener('DOMContentLoaded', () => {
    const updatePasswordForm = document.getElementById('update-password-form');
    const resetTokenInput = document.getElementById('reset-token');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const updateErrorDiv = document.getElementById('update-error');

    // 1. Get email from the URL (e.g., update-password.html?email=user@example.com)
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    if (!email) {
        window.location.href = 'auth.html';
        return;
    }

    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            updateErrorDiv.textContent = '';
            
            const token = resetTokenInput.value.trim();
            const password = newPasswordInput.value;
            const confirmPassword = confirmNewPasswordInput.value;

            if (password !== confirmPassword) {
                updateErrorDiv.textContent = 'Passwords do not match.';
                return;
            }

            if (password.length < 6) {
                updateErrorDiv.textContent = 'Password must be at least 6 characters.';
                return;
            }

            try {
                // Step 2: Verify the OTP for recovery
                const { data: verifyData, error: verifyError } = await supabaseClient.auth.verifyOtp({
                    email,
                    token,
                    type: 'recovery' // 'recovery' for password resets
                });

                if (verifyError) throw verifyError;

                // Step 3: Successfully verified, now update the password
                const { data: updateData, error: updateError } = await supabaseClient.auth.updateUser({
                    password: password
                });

                if (updateError) throw updateError;

                // Success! User is now confirmed and logged in
                alert('Password reset successfully! Redirecting you to the home page.');
                window.location.href = 'index.html';

            } catch (error) {
                console.error('Update error:', error);
                updateErrorDiv.textContent = error.message;
            }
        });
    }
});
