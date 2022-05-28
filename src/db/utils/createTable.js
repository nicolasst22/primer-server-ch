const { development } = require('../../config/sqlite')
const knex = require('knex')(development);
const logger = require("../../config/logger")

/**
 * Se crea una nueva tabla con la funcion createTable()
 * el esquema knex.js. Definimos el esquema para que contenga 3 columnas
 * id, nombre, precio
 * 
 */
//"title":,"price":346,"thumbnail":,"id":11
const createTable = async () => {
    return knex.schema.createTable("productos", table => {
        table.increments('id');
        table.string('title');
        table.string('thumbnail');
        table.decimal("price", 8, 2)
    }).then(() => {
        logger.info("tabla creada")
    }).catch(err => {
        logger.info("ocurrio un error", err)
        throw err;
    }).finally(() => {
        knex.destroy();
    })
}

module.exports = createTable;