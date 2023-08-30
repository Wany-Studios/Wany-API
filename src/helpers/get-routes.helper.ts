import environment from '../environment';

export function getRoutes() {
    const _ = (path: string) => new URL(environment.server.url, path).href;

    return {
        avatar_url: _('public/{username}/avatar'),
        current_user_url: _('user/me'),
        forgot_password_url: _('auth/forgot-password'),
        login_url: _('auth/signin'),
        logout_url: _('auth/logout'),
        reset_password_url: _('auth/reset-password'),
        signup_url: _('auth/signup'),
        user_url: _('user/public/{username}'),
        upload_avatar_url: _('user/upload-avatar'),
        verify_email_url: _('auth/email/verification?token={token}'),
    };
}
