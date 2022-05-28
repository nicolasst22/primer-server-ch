const util = require('util')
const contenedor = require("../messages")
const {schema, normalize,denormalize} = require("normalizr");
const Author = new schema.Entity("authors")
const Message = new schema.Entity("message", {author: Author})
// const Messages = new schema.Entity("messages", {messages: [Message]});
const Messages = [Message];

// (async()=>{
//     const msgs1 = await mensaes.getAll();
//     const msgs  ={ id: 1, messages: msgs1 }
//     const n1 = normalize(msgs1, Messages);
//     const n = denormalize(n1.result, Messages, n1.entities)
// });


exports.getMessages = async (req, res) => {
    const msgs1 = await contenedor.getAll();
    const msgs  ={ id: 1, messages: msgs1 }
    const n = normalize(msgs1, Messages);
    
    res.json(n);
}

exports.getMessageById = async (req, res) => {
    const {id} = req.params
    const msg = await contenedor.getById(id);
    res.json(msg);
}

exports.saveMessage = async (req, res) => {
    const body = req.body;
    const {email} = req.session
    const msg = {
        text: body.message,
        fecha: new Date(),
        author: {
            id: email,
            nombre: body.nombre,
            apellido: body.apellido,
            edad: body.edad,
            alias:body.alias,
            avatar: body.avatar
        }
    }
    await contenedor.save(msg);
    res.redirect('/');
}


