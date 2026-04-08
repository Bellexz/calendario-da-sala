
function transformarLinks(texto) {
    if (!texto) return ""

    return texto.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    )
}
async function carregarEventos() {

    const resposta = await fetch("/eventos")
    const eventos = await resposta.json()

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

        const form = document.createElement("form")
        form.action = "/delete-event"
        form.method = "POST"

        const input = document.createElement("input")
        input.type = "hidden"
        input.name = "id"
        input.value = evento.id

        const botao = document.createElement("button")
        botao.type = "submit"
        botao.textContent = "Excluir"

        form.appendChild(input)
        form.appendChild(botao)

        container.appendChild(texto)
        container.appendChild(form)

        div.appendChild(container)
    })
}

carregarEventos()