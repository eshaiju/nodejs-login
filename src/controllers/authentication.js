import jwt from 'jwt-simple';
import User from '../models/user';
import config from '../config';

const tokenForUser = user => {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export function signin(req, res, next) {
  res.json({ tocken: tokenForUser(req.user) });
}

export function signup(req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  User.findOne({email}, (error, existingUser) => {
    if(error) { return next(error); }

    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email,
      password
    });

    user.save( error => {
      if(error) { return next(error);}

      res.json({ tocken: tokenForUser(user) });
    });
  });
}
