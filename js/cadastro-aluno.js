//Pega o elemento pelo ID
const form = document.getElementById("formAluno");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  //Adiciona constantes e tire os espaços
  const nome = document.getElementById("nome").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const turma = document.getElementById("turma").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const cpfRaw = document.getElementById("cpf").value.trim();
  const endereco = document.getElementById("endereco").value.trim();

  // Sanitiza CPF (remove pontos/traços/espaços)
  const cpf = cpfRaw.replace(/\D/g, "");

  // Verifica campos obrigatórios foram preenchidos
  if (!nome || !matricula || !turma || !email || !telefone || !cpf || !endereco) {
    alert("⚠ Preencha todos os campos!");
    return;
  }

  //Validação simples de e-mail
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("⚠ Digite um e-mail válido!");
    return;
  }

  //Validação básica do CPF
  if (cpf.length !== 11) {
    alert("⚠ CPF deve ter 11 números (sem pontos ou traços)!");
    return;
  }

  //Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cpf)) {
    alert("⚠ CPF inválido!");
    return;
  }

  //Validação matemática do CPF
  if (!validarCPF(cpf)) {
    alert("⚠ CPF inválido!");
    return;
  }

  //Se passou em tudo → salva no localStorage
  const aluno = { nome, matricula, turma, email, telefone, cpf, endereco };
  let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
  alunos.push(aluno);
  localStorage.setItem("alunos", JSON.stringify(alunos));

  alert("✅ Aluno cadastrado com sucesso!");
  form.reset();
});

//Função de validação dos dígitos do CPF
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
//Se tudo estiver correto retorna true
  return true;
}

