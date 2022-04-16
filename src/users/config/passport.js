const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const Usuario = require('../user');
const usuarioServices = require("../services")
const bcrypt = require("bcrypt");
const FacebookStrategy = require('passport-facebook').Strategy;
require("dotenv")


passport.use("login", new LocalPassport({ passReqToCallback: true }, (req, username, password, done) => {
    Usuario.findOne({ email: username }, (err, usuario) => {
        if (err) {
            return done(err);
        }
        if (!usuario) {
            return done(null, false);
        }
        if (!bcrypt.compareSync(password, usuario.password)) {
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
        req.session.username = usuario.nombre;
        return done(null, usuario);
    });
}));

passport.use("register", new LocalPassport({ passReqToCallback: true },(req,username, password, done) => {
    const {nombre, apellido} = req.body;
    usuarioServices.registrar(nombre, apellido, username, password, (err, usuario) => {
        if(err){
            req.session.messages = [err]
            done(err)
        }else{
            req.session.username = nombre;
            done(null, usuario);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name'] //This
}, function (accessToken, refreshToken, profile, done) {
    const currentDate = new Date();
    const pass = "" + currentDate.getTime();
    usuarioServices.loginFB(profile.name.givenName,
        profile.name.familyName, profile.emails[0].value, pass, profile.id, done);
}
));

passport.serializeUser(function (user, cb) {
    cb(null, user._id || user.id);
});

passport.deserializeUser(function (id, cb) {
    Usuario.findById(id, (err, user) => {
        cb(err, user);
    });
});

module.exports = passport;