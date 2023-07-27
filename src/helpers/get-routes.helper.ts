import { Request } from 'express';
import { getBaseUrl } from './get-base-url.helper';

export function getRoutes(req: Request) {
    const baseUrl = getBaseUrl(req);

    return {
        avatar_url: baseUrl + '/public/{username}/avatar',
        current_user_url: baseUrl + '/user/me',
        forgot_password_url: baseUrl + '/auth/forgot-password',
        login_url: baseUrl + '/auth/signin',
        logout_url: baseUrl + '/auth/logout',
        reset_password_url: baseUrl + '/auth/reset-password',
        signup_url: baseUrl + '/auth/signup',
        user_url: baseUrl + '/user/public/{username}',
        upload_avatar_url: baseUrl + '/user/upload-avatar',
        verify_email_url: baseUrl + '/auth/email/verification?token={token}',
    };
}
