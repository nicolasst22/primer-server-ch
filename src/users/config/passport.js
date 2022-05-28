const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const Usuario = require('../../models/user');
const usuarioServices = require("../services")
const bcrypt = require("bcrypt");
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require("../../config")
const logger = require("../../config/logger")


passport.use("login", new LocalPassport({ passReqToCallback: true }, (req, username, password, done) => {
    Usuario.findOne({ email: username }, (err, usuario) => {
        if (err) {
            return done(err);
        }
        if (!usuario) {
            logger.info("no usuario");
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
        if (!bcrypt.compareSync(password, usuario.password)) {
            logger.info("no pass");
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
        req.session.username = usuario.nombre;
        req.session.email = usuario.email;
        return done(null, usuario);
    });
}));

passport.use("register", new LocalPassport({ passReqToCallback: true },async (req,username, password, done) => {
    const {nombre, apellido} = req.body;
    await usuarioServices.registrar(nombre, apellido, username, password, (err, usuario) => {
        if(err){
            req.session.messages = [err]
            done(err)
        }else{
            req.session.username = nombre;
            eq.session.email = username;
            done(null, usuario);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${config.APP_URL}/auth/facebook/callback`,
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