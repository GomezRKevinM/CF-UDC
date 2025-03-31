import { createClient } from "@libsql/client";
import express from 'express';
import dotenv from 'dotenv'
import { createServer } from "http";
import { Consultas } from "./classes/Consultas.js";
import { ok } from "assert";

dotenv.config()

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await turso.execute(`CREATE TABLE IF NOT EXISTS compañeros(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT,
        number TEXT
    )`)

const port = 8080

const app = express()
app.use(express.json());

const server = createServer(app)

app.get("/",(req,res)=>{
    res.sendFile(process.cwd()+'/pages/index.html')
})

app.get("/register",(req,res)=>{
    res.sendFile(process.cwd()+"/pages/register.html")
})

app.get("/loginUser",(req,res)=>{
    res.sendFile(process.cwd()+"/pages/login.html")
})

app.get("/friend/:id", (req,res)=>{
    res.sendFile(process.cwd()+'/pages/friend.html');
})

app.get("/classfriends",async (req,res)=>{
    const compañeros = Consultas.Select("Normal","compañeros","*",0)
    const resultado = await turso.execute(compañeros)

    if (resultado.rows.length === 0) {
        return res.status(404).json({ message: "No se encontraron compañeros." });
    }

    return res.status(200).json(resultado.rows)
})

app.post("/new-user", async (req,res)=>{
    await turso.execute(`
        CREATE TABLE IF NOT EXISTS usuario(
        id TEXT,
        nombre TEXT,
        username TEXT,
        password TEXT
    )`)
    const usuario = req.body
    const exist = await turso.execute(Consultas.Select("Normal","compañeros","*",0))
    exist.rows.map((resultado)=>{
        if(resultado.id==usuario.id){
            return res.json({message:"Este usuario ya existe en la base de datos"})
        }
    })

    const request = await turso.execute({
        sql:'INSERT INTO usuario (id,nombre,username,password) VALUES (:id, :nombre, :username, :password)',
        args:{id:usuario.id, nombre:usuario.nombre, username: usuario.username, password:usuario.password}
    })

    if(request.rowsAffected>0){
        console.log("Nuevo usuario guardado:", usuario);
        return res.json({ message: "Usuario guardado exitosamente", data: usuario });
    }else{
        return res.json({message:"Error al enviar los datos", status: request.status})
    }
})

app.post("/new-cf", async (req,res)=>{
    const compañero = req.body
    const patron = /^[a-zA-Z0-9_.+-]+@unicartagena\.edu\.co$/;
    if(!patron.test(compañero.email)){
        return res.status(400).json({message:"El correo no es valido, por favor ingrese un correo valido (example@unicartagena.edu.co)",ok:false})
    }
    const exist = await turso.execute(Consultas.Select("Normal","compañeros","*",0))
    exist.rows.map((resultado)=>{
        if(resultado.email==compañero.email || resultado.number == compañero.number){
            return res.json({message:"Este usuario ya existe en la base de datos"})
        }
    })

    const request = await turso.execute({
        sql: `INSERT INTO compañeros (nombre,email,number) VALUES (:nombre,:email,:number)`,
        args:{nombre:compañero.nombre, email: compañero.email, number: compañero.number}
    })
    
    if(request.rowsAffected>0){
        console.log("Nuevo compañero guardado:", compañero);
        return res.json({ message: "Compañero recibido", data: compañero });
    }else{
        return res.json({message:"Error al enviar los datos", status: request.status})
    }
})

app.get("/classfriend/:id", async (req,res)=>{
    const id = req.params.id
    const request = await turso.execute(Consultas.Select("Condicion","compañeros","id",id))
    if(request.rows.length>0){
        return res.json({message:"Compañero encontrado", data: request.rows})
    }else{
        return res.json({message:"No se encontro el compañero"})
    }
})

app.post("/login",async (req,res)=>{
    const usuario = req.body
    const request = await turso.execute({
        sql:'SELECT * FROM usuario WHERE username = :username',
        args:{username:usuario.username}
    })

    if(request.rows.length>0){
        const user = request.rows[0]
        const pass = user.password
        if(usuario.username != user.username){
            return res.status(400).json({message:"Usuario incorrecto",ok:false})
        }
        if(usuario.password != pass){
            return res.status(400).json({message:"Contraseña incorrecta",ok:false})
        }
        res.json({message:"usuario ha iniciado sesion", data: user, ok:true})
    }else{
        return res.status(400).json({message:"Usuario no encontrado, por favor registrese sí aún no tiene una cuenta",ok:false})
    }
})

app.listen(port, ()=>{
    console.log(`Server corriendo en el puerto http://localhost:${port}`)
})