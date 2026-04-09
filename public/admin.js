function transformarLinks(texto) {
    if (!texto) return ""

    return texto.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    )
}

async function carregarEventos() {
    const res = await fetch("/eventos")
    const eventos = await res.json()

    const div = document.getElementById("lista-eventos")
    div.innerHTML = ""

    eventos.forEach(evento => {

        const container = document.createElement("div")
        container.className = "evento"

        const texto = document.createElement("span")
        texto.innerHTML = `
            <strong>${evento.titulo}</strong> - ${evento.data}<br>
            ${transformarLinks(evento.descricao)}
        `

        // DELETE
        const formDelete = document.createElement("form")
        formDelete.action = "/delete-event"
        formDelete.method = "POST"

        const input = document.createElement("input")
        input.type = "hidden"
        input.name = "id"
        input.value = evento.id

        const btnDelete = document.createElement("button")
        btnDelete.textContent = "Excluir"

        formDelete.appendChild(input)
        formDelete.appendChild(btnDelete)

        // EDITAR
        const btnEditar = document.createElement("button")
        btnEditar.textContent = "Editar"
        btnEditar.type = "button"

        btnEditar.onclick = () => {
            mostrarFormularioEdicao(evento)
        }

        container.appendChild(texto)
        container.appendChild(formDelete)
        container.appendChild(btnEditar)

        div.appendChild(container)
    })
}

function mostrarFormularioEdicao(evento) {
    const div = document.getElementById("lista-eventos")

    div.innerHTML = `
        <h3>Editar Evento</h3>

        <form action="/editar" method="POST">
            <input type="hidden" name="id" value="${evento.id}">
            <input name="titulo" value="${evento.titulo}">
            <input type="date" name="data" value="${evento.data}">
            <textarea name="descricao">${evento.descricao || ""}</textarea>
            <button type="submit">Salvar</button>
        </form>
    `
}

carregarEventos()

// ---------------- PROFESSORES ----------------

let professores = []

document.getElementById("form-professor").addEventListener("submit", (e) => {
    e.preventDefault()

    const nome = document.getElementById("nome").value
    const horario = document.getElementById("horario").value

    professores.push({ nome, horario })

    renderTabela()
})

function renderTabela() {
    const div = document.getElementById("tabela-professores")

    let html = "<table border='1'><tr>"

    professores.forEach(p => {
        html += <th>${p.nome}</th>
    })

    html += "</tr><tr>"

    professores.forEach(p => {
        html += <td>${p.horario}</td>
    })

    html += "</tr></table>"

    div.innerHTML = html
}