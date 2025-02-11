import dotenv from "dotenv"; // .env es un fichero donde puedo crear variables de entorno
dotenv.config();
import express from "express";

const servidor = express();

if(process.env.PRUEBAS){
    servidor.use("/pruebas",express.static("/pruebas")); // si existe una variable de entorno PRUEBAS en el fichero .env, entonces el servidor leera un fichero estatico llamado pruebas al entrar en /pruebas
}

servidor.get("/tareas", (peticion,respuesta) => {
    respuesta.send("GET /tareas");
})

servidor.post("/tareas/nueva", (peticion,respuesta) => {
    respuesta.send("POST /tareas/nueva");
})

servidor.delete("/tareas/borrar/:id", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/borrar/:id");
})

servidor.put("/tareas/editar/texto/:id", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/editar/texto/:id");
})

servidor.put("/tareas/editar/estado/:id", (peticion,respuesta) => {
    respuesta.send("DELETE /tareas/editar/estado/:id");
})


servidor.listen(process.env.PORT); // lee el puerto que esté configurado en el entorno -> en el documento .env