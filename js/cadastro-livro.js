// Acha o formulário HTML.
const form = document.getElementById("formLivro");

// Escuta o botão de Enviar (submit) do formulário.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Pega o que foi digitado (e remove espaços extras).
    const nome = document.getElementById("nome").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const sumario = document.getElementById("sumario").value.trim();
    const localizacao = document.getElementById("localizacao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();

    // 1. Validações
    if (!nome || !autor || !sumario || !localizacao || !imagem) {
        alert("⚠ Preencha todos os campos!");
        return;
    }
    if (nome.length < 3) {
        alert("⚠ Nome do livro muito curto!");
        return;
    }

    // 2. Cria o objeto de dados
    const livro = { nome, autor, sumario, localizacao, imagem };
    const urlBackend = "salvar_livro.php"; 

    // 3. Enviar para o Backend (PHP)
    fetch(urlBackend, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(livro),
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            alert(`✅ ${data.mensagem}`);
            form.reset(); // Limpa o formulário em caso de sucesso
        } else {
            alert(`❌ Erro ao cadastrar: ${data.mensagem}`);
        }
    })
    .catch(error => {
        console.error('Erro de rede:', error);
        alert("❌ Erro de comunicação com o servidor.");
    });
});