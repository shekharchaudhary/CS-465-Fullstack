const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const lookupEmail = String(email || '').toLowerCase();
      const user = await User.findOne({ email: lookupEmail }).exec();
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
