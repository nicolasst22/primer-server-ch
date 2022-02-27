const { development } = require('../db/sqlite')
const knex = require('knex')(development);


exports.init = async () => {
    try {
        await knex.schema.createTable("messages", table => {
            table.increments('id');
            table.string('email');
            table.datetime("fecha",options={useTz: true, precision: 6})
            table.string("message")
        }).then(() => {
            console.log("tabla sqlite creada")
        }).catch(err => {
            console.log("ocurrio un error", err)
            throw err;
        }).finally(() => {
           // knex.destroy();
        })
    } catch (err) {

    }
}

exports.getMessages = async () => {
    return knex.from("messages");
}

exports.saveMessage = async (msg) => {
    console.log("guardar");
    const id = await knex('messages').insert(msg).returning("make_id");
    return { ...msg, id: id[0] };
}


