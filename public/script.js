async function carregarEventos(){

    const resposta = await fetch("/eventos")
    const eventos = await resposta.json()

    const div = document.getElementById("eventos")

    eventos.forEach(e => {

        const p = document.createElement("p")

        p.innerText = e.data + " - " + e.titulo

        div.appendChild(p)

    })
}

carregarEventos()