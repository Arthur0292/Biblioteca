//A função de validação de CPF (matemática)
function validarCPF(cpf) {
    if (cpf.length !== 11) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpf[10])) return false;

    return true;
}

//Pega o elemento pelo ID quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("formAluno");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        //Coleta e Sanitização
        const nome = document.getElementById("nome").value.trim();
        const matricula = document.getElementById("matricula").value.trim();
        const turma = document.getElementById("turma").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const cpfRaw = document.getElementById("cpf").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        
        //Sanitiza CPF (remove pontos/traços/espaços)
        const cpf = cpfRaw.replace(/\D/g, "");

        //Validações
        if (!nome || !matricula || !turma || !email || !telefone || !cpf || !endereco) {
            alert("⚠ Preencha todos os campos!");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("⚠ Digite um e-mail válido!");
            return;
        }

        //Validação básica e matemática do CPF
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf) || !validarCPF(cpf)) {
            alert("⚠ CPF inválido!");
            return;
        }

        // 3. Objeto de dados para envio
        const aluno = { nome, matricula, turma, email, telefone, cpf, endereco };
        const urlBackend = "salvar_aluno.php"; 

        //Enviar os dados para o script PHP (Backend)
        fetch(urlBackend, {
            method: 'POST',
            headers: {
                //Informa ao servidor que o corpo da requisição é JSON
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aluno),
        })
        .then(response => response.json()) // Converte a resposta do PHP para JSON
        .then(data => {
            if (data.sucesso) {
                alert(`✅ ${data.mensagem}`);
                form.reset(); // Limpa o formulário em caso de sucesso
            } else {
                //Exibe a mensagem de erro que veio do PHP (ex: "Registro duplicado!")
                alert(`❌ Erro ao cadastrar: ${data.mensagem}`);
            }
        })
        .catch(error => {
            console.error('Erro de rede/servidor:', error);
            alert("❌ Erro de comunicação com o servidor.");
        });
    });
});