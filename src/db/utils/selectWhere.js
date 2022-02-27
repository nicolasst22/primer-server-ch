const {development} = require('../mysql')
const knex = require('knex')(development);

knex.from("productos")
.select("title, price, thumbnail")
.where("price", ">", 100)
.then( rows => {
    console.log("rows", rows);
    for (row of rows){
        console.log(row);
    }
})
.catch(err => {
    console.log("ocurrio un error", err)
    throw err;
}).finally(()=>{
    knex.destroy();
})