const axios = require('axios');

(async () =>{
    const rp1 = await axios.get("http://localhost:8080/api/productos/2")
    const p1 = rp1.data
    
     console.log("get", p1)
     const pEditado = await axios.put("http://localhost:8080/api/productos/2", 
     {...p1, title: p1.title+" Editado"}
     )
     console.log("put", pEditado.data)
     await axios.put("http://localhost:8080/api/productos/2", 
     {...p1, title: p1.title}
     )

    const nuevo = await axios.post("http://localhost:8080/api/productos", 
    {...p1, id:null, title: "Nuevo axios"}
    )
    console.log("post", nuevo.data)

   const del = await axios.delete(`http://localhost:8080/api/productos/${nuevo.data.id}`)
   console.log("delete", del.data)

    // const m1 = await axios.get("http://localhost:8080/api/messages/1")
    // console.log(m1.data.text)
})();