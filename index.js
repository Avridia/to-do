// este fichero es el del backend como tal, y se dedica a escuchar peticiones

import dotenv from "dotenv"; // .env es un fichero donde puedo crear variables de entorno
dotenv.config();
import express from "express";
import cors from "cors"; // cors es para autorizar todas las url, métodos y cabeceras acceder a nuestra API
import {leerTareas,crearTarea,editarTarea,borrarTarea,editarEstado} from "./data_base.js"

const servidor = express();

servidor.use(cors()); // cors pone tres cabeceras: dominio, metodo y cabecera. Y para cada uno de estas tres cabeceras define que se puede conectar cualquiera (cualquier dominio, cualquier metodo, etc)

servidor.use(express.json()); // verifica que el content-type de la peticion sea application/json, de ser asi extrae el cuerpo de la peticion, lo procesa como string y convierte a un objeto. Si falla se va al error 400. En el caso de que no falle o que el content-type sea diferente igualmente se crea el objecto.body y sigue su camino

if(process.env.PRUEBAS){
    servidor.use("/pruebas",express.static("./pruebas")); // si existe una variable de entorno PRUEBAS en el fichero .env, entonces el servidor leera un fichero estatico llamado pruebas al entrar en /pruebas
}


servidor.get("/tareas", async (peticion,respuesta) => {
    try{

        let tareas = await leerTareas(); // esto me va a dar todas mis tareas y si falla me saldra por el error

        respuesta.json(tareas);

    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" }); 
    }
})

// para poder probar si funcionan post, delete, y put, hay que usar fetch desde index.html en pruebas. Y la URL que se prueba en el navegador es /pruebas. El resultado aparece en la consola

servidor.post("/tareas/nueva", async (peticion,respuesta,funcionSiguiente) => {

    let {texto} = peticion.body; // texto va entre llaves porque se extrae tarea de peticion.body

    let valido = texto && texto.trim() != ""; // esta segunda parte es para comprobar que el campo texto no este vacio

    if(valido){
        try{

            let id = await crearTarea(texto);

            return respuesta.json({id});

        }catch(error){

            respuesta.status(500);

            respuesta.json({ error : "error en el servidor" });

        }
    }

    funcionSiguiente(true); // aqui como le estamos pasando un argumento se asume que hay un error y se va al middleware del error, el que tiene los 4 parametros
})

servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    try{

        let tareaBorrada = await borrarTarea(peticion.params.id);

        if(tareaBorrada == 1){
            respuesta.status(204);

            return respuesta.send("");
        }

        siguiente();


    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });

    }
})

servidor.put("/tareas/editar/texto/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    try{
        let {texto} = peticion.body; 
        
        let valido = texto && texto.trim() != "";

        if(valido){
            let textoEditado = await editarTarea(texto,peticion.params.id);

            respuesta.status(204);

            return respuesta.send("");
        }

        siguiente(true);


    }catch(error){
        console.log(error)

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });

    }

})

servidor.put("/tareas/editar/estado/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    try{

        let estadoEditado = await editarEstado(peticion.params.id);

        if(estadoEditado == 1){
            respuesta.status(204);

            return respuesta.send("");
        }

        siguiente();


    }catch(error){

        respuesta.status(500);

        respuesta.json({ error : "error en el servidor" });

    }

})

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la peticion" });
});

servidor.use((peticion,respuesta) => { // si llego aqui significa que ninguna de las opciones anteriores encaja. En si este middleware no es un error, simplemente es una opcion por si alguna peticion no encaja con nada, para que aterrice aqui 
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});


servidor.listen(process.env.PORT); // lee el puerto que esté configurado en el entorno -> en el documento .env