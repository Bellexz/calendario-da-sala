const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")
const path = require("path")

const dbPath = path.join(__dirname, "calendario.db")

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err)
    } else {
        console.log("Banco SQLite conectado")
    }
})

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            data TEXT,
            descricao TEXT
        )
    `)

    function criarUsuario(username, senha) {
        bcrypt.hash(senha, 10, (err, hash) => {
            if (err) {
                console.error("Erro ao gerar hash:", err)
                return
            }

            db.run(
                "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
                [username, hash]
            )
        })
    }

    criarUsuario("belle", "belle123")
    criarUsuario("yasmin", "yasmin123")

})

module.exports = db