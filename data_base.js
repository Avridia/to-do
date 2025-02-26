// este fichero solo interactua de manera puntal con la base de datos. Es un subsistema que tenemos para conectarnos a la base de datos

import postgres from "postgres";
import dotenv from "dotenv"; 
dotenv.config();

function conectar(){ // esta funcion sirve solo para conectarse a la base de datos
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

export function leerTareas(){
    return new Promise((fulfill,reject) => { // retornamos una promesa para que la funcion sea asincrona
        const conexion = conectar(); // podemos llamar directamente a la funcion sin constante pero no es practico porque no la podremos cortar al no tener ninguna referencia a ella

        conexion`SELECT * FROM tareas ORDER BY id` // lee todas las entradas de colores. Esto retorna una promesa
        .then( tareas  => { // si llegué hasta aqui significa que ya he conseguido mis colores, sino hubiese entrado por catch
            conexion.end();
            fulfill(tareas);
        })
        .catch( error => {
            conexion.end(); // se puede usar en lugar de este linea y de la 21, un finally pero es de uso hacerlo asi en estos casos
            reject({ error : "error en base de datos" }); // esto solo es un mensaje para el usuario
        });
    });
}

/*
leerTareas()
.then(x => console.log(x))
.catch(x => console.log(x))
*/

export function crearTarea(texto){ 
    return new Promise((fulfill,reject) => {
        const conexion = conectar(); 

        conexion`INSERT INTO tareas (texto) VALUES (${texto}) RETURNING id` 
        .then( ([{id}]) => {  // el argumento sin parentesis retorna un array que tiene por dentro un objeto y dentro tiene un ID. Aqui queremos desestructurarlo para recibir solo el id en fulfill
            conexion.end();
            fulfill(id);
        })
        .catch( error => {
            conexion.end(); 
            reject({ error : "error en base de datos" }); 
        });
    });
};

export function editarTarea(texto,id){ 
    return new Promise((fulfill,reject) => {
        const conexion = conectar(); 

        conexion`UPDATE tareas SET texto = ${texto} WHERE id = ${id}` 
        .then( ({count}) => {  // el argumento sin parentesis retorna un array que tiene por dentro un objeto y dentro tiene un ID. Aqui queremos desestructurarlo para recibir solo el id en fulfill
            conexion.end();
            fulfill(count);
        })
        .catch( error => {
            console.log(error);
            conexion.end(); 
            reject({ error : "error en base de datos" }); 
        });
    });
};

/*
editarTarea("disfrazarme",4)
.then(x => console.log(x))
.catch(x => console.log(x))
*/

export function borrarTarea(id){ 
    return new Promise((fulfill,reject) => {
        const conexion = conectar(); 

        conexion`DELETE FROM tareas WHERE id = ${id}` 
        .then( ({count}) => {  // aqui recibe un objeto que es un 1 o un 0
            conexion.end();
            fulfill(count);
        })
        .catch( error => {
            conexion.end(); 
            reject({ error : "error en base de datos" }); 
        });
    });
}


export function editarEstado(id){ 
    return new Promise((fulfill,reject) => {
        const conexion = conectar(); 

        conexion`UPDATE tareas SET estado = NOT estado WHERE id = ${id}` // esto es como un toggle para el estado
        .then( ({count}) => {  // aqui recibe un objeto que es un 1 o un 0
            conexion.end();
            fulfill(count);
        })
        .catch( error => {
            conexion.end(); 
            reject({ error : "error en base de datos" }); 
        });
    });
}

