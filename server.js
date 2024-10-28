import express from 'express'
import sqlite3 from 'sqlite3'
import bcrypt, { hash } from 'bcrypt'

const app = express()

app.use(express.json()) //permitir que a requisição

const router = express.Router()

const db = new sqlite3.Database('./database/database.db', (falhou)=>{
    if(falhou){
        console.log("Não foi possivel conectar ao banco de dados")
    }else{
        console.log("Conectado ao banco de dados.")
    }
})

//-------------ESTRUTURA DE BANCO-----------------------------------
const sqlTabelaUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    );
`;

db.exec(sqlTabelaUsuarios);
//-------------FIM-------------------------------------------------



//-------------ROTAS-----------------------------------------------
router.get('/', (req, res)=>{
    res.send("Raiz")
})

router.post('/usuarios', (req, res)=>{
    
    bcrypt.hash(req.body.senha, 10, (erro, hash) =>{
        
        const sqlInsert = `INSERT INTO usuarios(nome, email, senha)VALUES(?, ?, ?);`;
        
        db.run(sqlInsert, [req.body.nome, req.body.email, hash], (erro)=>{
            if(erro){
                res.send(erro.message)        
            }else{
                res.send("Novo usuario inserido com sucesso!")        
            }
        })

    })

})


router.put('/usuarios/:id', (req, res)=>{
    const sqlUpdate = `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?;`;

    db.run(sqlUpdate, [req.body.nome, req.body.email, req.params.id], (erro)=>{
        if(erro){
            res.send(erro.message)
        }else{
            res.send('Usuario atualizado com sucesso!')
        }
    })
})

router.get('/usuarios/:id', (req, res)=>{
    
    const sqlSelect = "SELECT * FROM usuarios WHERE id = ?";
    
    db.get(sqlSelect, [req.params.id], (erro, row)=>{
        if(erro){
            res.send(erro.message)
        }else{
            res.send(row)
        }
    })

})
//-----------------------------------------------------------------



app.use(router)

const PORT = 3005

app.listen(PORT, ()=>{
    console.log(`Server is runing on port ${PORT}`)
})