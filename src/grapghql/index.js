const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require("graphql");
const Productos = require('../productos/index');

const schema = buildSchema(`
    type Producto {
        id: ID!
        nombre: String,
        precio: Float,
        foto: String
    }

    input ProductoInput {
        nombre: String,
        precio: Float,
        foto: String
    }

    type Query {
        getProducto(id: ID!): Producto,
        getProductos(campo: String, valor: String): [Producto]
    }

    type Mutation {
        createProducto(datos: ProductoInput): Producto,
        updateProducto(id: ID!, datos: ProductoInput): Producto,
        deleteProducto(id: ID!): Producto
    }
`);

const getProductos = async ({ campo, valor }) => {
    const products = await Productos.getBy(campo, valor);
    return products;
}

const getProducto = async ({ id }) => {
    const product = await Productos.getById(id);
    return product
}

const updateProducto = async ({ id, datos }) => {
    const product = await Productos.save({ ...datos, id: id });
    return product
}

const createProducto = async ({ datos }) => {
    const product = await Productos.save({ ...datos });
    return product
}

const deleteProducto = async ({ id }) => {
    if (id) {
        return await Productos.deleteById(id)
    }
    return { message: "Not found" }
}


module.exports = graphqlHTTP({
    schema: schema,
    rootValue: {
        getProductos,
        getProducto,
        createProducto,
        updateProducto,
        deleteProducto
    },
    graphiql: true
})
