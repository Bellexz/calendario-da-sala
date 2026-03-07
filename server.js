const express = require("express")
const session = require("express-session")
const path = require("path")
const db = require("./database/db.js")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: "arara-azul-super-secreta",
    resave: false,
    saveUninitialized: true
}))

app.post("/login", (req, res) => {

    const { usuario, senha } = req.body

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [usuario],
        async (err, row) => {

            if (!row) {
                return res.send("Usuário inválido")
            }

            const bcrypt = require("bcrypt")
            const senhaValida = await bcrypt.compare(senha, row.password)

            if (senhaValida) {
                req.session.usuario = row.username
                res.redirect("/admin.html")
            } else {
                res.send("Senha incorreta")
            }
        }
    )
})
app.get("/eventos", (req,res)=>{

db.all("SELECT * FROM eventos", (err,rows)=>{

if(err){
return res.status(500).json({erro:"erro"})
}

res.json(rows)

})

})
app.use(express.static("public"))

app.get("/admin", (req,res)=>{
res.sendFile(__dirname + "/public/admin.html")
})
app.post("/delete-event", (req, res) => {

    if (!req.session.usuario) {
        return res.send("Acesso negado")
    }

    const { id } = req.body

    db.run(
        "DELETE FROM eventos WHERE id = ?",
        [id],
        (err) => {
            if (err) {
                return res.send("Erro ao deletar")
            }

            res.redirect("/admin.html")
        }
    )
})
app.post("/adicionar", (req, res) => {

    if (!req.session.usuario) {
        return res.send("Acesso negado")
    }

    const { titulo, data } = req.body

    db.run(
        "INSERT INTO eventos (titulo, data) VALUES (?, ?)",
        [titulo, data],
        (err) => {

            if (err) {
                return res.send("Erro ao adicionar evento")
            }

            res.redirect("/admin.html")
        }
    )

})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando")
})