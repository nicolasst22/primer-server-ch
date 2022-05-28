/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const logger = require("../../config/logger");

exports.up = function (knex) {
    knex.schema.createTable("productos", table => {
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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('productos');
};
