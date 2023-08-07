import { config } from 'dotenv-flow';

const isDevelopment =
    (process.env.NODE_ENV || 'development') === 'production' ? false : true;

if (isDevelopment) {
    config();
}
export default Object.freeze({
    secret: process.env.SECRET as string,
    secure: process.env.SECURE === 'true',
    log: true,
    server: {
        host: '0.0.0.0',
        port: 3000,
        secure: process.env.HTTPS === 'true',
        entities: [__dirname + '/**/*.entity.js'],
    },
    database: {
        type: 'mysql',
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        name: process.env.DB_NAME as string,
        port: parseInt(process.env.DB_PORT as string),
        host: process.env.DB_HOST as string,
    },
    client: {
        url: process.env.CLIENT_URL as string,
        domain: 'site.local.com',
    },
    oAuth: {
        local: {
            usernameField: 'usernameOrEmail',
            passwordField: 'password',
        },
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: '/auth/google/callback',
        },
    },
    mail: {
        from: '"Equipe da Wany Studios" <wany-studios@email.com>',
        host: process.env.MAIL_AUTH_HOST as string,
        port: parseInt((process.env.MAIL_AUTH_PORT as string) || '0'),
        auth: {
            user: process.env.MAIL_AUTH_USER as string,
            pass: process.env.MAIL_AUTH_PASS as string,
        },
        service: 'gmail',
    },
    upload: {
        gamesPath: process.cwd() + '\\uploads\\games\\',
        avatarPath: process.cwd() + '\\uploads\\avatars\\',
    },
    isDevelopment,
});
