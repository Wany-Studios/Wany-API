import environment from '../environment';

export function getRoutes() {
    const join = (path: string) => environment.server.url + path;

    return {
        avatar_url: join('user/public/{username}/avatar/'),
        current_user_url: join('user/me/'),
        update_user_url: join('user/me'),
        forgot_password_url: join('auth/forgot-password/'),
        login_url: join('auth/signin/'),
        logout_url: join('auth/logout/'),
        reset_password_url: join('auth/reset-password/'),
        send_verification_email_url: join('email/resend-verification-email'),
        signup_url: join('auth/signup/'),
        user_url: join('user/public/{username}/'),
        upload_avatar_url: join('user/upload-avatar/'),
        public_get_game_url: join('game/{id}/'),
        search_games_url: join('game/public'),
        verify_email_url: join('auth/email/verification/?token={token}'),
        public_game_url: join('public/games/{game-path}/'),
        create_game_url: join('game/create/'),
        delete_game_url: join('game/delete/{id}/'),
        add_game_image_url: join('game/{id}/images/'),
        remove_game_image_url: join('game/images/{game-image-id}'),
        public_game_image_url: join('game/public/images/{game-image-id}'),
        public_url: join('public/'),
    };
}
