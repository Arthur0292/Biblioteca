// Pega os elementos no html pelo id
const searchInput = document.getElementById("search");
const alunoList = document.getElementById("alunoList");

// 1. FUNÇÃO PARA CARREGAR ALUNOS (Lendo do PHP)
async function carregarAlunos() {
    alunoList.innerHTML = ""; // limpa lista
    
    try {
        const response = await fetch('listar_alunos.php');
        const alunos = await response.json(); // Pega a lista de alunos do PHP

        if (alunos.length === 0) {
            alunoList.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
            return;
        }

        // Cria os cards com os dados do banco
        alunos.forEach(aluno => {
            let card = document.createElement("div");
            card.classList.add("aluno");

            // O ID vindo do banco (aluno.id) é usado para exclusão
            card.innerHTML = `
                <button class="delete-btn" onclick="apagarAluno(${aluno.id})">×</button>
                <p>
                    <strong>${aluno.nome}</strong><br>
                    Matrícula: ${aluno.matricula || 'N/A'}<br>
                    Email: ${aluno.email}<br>
                    Turma: ${aluno.turma}
                </p>
            `;
            alunoList.appendChild(card);
        });

    } catch (error) {
        alunoList.innerHTML = `<p style="color: red;">❌ Erro ao carregar alunos. Verifique a conexão com o servidor: ${error.message}</p>`;
        console.error('Erro ao carregar alunos:', error);
    }
}

//2. FUNÇÃO PARA APAGAR ALUNO (Enviando ID para o PHP)
async function apagarAluno(alunoId) {
    if (!confirm(`Tem certeza que deseja excluir o aluno com ID ${alunoId}?`)) {
        return; // Sai se o usuário não confirmar
    }

    try {
        // Envia o ID para o script PHP via método GET
        const response = await fetch(`apagar_aluno.php?id=${alunoId}`);
        const result = await response.json();

        if (result.sucesso) {
            alert(result.mensagem);
            carregarAlunos(); // Recarrega a lista após a exclusão
        } else {
            alert(`❌ Falha ao excluir: ${result.mensagem}`);
        }
    } catch (error) {
        alert("❌ Erro de comunicação com o servidor ao tentar excluir.");
        console.error('Erro na exclusão:', error);
    }
}

//3. FUNÇÃO DE PESQUISA (Local, após o carregamento)
searchInput.addEventListener("keyup", function () {
    let filter = searchInput.value.toLowerCase();
    let cards = alunoList.getElementsByClassName("aluno");

    for (let card of cards) {
        let text = card.textContent.toLowerCase();
        // Preserva a exibição se for true, senão oculta
        card.style.display = text.includes(filter) ? "" : "none";
    }
});

//Carrega os alunos quando a página é aberta
carregarAlunos();