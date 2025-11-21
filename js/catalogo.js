//Elementos pelo ID
const EL = {
    search: document.getElementById("search"),
    listaLivros: document.getElementById("bookList"),
    modalEditar: document.getElementById("editModal"),
    modalReservar: document.getElementById("reserveModal"),
    listaAlunos: document.getElementById("studentListContainer"),
};

let livroEditandoId = null; 
let livroReservandoId = null; 

//Pega a data e formata
const dataHoje = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};


//MOSTRA LIVROS NA TELA

async function carregarLivros() {
    EL.listaLivros.innerHTML = "";
    
    try {
        //Chama o backend para buscar todos os livros
        const response = await fetch('listar_livros.php');
        const livros = await response.json(); //Tenta ler o JSON

        if (!livros || livros.sucesso === false) {
             //Caso a conexão falhe ou o PHP retorne um erro JSON
            EL.listaLivros.innerHTML = `<p style="color: red;">❌ Erro ao carregar livros: ${livros.erro || 'Verifique o listar_livros.php.'}</p>`;
            return;
        }

        if (livros.length === 0) {
            EL.listaLivros.innerHTML = "<p>Nenhum livro cadastrado.</p>";
            return;
        }
        
        //Cria os cards usando o ID real do banco 
        livros.forEach(livro => {
            const card = document.createElement("div");
            card.classList.add("book");
            
            let infoReserva = '';
            
            //Checa e formata se o livro estiver reservado
            if (livro.reservadoPor) {
                infoReserva = `<p class="reserved-status">Reservado para: <strong>${livro.reservadoPor}</strong>`;
                if (livro.dataDevolucao) {
                    //Formata a data DD/MM/AAAA
                    const [ano, mes, dia] = livro.dataDevolucao.split('-');
                    infoReserva += `<br><small>Devolução: ${dia}/${mes}/${ano}</small></p>`;
                } else {
                    infoReserva += `</p>`;
                }
            }
            
            //Os data-set do botão edit-btn
            card.innerHTML = `
                <span class="action-btn remove-btn" data-action="remove" data-id="${livro.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </span>
                <span class="action-btn edit-btn" data-action="edit" data-id="${livro.id}" 
                      data-nome="${livro.nome}" data-autor="${livro.autor}" data-sumario="${livro.sumario}" 
                      data-localizacao="${livro.localizacao}" data-imagem="${livro.imagem}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </span>
                <span class="action-btn reserve-btn" data-action="reserve" data-id="${livro.id}">+</span>
                <img src="${livro.imagem || "https://via.placeholder.com/200x280?text=Sem+Capa"}" alt="${livro.nome}">
                <p><strong>${livro.autor}</strong> - ${livro.nome}<br>
                <small>${livro.localizacao}</small></p>
                ${infoReserva} 
            `;
            EL.listaLivros.appendChild(card);
        });

    } catch (error) {
        //Erro genérico (ex:listar_livros.php não encontrado ou não retornou JSON válido)
        EL.listaLivros.innerHTML = `<p style="color: red;">❌ Erro de comunicação. Verifique se o listar_livros.php está acessível.</p>`;
        console.error('Erro no carregarLivros:', error);
    }
}


//FUNÇÃO: de REMOVER LIVRO

const removerLivro = async (livroId) => {
    if (!confirm("Tem certeza que deseja EXCLUIR este livro?")) return;
    try {
        const response = await fetch(`apagar_livro.php?id=${livroId}`);
        const result = await response.json();
        if (result.sucesso) {
            alert(result.mensagem);
            carregarLivros(); 
        } else {
            alert(`❌ Falha ao excluir: ${result.mensagem}`);
        }
    } catch (error) {
        alert("❌ Erro de comunicação com o servidor ao tentar excluir.");
    }
};

// 3. FUNÇÃO: ABRIR EDIÇÃO
const abrirEdicao = (livro) => {
    livroEditandoId = livro.id;
    document.getElementById("editNome").value = livro.nome;
    document.getElementById("editAutor").value = livro.autor;
    document.getElementById("editSumario").value = livro.sumario;
    document.getElementById("editLocalizacao").value = livro.localizacao;
    document.getElementById("editImagem").value = livro.imagem;
    EL.modalEditar.style.display = "flex";
};


//FUNÇÃO: SALVAR EDIÇÃO (Usa salvar_edicao_livro.php)

const salvarEdicao = async () => {
    if (livroEditandoId === null) return;
    
    const dadosAtualizados = {
        id: livroEditandoId, 
        nome: document.getElementById("editNome").value,
        autor: document.getElementById("editAutor").value,
        sumario: document.getElementById("editSumario").value,
        localizacao: document.getElementById("editLocalizacao").value,
        imagem: document.getElementById("editImagem").value,
    };

    try {
        const response = await fetch('salvar_edicao_livro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados),
        });
        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            EL.modalEditar.style.display = "none";
            carregarLivros(); 
        } else {
            alert(`❌ Erro ao salvar edição: ${data.mensagem}`);
        }
    } catch (error) {
        alert("❌ Erro de comunicação com o servidor.");
    }
};


//FUNÇÃO: CARREGAR ALUNOS PARA RESERVA (Chama PHP para alunos e livros)

async function carregarAlunosParaReserva(livroId) {
    EL.listaAlunos.innerHTML = "";
    livroReservandoId = livroId; 
    
    try {
        //Busca todos os livros e alunos
        const [livrosResp, alunosResp] = await Promise.all([
            fetch('listar_livros.php'),
            fetch('listar_alunos.php') //ASSUME QUE ESTE SCRIPT EXISTE E LISTA ALUNOS
        ]);
        
        const livros = await livrosResp.json();
        const alunos = await alunosResp.json();
        
        const livro = livros.find(l => l.id == livroId);
        if (!livro) return;

        document.querySelector('#reserveModal h2').textContent = `Reservar: ${livro.nome}`;

        //Lógica de Liberação
        if (livro.reservadoPor) {
            document.querySelector('#reserveModal p').textContent = "O livro está reservado. Deseja liberar?";
            
            const dataDev = livro.dataDevolucao ? 
                `<p>Devolução: <strong>${livro.dataDevolucao.split('-').reverse().join('/')}</strong></p>` : '';

            EL.listaAlunos.innerHTML = `
                <p>Por: <strong>${livro.reservadoPor}</strong></p>
                ${dataDev}
                <button id="liberarLivroBtn">Cancelar Reserva</button>
            `;
            //Adiciona evento que chama a função de liberar adaptada
            document.getElementById("liberarLivroBtn").addEventListener("click", () => liberarLivro(livroId));
            return;
        }
        
        //Lógica de Nova Reserva
        document.querySelector('#reserveModal p').innerHTML = `
            Selecione um aluno e a data de devolução:<br><br>
            <label for="devolucao-date">Data de Devolução:</label>
            <input type="date" id="devolucao-date" min="${dataHoje()}" required>
        `;

        if (!alunos || alunos.length === 0) {
            EL.listaAlunos.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
            return;
        }

        //Lista os alunos para reservar o livro
        alunos.forEach(aluno => {
            //Verifica se o aluno já tem alguma reserva em outro livro
            const alunoJaReservou = livros.some(l => l.reservadoPor === aluno.nome);
            
            const item = document.createElement("div");
            item.classList.add("student-item");
            item.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
            
            if (alunoJaReservou) {
                item.classList.add("reserved-student"); 
                item.textContent += " (Já tem reserva)";
                item.onclick = () => alert(`${aluno.nome} já possui um livro reservado.`);
            } else {
                item.onclick = () => {
                    const dataDevolucao = document.getElementById("devolucao-date")?.value;
                    reservarLivro(livroId, aluno.nome, dataDevolucao);
                }; 
            }
            EL.listaAlunos.appendChild(item);
        });
    
    } catch (error) {
        console.error('Erro ao carregar dados para reserva:', error);
        EL.listaAlunos.innerHTML = "<p>❌ Erro ao carregar alunos. Verifique o listar_alunos.php.</p>";
    }
}


//FUNÇÕES:RESERVAR/LIBERAR


async function reservarLivro(livroId, nomeAluno, dataDevolucao) {
    if (!dataDevolucao) {
        alert("Selecione a data de devolução.");
        return;
    }

    if (!confirm(`Reservar livro (ID ${livroId}) para ${nomeAluno} até ${dataDevolucao}?`)) {
        return;
    }
    
    const dados = {
        acao: 'reservar',
        livro_id: livroId,
        nome_aluno: nomeAluno,
        data_devolucao: dataDevolucao
    };

    try {
        const response = await fetch('salvar_reserva.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            EL.modalReservar.style.display = "none";
            carregarLivros(); 
        } else {
            alert(`❌ Falha na reserva: ${data.mensagem}`);
        }
    } catch (error) {
        alert("❌ Erro de comunicação com o servidor.");
        console.error('Erro na reserva:', error);
    }
}

async function liberarLivro(livroId) {
    if (!confirm(`Tem certeza que deseja LIBERAR a reserva do livro (ID ${livroId})?`)) {
        return;
    }

    const dados = {
        acao: 'liberar',
        livro_id: livroId,
        nome_aluno: null,
        data_devolucao: null
    };

    try {
        const response = await fetch('salvar_reserva.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        const data = await response.json();

        if (data.sucesso) {
            alert(data.mensagem);
            EL.modalReservar.style.display = "none";
            carregarLivros(); 
        } else {
            alert(`❌ Falha ao liberar reserva: ${data.mensagem}`);
        }
    } catch (error) {
        alert("❌ Erro de comunicação com o servidor.");
        console.error('Erro ao liberar reserva:', error);
    }
}


//botões(remover, editar, reservar)
EL.listaLivros.addEventListener("click", (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return;

    const { action, id, nome, autor, sumario, localizacao, imagem } = btn.dataset;
    const livroId = parseInt(id);

    switch (action) {
        case "remove":
            removerLivro(livroId);
            break;
        case "edit":
            abrirEdicao({ id: livroId, nome, autor, sumario, localizacao, imagem });
            break;
        case "reserve":
            carregarAlunosParaReserva(livroId);
            EL.modalReservar.style.display = "flex";
            break;
    }
});

//Eventos dos botões dos modais
document.getElementById("cancelarEdicao").addEventListener("click", () => EL.modalEditar.style.display = "none");
document.getElementById("salvarEdicao").addEventListener("click", salvarEdicao);
document.getElementById("cancelarReserva").addEventListener("click", () => EL.modalReservar.style.display = "none");

//Fecha modais se clicar fora
window.addEventListener("click", e => {
    if (e.target === EL.modalEditar) EL.modalEditar.style.display = "none";
    if (e.target === EL.modalReservar) EL.modalReservar.style.display = "none";
});

//Pesquisa instantânea(OK-Apenas filtra o HTML já carregado)
EL.search.addEventListener("input", function () {
    const texto = this.value.toLowerCase();
    const livros = EL.listaLivros.querySelectorAll(".book");

    livros.forEach(livro => {
        const info = livro.innerText.toLowerCase();
        livro.style.display = info.includes(texto) ? "block" : "none";
    });
});

//Começa carregando a lista
carregarLivros();