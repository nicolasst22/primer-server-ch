const { development } = require('../config/sqlite')
const knex = require('knex')(development);
const createTable = require("../db/utils/createTable");
const seedProductos = require("../db/utils/insertProductos");


class ContenedorSQL {

    constructor() {
    }

    save = async (objeto) => {
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

    async getById(id) {
        return (async () => {
            const a = await knex.from("productos").where({ id: id }).first().then((row) => row)
            return a;
        })()
    }

    getAll() {
        return (async () => {
            const a = await knex.from('productos');
            return a;
        })()
    }

    async deleteById(id) {
        await knex.from("productos").where({ id: id }).del();
    }

    async deleteAll() {
        await knex.from("productos").del();
    }
}

knex("productos").count('id as CNT').then(()=>{
    //intentanmos porque si da error creamos y poblamos
}).catch(async (ee) =>{
    const { development: config} = require('../config/sqlite')
    await createTable();
    await seedProductos();
})

module.exports = {
    ContenedorMysql
};