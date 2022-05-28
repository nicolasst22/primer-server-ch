
const Usuario = require("../models/user");
const bcrypt = require("bcrypt");
const services = {};

services.findByEmail = (email) => {

}

services.registrar = async (nombre, apellido, email, password, done) => {
    Usuario.findOne({ email }, (err, usuario) => {
        if (err){
            return done(err.message);
        }
        if (usuario) {
            return done("Email ya está registrado");
        } else {
            Usuario.create({ nombre, apellido, email, password: bcrypt.hashSync(password, 1033) }, (err, newUsuario) => {
                if (err) {
                    done(err.message);
                }
                else {
                    done(null, newUsuario)
                }
            });
        }
    })
}

services.registrarOLD = (req, res, done) => {
    const { nombre, apellido, email, password } = req.body;
    Usuario.findOne({ email }, (err, usuario) => {
        if (err)
            done(err);

        if (usuario) {
            res.render('registro', { email: "Email ya está registrado" });
        } else {
            Usuario.create({ nombre, apellido, email, password: bcrypt.hashSync(password, 1033) }, (err, newUsuario) => {
                if (err) {
                    res.render('registro', { error: "Ha ocurrido un error inesperdado." });
                }
                else {
                    res.redirect('/');
                }
            });
        }
    })
}

services.loginFB = (nombre, apellido, email, password, facebookId, cb) => {
    Usuario.findOne({ email }, (err, usuario) => {
        if (err)
            cb(err)

        if (usuario) {
            usuario.facebookId = facebookId;
            usuario.save();
            cb(null, usuario);
        } else {
            Usuario.create({ nombre, apellido, email, password, facebookId }, (err, newUsuario) => {
                if (err) {
                    cb(err)
                }
                else {
                    cb(null, newUsuario);
                }
            });
        }
    })
}

module.exports = services;