const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const emailLc = String(email).toLowerCase();
    const exists = await User.findOne({ email: emailLc }).lean().exec();
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email: emailLc });
    user.setPassword(password);
    await user.save();
    const token = user.generateJWT();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(404).json(err);
    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    }
    return res.status(401).json(info);
  })(req, res);
};

module.exports = { register, login };
