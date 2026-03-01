document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetEmailInput = document.getElementById('reset-email');
    const resetErrorDiv = document.getElementById('reset-error');
    const resetSuccessDiv = document.getElementById('reset-success');

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resetErrorDiv.textContent = '';
            resetSuccessDiv.textContent = '';
            
            const email = resetEmailInput.value.trim();

            try {
                // Request a password reset OTP
                const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);

                if (error) throw error;

                // Success! Instruct the user to check their email and redirect them to update-password.html
                alert('Reset code sent! Redirecting you to the update page.');
                window.location.href = `update-password.html?email=${encodeURIComponent(email)}`;

            } catch (error) {
                console.error('Reset error:', error);
                resetErrorDiv.textContent = error.message;
            }
        });
    }
});
