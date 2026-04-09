const bcrypt = require("bcrypt")

bcrypt.hash("belle123", 10).then(hash => {
    console.log(hash)
})