/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {
    development: {
        client: 'sqlite3',
        connection: { filename: "./db/ecommerce.sqlite"},
        useNullAsDefault: true
      },
      useNullAsDefault: true

}