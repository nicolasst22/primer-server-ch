const {development} = require('../mysql')
const knex = require('knex')(development);
const productos = [
    {
    "title": "Escuadra",
    "price": 123.45,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    "id": 1
    },
    {
    "title": "Calculadora",
    "price": 234.56,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    "id": 2
    },
    {
    "title": "Globo Terráqueo",
    "price": 345.67,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
    "id": 3
    }
    ]

 


    const seed = async () => {
       return knex('productos').insert(productos)
        .then(()=>{
            console.log("se crearon productos");
        })
        .catch(err => {
            console.log("ocurrio un error", err)
            throw err;
        }).finally(()=>{
            knex.destroy();
        })
    }
    
    module.exports = seed;