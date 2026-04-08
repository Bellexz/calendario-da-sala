const express = require("express")
const session = require("express-session")
const path = require("path")
const bcrypt = require("bcrypt")
const db = require("./database/db.js")

const app = express()

// Configurações básicas
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: "arara-azul-super-secreta",
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, "public")))

// Middleware de verificação de login
function checkLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login.html")
    }
    next()
}

// LOGIN
app.post("/login", (req, res) => {

    const { usuario, senha } = req.body

    db.get(
        "SELECT * FROM users WHERE username = ?",
        [usuario],
        async (err, user) => {

            if (err) {
                console.error(err)
                return res.send("Erro no servidor")
            }

            if (!user) {
                return res.send("Usuário inválido")
            }

            const senhaValida = await bcrypt.compare(senha, user.password)

            if (!senhaValida) {
                return res.send("Senha incorreta")
            }

            req.session.usuario = user.username
            res.redirect("/admin")
        }
    )
})

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

// PAINEL ADMIN
app.get("/admin", checkLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// LISTAR EVENTOS (API)
app.get("/eventos", (req, res) => {

    db.all("SELECT * FROM eventos", (err, rows) => {

        if (err) {
            console.error(err)
            return res.status(500).json({ erro: "Erro ao buscar eventos" })
        }

        res.json(rows)
    })
})

// ADICIONAR EVENTO
app.post("/adicionar", checkLogin, (req, res) => {

    const { titulo, data, descricao } = req.body

    db.run(
        "INSERT INTO eventos (titulo, data, descricao) VALUES (?, ?, ?)",
        [titulo, data, descricao],
        (err) => {

            if (err) {
                console.error(err)
                return res.send("Erro ao adicionar evento")
            }

            res.redirect("/admin")
        }
    )
})

// DELETAR EVENTO
app.post("/delete-event", checkLogin, (req, res) => {

    const { id } = req.body

    db.run(
        "DELETE FROM eventos WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err)
                return res.send("Erro ao deletar evento")
            }

            res.redirect("/admin")
        }
    )
})

// SERVIDOR
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})