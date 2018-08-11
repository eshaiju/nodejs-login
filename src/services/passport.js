import passport from 'passport';
import User from '../models/user';
import config from '../config';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {

  User.findOne( { email }, (error, user) => {
    if(error) { return next(error); }

    if(!user) { return next(null, false); }

    user.comparePassword(password, (error, isMatch) => {
      if(error) { return done(error); }

      if(!isMatch) { return done(null, false); }

      return done(null, user);

    });
  })
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

  User.findById(payload.sub, (error, user) => {
    if(error) { return done(error); }

    user ? done(null, user) : done(null, false)
  });

});

passport.use(jwtLogin);
passport.use(localLogin);
