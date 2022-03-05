const {development} = require('../mysql')
const knex = require('knex')(development);

knex.from("productos")
.where("price", ">", 100)
.del()
.then( rows => {
    console.log("updated", rows);
})
.catch(err => {
    console.log("ocurrio un error", err)
    throw err;
}).finally(()=>{
    knex.destroy();
})