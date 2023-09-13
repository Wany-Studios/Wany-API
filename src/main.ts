import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import environment from './environment';
import cookieParser = require('cookie-parser');
import session = require('express-session');
import sessionFileStore = require('session-file-store');
import helmet from 'helmet';

const FileStore = sessionFileStore(session);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
        origin: environment.isDevelopment ? '*' : environment.client.url,
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.use(
        session({
            secret: environment.secret,
            resave: false,
            store:
                !environment.isDevelopment && !environment.isTesting
                    ? new FileStore()
                    : undefined,
            saveUninitialized: false,
            name: 'wany',
            cookie: {
                sameSite: 'strict',
                secure: environment.secure,
                maxAge: 1_000 * 60 * 60 * 24, // one day
                httpOnly: true,
            },
        }),
    );
    // app.use(helmet());

    if (environment.isDevelopment) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const killPort = require('kill-port');
        await killPort(environment.server.port).catch(console.log);
    }

    const config = new DocumentBuilder()
        .setTitle('Wany API')
        .setDescription('The wany.com.br website API')
        .setVersion('1.0')
        .addTag('auth', 'authentication and verification endpoints')
        .addTag('user', 'user endpoints')
        .build();

    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

    await app.listen(environment.server.port, environment.server.host, () => {
        console.log(`Server has started on port ${environment.server.port}.`);
    });
}
bootstrap();
