// Acha o formulário HTML.
const form = document.getElementById("formLivro");

// Escuta o botão de Enviar (submit) do formulário.
form.addEventListener("submit", function (event) {
    // Não deixa a página recarregar.
    event.preventDefault();

    // Pega o que foi digitado (e remove espaços extras).
    const nome = document.getElementById("nome").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const sumario = document.getElementById("sumario").value.trim();
    const localizacao = document.getElementById("localizacao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();

    // Se faltar algum campo,
    if (!nome || !autor || !sumario || !localizacao || !imagem) {
        // ... dá um erro e sai.
        alert("⚠ Preencha todos os campos!");
        return;
    }

    // Se o nome for muito curto,
    if (nome.length < 3) {
        // ... dá um erro e sai.
        alert("⚠ Nome do livro muito curto!");
        return;
    }

    // Cria um objeto com os dados do livro.
    const livro = { nome, autor, sumario, localizacao, imagem };
    // Pega a lista de livros salva ou cria uma nova lista vazia.
    let livros = JSON.parse(localStorage.getItem("livros")) || [];
    // Adiciona o novo livro na lista.
    livros.push(livro);
    // Salva a lista inteira de volta no navegador.
    localStorage.setItem("livros", JSON.stringify(livros));

    // Mensagem de sucesso!
    alert("✅ Livro cadastrado com sucesso!");
    // Limpa o formulário.
    form.reset();
});
