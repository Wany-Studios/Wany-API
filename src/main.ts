import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import environment from './environment';
import cookieParser = require('cookie-parser');
import session = require("express-session");
import passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: environment.isDevelopment ? '*' : environment.client.url,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(session({
    secret: environment.secret,
    resave: false,
    saveUninitialized: false,
    name: 'wany-delt4d',
    // store: new fileStore(),
    cookie: {
      sameSite: 'strict',
      secure: environment.secure,
      maxAge: 1_000 * 60 * 60 * 24, // one day
      httpOnly: true,
    },
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  if (environment.isDevelopment) {
    const killPort = require('kill-port');
    await killPort(environment.server.port).catch(console.log);
  }

  await app.listen(environment.server.port, environment.server.host, () => {
    console.log(`Server has started on port ${environment.server.port}.`);
  });
}
bootstrap();
