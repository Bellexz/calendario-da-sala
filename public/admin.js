async function carregarEventos() {

const resposta = await fetch("/eventos")
const eventos = await resposta.json()

const div = document.getElementById("lista-eventos")
div.innerHTML = ""

eventos.forEach(evento => {

div.innerHTML += `
<p>
${evento.titulo} - ${evento.data}

<form action="/delete-event" method="POST">
<input type="hidden" name="id" value="${evento.id}">
<button type="submit">Excluir</button>
</form>

</p>
`

})

}

carregarEventos()