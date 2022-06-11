const assert = require("chai").assert;
const expect = require("chai").expect;
const should = require("chai").should;
const server = require("./server")
const request = require("supertest")

before(() => {
    console.log("Inicio tests")
})


describe("Pruebo API de mensajes ", function () {

    it("Testeando response ok para messages", (done) => {
        request(server).get("/api/productos")
            .set('accept', 'application/json')
            .expect("Content-Type", /json/)
            .expect(200, done);
    });


    it("Testeando Producto existente", async () => {
        const respuesta = await request(server).get('/api/productos/2');
        const msg1 = respuesta.body
        expect('Calculadora', msg1.title);
        expect(2, msg1.id);
    });

    /**
     * 
     * {"id":1,"title":"Escuadra","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png","price":123.45}
    */


    it("Testeando Producto inexistente", async () => {
        const respuesta = await request(server).get('/api/productos/1')
            .expect(404);
        const msg1 = respuesta.body
        expect('producto no encontrado', msg1.error);
        // expect(2, msg1.id); 
    });


    it("Testeando Crear Producto", async () => {
        const obj = {"title":"Escuadra","thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png","price":123.45}
        const respuesta = await request(server).post('/api/productos').send(obj)
            .expect(200);
       //const respuesta = await request(server).get('/api/productos/2');

        const nuevo = respuesta.body
        expect('Escuadra', nuevo.title);
        //checkeo id con expect
        expect(nuevo.id).to.not.be.null;
        // //checkeo id nuevo con assert
         assert(nuevo.id);
         assert.notEqual(nuevo.id, null);
        // expect(2, msg1.id); 
    });

})