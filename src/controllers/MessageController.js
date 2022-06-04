const util = require('util')
const Mensajes = require("../messages/index")
const { schema, normalize, denormalize } = require("normalizr");
const e = require('express');
const Author = new schema.Entity("authors")
const Message = new schema.Entity("message")
const logger = require("../config/logger")
// const Messages = new schema.Entity("messages", {messages: [Message]});
const Messages = [Message];

// (async()=>{
//     const msgs1 = await mensaes.getAll();
//     const msgs  ={ id: 1, messages: msgs1 }
//     const n1 = normalize(msgs1, Messages);
//     const n = denormalize(n1.result, Messages, n1.entities)
// });


exports.getMessages = async (req, res) => {
    const msgs1 = await Mensajes.getAll();
    //const msgs  ={ id: 1, messages: msgs1 }
    const n = normalize(msgs1, Messages);

    res.json(n);
}

exports.getMessageById = async (req, res, next) => {
    const { id } = req.params
    try {
        const msg = await Mensajes.getById(id);
        if (msg) {
            res.json(msg);
        } else {
            res.status(404).json({ status: 404, message: "Object not found" });
        }
    } catch (err) {
        if (err.name === "BSONTypeError") {
            res.status(400).json({ status: 400, message: err.message });
        }
        logger.error("error", ex)
        res.status(500).json({ status: 500, message: "Ha ocurrido un error!" });
    }
}

exports.saveMessage = async (req, res) => {
    const body = req.body;
    const { email } = req.session
    const msg = {
        text: body.message,
        fecha: new Date(),
        author: {
            id: email,
        }
    }
    await Mensajes.save(msg);
    res.redirect('/');
}


