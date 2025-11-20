// Gerencia livros e reservas no Local Storage.

// Chaves para salvar os dados
const CHAVES = {
    LIVROS: "livros",
    ALUNOS: "alunos"
};

// Elementos da tela
const EL = {
    search: document.getElementById("search"),
    listaLivros: document.getElementById("bookList"),
    modalEditar: document.getElementById("editModal"),
    modalReservar: document.getElementById("reserveModal"),
    listaAlunos: document.getElementById("studentListContainer"),
};

let livroEditando = null;   // Índice do livro a ser editado
let livroReservando = null; // Índice do livro a ser reservado

// Pega dados (de texto para objeto)
const pegarDados = (key) => JSON.parse(localStorage.getItem(key)) ?? [];
// Salva dados (de objeto para texto)
const salvarDados = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Pega a data de hoje formatada
const dataHoje = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};

// --- Funções Principais ---

// Mostra os livros na tela
function carregarLivros() {
    EL.listaLivros.innerHTML = ""; // Limpa a lista
    const livros = pegarDados(CHAVES.LIVROS);

    livros.forEach((livro, index) => {
        const card = document.createElement("div");
        card.classList.add("book");
        
        let infoReserva = '';
        
        // Checa e formata se o livro estiver reservado
        if (livro.reservadoPor) {
            infoReserva = `<p class="reserved-status">Reservado para: <strong>${livro.reservadoPor}</strong>`;
            if (livro.dataDevolucao) {
                const [ano, mes, dia] = livro.dataDevolucao.split('-');
                infoReserva += `<br><small>Devolução: ${dia}/${mes}/${ano}</small></p>`;
            } else {
                infoReserva += `</p>`;
            }
        }
        
        // Cria o cartão do livro (HTML)
        card.innerHTML = `
            <span class="action-btn remove-btn" data-action="remove" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </span>
            <span class="action-btn edit-btn" data-action="edit" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
            </span>
            <span class="action-btn reserve-btn" data-action="reserve" data-index="${index}">+</span>
            <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
            <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
            <small>${livro.localizacao}</small></p>
            ${infoReserva} 
        `;
        EL.listaLivros.appendChild(card);
    });
}

// Remove o livro
const removerLivro = (index) => {
    if (confirm("Excluir livro?")) { // Pergunta antes
        const livros = pegarDados(CHAVES.LIVROS);
        livros.splice(index, 1); // Remove
        salvarDados(CHAVES.LIVROS, livros);
        carregarLivros();
    }
};

// Abre a edição
const abrirEdicao = (index) => {
    livroEditando = index;
    const livro = pegarDados(CHAVES.LIVROS)[index];
    
    // Preenche o formulário
    document.getElementById("editNome").value = livro.nome;
    document.getElementById("editAutor").value = livro.autor;
    document.getElementById("editSumario").value = livro.sumario;
    document.getElementById("editLocalizacao").value = livro.localizacao;
    document.getElementById("editImagem").value = livro.imagem;

    EL.modalEditar.style.display = "flex"; // Mostra o modal
};

// Salva a edição
const salvarEdicao = () => {
    if (livroEditando === null) return;
    
    const livros = pegarDados(CHAVES.LIVROS);
    
    // Atualiza com os dados do formulário
    livros[livroEditando] = {
        ...livros[livroEditando], 
        nome: document.getElementById("editNome").value,
        autor: document.getElementById("editAutor").value,
        sumario: document.getElementById("editSumario").value,
        localizacao: document.getElementById("editLocalizacao").value,
        imagem: document.getElementById("editImagem").value,
    };

    salvarDados(CHAVES.LIVROS, livros);
    EL.modalEditar.style.display = "none";
    carregarLivros();
};

// Carrega alunos no modal de reserva
function carregarAlunosParaReserva(index) {
    EL.listaAlunos.innerHTML = "";
    livroReservando = index;
    
    const livros = pegarDados(CHAVES.LIVROS);
    const alunos = pegarDados(CHAVES.ALUNOS);
    const livro = livros[index];

    document.querySelector('#reserveModal h2').textContent = `Reservar: ${livro.nome}`;

    // Opção 1: Livro já reservado
    if (livro.reservadoPor) {
        document.querySelector('#reserveModal p').textContent = "O livro está reservado. Deseja liberar?";
        
        const dataDev = livro.dataDevolucao ? 
            `<p>Devolução: <strong>${livro.dataDevolucao.split('-').reverse().join('/')}</strong></p>` : '';

        EL.listaAlunos.innerHTML = `
            <p>Por: <strong>${livro.reservadoPor}</strong></p>
            ${dataDev}
            <button id="liberarLivroBtn">Cancelar Reserva</button>
        `;
        // Adiciona evento para liberar
        document.getElementById("liberarLivroBtn").addEventListener("click", () => liberarLivro(index, livro.reservadoPor));
        return;
    }
    
    // Opção 2: Livro livre
    document.querySelector('#reserveModal p').innerHTML = `
        Selecione um aluno e a data de devolução:<br><br>
        <label for="devolucao-date">Data de Devolução:</label>
        <input type="date" id="devolucao-date" min="${dataHoje()}" required>
    `;

    if (alunos.length === 0) {
        EL.listaAlunos.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
        return;
    }

    // Lista os alunos
    alunos.forEach(aluno => {
        const alunoJaReservou = livros.some(l => l.reservadoPor === aluno.nome);
        
        const item = document.createElement("div");
        item.classList.add("student-item");
        item.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
        
        if (alunoJaReservou) {
            item.classList.add("reserved-student"); 
            item.textContent += " (Já tem reserva)";
            item.onclick = () => alert(`${aluno.nome} já possui um livro reservado.`);
        } else {
            item.onclick = () => reservarLivro(index, aluno.nome); // Clica para reservar
        }
        EL.listaAlunos.appendChild(item);
    });
}

// Reserva o livro
const reservarLivro = (index, nomeAluno) => {
    const livros = pegarDados(CHAVES.LIVROS);
    const livro = livros[index];
    
    const dataDevolucao = document.getElementById("devolucao-date")?.value;

    if (!dataDevolucao) {
        alert("Selecione a data.");
        return;
    }

    if (livros.some(l => l.reservadoPor === nomeAluno)) {
         alert(`${nomeAluno} já possui um livro reservado.`);
         return; 
    }

    if (confirm(`Reservar "${livro.nome}" para ${nomeAluno}?`)) {
        livro.reservadoPor = nomeAluno;
        livro.dataDevolucao = dataDevolucao; 
        salvarDados(CHAVES.LIVROS, livros);
        alert(`Livro reservado!`);
        EL.modalReservar.style.display = "none";
        carregarLivros();
    }
};

// Libera o livro
const liberarLivro = (index, nomeAluno) => {
    const livros = pegarDados(CHAVES.LIVROS);
    const livro = livros[index];

    if (confirm(`Cancelar reserva de "${livro.nome}"?`)) {
        livro.reservadoPor = null; // Limpa a reserva
        livro.dataDevolucao = null; 
        salvarDados(CHAVES.LIVROS, livros);
        alert(`Reserva cancelada. Livro liberado!`);
        EL.modalReservar.style.display = "none";
        carregarLivros();
    }
};

// --- Configuração de Eventos ---

// Ouve cliques nos botões de ação (remover, editar, reservar)
EL.listaLivros.addEventListener("click", (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return; // Se não for botão, ignora

    const { action, index } = btn.dataset;
    const idx = parseInt(index);

    // Decide qual função chamar
    switch (action) {
        case "remove":
            removerLivro(idx);
            break;
        case "edit":
            abrirEdicao(idx);
            break;
        case "reserve":
            carregarAlunosParaReserva(idx);
            EL.modalReservar.style.display = "flex";
            break;
    }
});

// Eventos dos botões dos modais
document.getElementById("cancelarEdicao").addEventListener("click", () => EL.modalEditar.style.display = "none");
document.getElementById("salvarEdicao").addEventListener("click", salvarEdicao);
document.getElementById("cancelarReserva").addEventListener("click", () => EL.modalReservar.style.display = "none");

// Fecha modais se clicar fora
window.addEventListener("click", e => {
    if (e.target === EL.modalEditar) EL.modalEditar.style.display = "none";
    if (e.target === EL.modalReservar) EL.modalReservar.style.display = "none";
});

// Pesquisa instantânea
EL.search.addEventListener("input", function () {
    const texto = this.value.toLowerCase();
    const livros = EL.listaLivros.querySelectorAll(".book");

    livros.forEach(livro => {
        const info = livro.innerText.toLowerCase();
        // Se a busca der match, mostra. Se não, esconde.
        livro.style.display = info.includes(texto) ? "block" : "none";
    });
});

// Começa carregando a lista
carregarLivros();
