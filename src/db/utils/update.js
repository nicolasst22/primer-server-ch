const {development} = require('../mysql')
const knex = require('knex')(development);
const logger = require("../../config/logger");

knex.from("productos")
.where("price", ">", 100)
.update({price: 500})
.then( rows => {
    logger.info("updated", rows);
})
.catch(err => {
    logger.info("ocurrio un error", err)
    throw err;
}).finally(()=>{
    knex.destroy();
})