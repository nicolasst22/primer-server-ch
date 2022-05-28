const { development } = require('../config/sqlite')
const knex = require('knex')(development);
const createTable = require("../db/utils/createTable");
const seedProductos = require("../db/utils/insertProductos");
const logger = require("../config/logger");

const productos = {}

productos.getAll = () => {
    return (async () => {
        const a = await knex.from('productos');
        return a;
    })();
}

productos.deleteById = async (id) => {
    await knex.from("productos").where({ id: id }).del();
}

productos.deleteAll = async () => {
    await knex.from("productos").del();
}

productos.getById = async = (id) => {
    return (async () => {
        const a = await knex.from("productos").where({ id: id }).first().then((row) => row)
        return a;
    })()
}

productos.save = async (objeto) => {
    if (objeto.id) {
        const obj = await knex("productos")
            .update(objeto)
            .where({ id: objeto.id })
            .then(rows => {
                // the argument here as you stated
                // describes the number of rows updated
                // therefore if no row found no row will be updated
                if (!rows) {
                    throw Error("error al insertar")
                }
                return objeto;
            })
        return obj;
    } else {
        const id = await knex('productos').insert(objeto).returning("make_id");
        return { ...objeto, id: id[0] };
    }

}

knex("productos").count('id as CNT').then(() => {
    //intentanmos porque si da error creamos y poblamos
}).catch(async (ee) => {
    const { development: config } = require('../db/sqlite')
    // config.connection.database = null;
    // const knex2 = require('knex')(config);
    // await knex2.raw('CREATE DATABASE ecommerce');
    logger.info("no existe la base")
    await createTable();
    await seedProductos();
})



module.exports = productos;


