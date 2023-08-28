export function getRoutes() {
    return {
        avatar_url: 'public/{username}/avatar',
        current_user_url: 'user/me',
        forgot_password_url: 'auth/forgot-password',
        login_url: 'auth/signin',
        logout_url: 'auth/logout',
        reset_password_url: 'auth/reset-password',
        signup_url: 'auth/signup',
        user_url: 'user/public/{username}',
        upload_avatar_url: 'user/upload-avatar',
        verify_email_url: 'auth/email/verification?token={token}',
    };
}
