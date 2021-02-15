import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import PracUser from "../graphql/model/PracUser";

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require(`passport-jwt`).ExtractJwt;

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
opts.issuer = `accounts.examplesoft.com`;
opts.audience = `http://localhost:3000/#/`;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    PracUser.findOne({ id: jwt_payload.sub }, function (e, user) {
      if (e) {
        return done(e, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
