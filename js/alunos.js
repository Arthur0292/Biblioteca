        const searchInput = document.getElementById("search");
        const alunoList = document.getElementById("alunoList");

        // Função para carregar alunos do localStorage
        function carregarAlunos() {
            alunoList.innerHTML = ""; // limpa lista
            let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

            alunos.forEach((aluno, index) => {
                let card = document.createElement("div");
                card.classList.add("aluno");

                // Conteúdo do card
                card.innerHTML = `
                    <button class="delete-btn" onclick="apagarAluno(${index})">×</button>
                    <p>
                        <strong>${aluno.nome}</strong><br>
                        Email: ${aluno.email}<br>
                        Turma: ${aluno.turma}
                    </p>
                `;

                alunoList.appendChild(card);
            });
        }

        // Função para apagar aluno
        function apagarAluno(index) {
            let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
            alunos.splice(index, 1); // remove pelo índice
            localStorage.setItem("alunos", JSON.stringify(alunos));
            carregarAlunos(); // recarrega lista
        }

        // Função de pesquisa
        searchInput.addEventListener("keyup", function () {
            let filter = searchInput.value.toLowerCase();
            let cards = alunoList.getElementsByClassName("aluno");

            for (let card of cards) {
                let text = card.textContent.toLowerCase();
                card.style.display = text.includes(filter) ? "" : "none";
            }
        });

        // Carrega quando abre a página
        carregarAlunos();
