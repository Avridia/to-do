import dotenv from "dotenv"; // .env es un fichero donde puedo crear variables de entorno
dotenv.config();
import express from "express";
import {leerTareas,crearTarea,editarTarea,borrarTarea,editarEstado} from "./data_base.js"

const servidor = express();

if(process.env.PRUEBAS){
    servidor.use("/pruebas",express.static("./pruebas")); // si existe una variable de entorno PRUEBAS en el fichero .env, entonces el servidor leera un fichero estatico llamado pruebas al entrar en /pruebas
}

servidor.get("/tareas", async (peticion,respuesta) => {
    try{
        let tareas = await leerTareas();
        respuesta.json(tareas);
    }catch(error){
        console.log(error);
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" }); 
    }
})

// para poder probar si funcionan post, delete, y put, hay que usar fetch desde index.html en pruebas. Y la URL que se prueba en el navegador es /pruebas. El resultado aparece en la consola

servidor.post("/tareas/nueva", (peticion,respuesta) => {
    respuesta.send("POST /tareas/nueva");
})

servidor.delete("/tareas/borrar/:id([0-9]+)", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/borrar/:id");
})

servidor.put("/tareas/editar/texto/:id([0-9]+)", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/editar/texto/:id");
})

servidor.put("/tareas/editar/estado/:id([0-9]+)", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/editar/estado/:id");
})

servidor.use((peticion,respuesta) => { // si llego aqui significa que ninguna de las opciones anteriores encaja
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});


servidor.listen(process.env.PORT); // lee el puerto que esté configurado en el entorno -> en el documento .env