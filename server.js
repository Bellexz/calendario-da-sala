const express = require("express")
const session = require("express-session")
const path = require("path")
const bcrypt = require("bcrypt")
const supabase = require("./supabase")

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
app.post("/login", async (req, res) => {

    const { usuario, senha } = req.body

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", usuario)
        .single()

    if (error || !data) {
        return res.send("Usuário inválido")
    }

    const senhaValida = await bcrypt.compare(senha, data.password)

    if (!senhaValida) {
        return res.send("Senha incorreta")
    }

    req.session.usuario = data.username
    res.redirect("/admin")
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
app.get("/eventos", async (req, res) => {

    const { data, error } = await supabase
     .from("eventos")
     .select("*")

    if (error) {
        console.error(error)
        return res.status(500).json({ erro: "Erro ao buscar eventos"})
    }

    res.json(data)
})

// ADICIONAR EVENTO
app.post("/adicionar", checkLogin, async (req, res) => {

    const { titulo, data, descricao } = req.body

    const {error} = await supabase
     .from("eventos")
     .insert([{ titulo, data, descricao }])

    if (error) {
        console.error(error)
        return res.send("Erro ao adicionar evento")
    }

    res.redirect("/admin")
})

// DELETAR EVENTO
app.post("/delete-event", checkLogin, async (req, res) => {

    const { id } = req.body

    const { error } = await supabase
     .from("eventos")
     .delete()
     .eq("id", id)

    if (error) {
        console.error(error)
        return res.send("Erro ao deletar evento")
    }

    res.redirect("/admin")
})

//EDITAR EVENTO
app.post("/editar", checkLogin, async (req, res) => {

    const { id, titulo, data, descricao } = req.body

    const { error } = await supabase
        .from("eventos")
        .update({ titulo, data, descricao })
        .eq("id", id)

    if (error) {
        console.error(error)
        return res.send("Erro ao editar evento")
    }

    res.redirect("/admin")
})

// SERVIDOR
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})