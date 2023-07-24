import { Request } from 'express';
import { getBaseUrl } from './get-base-url.helper';

export function getRoutes(req: Request) {
    const baseUrl = getBaseUrl(req);

    return {
        login_url: baseUrl + '/auth/signin',
        signup_url: baseUrl + '/auth/signup',
        logout_url: baseUrl + '/auth/logout',
        reset_password_url: baseUrl + '/auth/reset-password',
        forgot_password_url: baseUrl + '/auth/forgot-password',
        verify_email_url: baseUrl + '/auth/email/verification',
        current_user_url: baseUrl + '/user/me',
        user_url: baseUrl + '/user/public/{username}',
        upload_avatar: baseUrl + 'user/upload-avatar',
    };
}
