import { redisClient, RedisStore, session } from '../modules/redis';

export const configSession = (app, passport) => {
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      name: `connect.sid.${process.env.NODE_ENV}`,
      cookie: {
        // secure: process.env.NODE_ENV === 'production', // TODO: Fix
        httpOnly: true,
        domain: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? '.wimet.co' : undefined,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.deserializeUser((user: { id: number }, done) => {
    done(null, user);
  });
};
