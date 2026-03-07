const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")

const db = new sqlite3.Database("./database/calendario.db")

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

bcrypt.hash("belle123",10,(err,hash1)=>{
 db.run("INSERT OR IGNORE INTO users (username,password) VALUES (?,?)",["belle",hash1])
})

bcrypt.hash("yasmin123",10,(err,hash2)=>{
 db.run("INSERT OR IGNORE INTO users (username,password) VALUES (?,?)",["yasmin",hash2])
})

})

module.exports = db