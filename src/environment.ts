import { config } from 'dotenv-flow';
import * as path from 'path';

const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';
const isTesting = process.env.NODE_ENV === 'test';

if (isDevelopment) {
    config();
}

const environment = Object.freeze({
    secret: process.env.SECRET as string,
    secure: process.env.SECURE === 'true',
    log: true,
    server: {
        host: '0.0.0.0',
        port: 3000,
        secure: process.env.HTTPS === 'true',
        url: process.env.API_ENDPOINT as string,
        // entities: isTesting
        //     ? [__dirname + '/**/*.entity.js']
        //     : [__dirname + '/**/*.entity.ts'],
        entities: [
            path.join(__dirname, '/**/*.entity.js'),
            path.join(__dirname, '/**/*.entity.ts'),
        ],
        migrations: [
            path.join(__dirname, '/migrations/*.js'),
            path.join(__dirname, '/migrations/*.ts'),
        ],
    },
    database: {
        type: 'mysql',
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        name: process.env.DB_NAME as string,
        port: parseInt(process.env.DB_PORT as string),
        host: process.env.DB_HOST as string,
        synchronize:
            process.env.SYNC_DATABASE === 'true' || isDevelopment || isTesting
                ? true
                : false,
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
        service: process.env.MAIL_SERVICE,
    },
    upload: {
        gamesPath: path.join(__dirname, 'uploads', 'games'),
        avatarPath: path.join(__dirname, 'uploads', 'avatars'),
    },
    isDevelopment,
    isTesting,
});

if (isTesting) {
    environment.database.type = 'sqlite';
    environment.database.name = ':memory:';
}

export default environment;
