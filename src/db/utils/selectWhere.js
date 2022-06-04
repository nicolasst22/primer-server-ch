const {development} = require('../mysql')
const knex = require('knex')(development);
const logger = require("../../config/logger");

knex.from("productos")
.select("title, price, thumbnail")
.where("price", ">", 100)
.then( rows => {
    logger.info("rows", rows);
    for (row of rows){
        logger.info(row);
    }
})
.catch(err => {
    logger.info("ocurrio un error", err)
    throw err;
}).finally(()=>{
    knex.destroy();
})