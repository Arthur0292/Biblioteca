//Pega elementos do formulário pelo ID la no html
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

//Função de validação ao enviar o formulário
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  //Limpa mensagens de erro
  emailError.textContent = "";
  passwordError.textContent = "";

  let valid = true;

  //Validação de email vazio ou formato incorreto
  if (emailInput.value.trim() === "") {
    emailError.textContent = "Por favor, insira seu email.";
    valid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
    emailError.textContent = "Digite um email válido.";
    valid = false;
  }

  //Validação de senha vazia
  if (passwordInput.value.trim() === "") {
    passwordError.textContent = "Por favor, insira sua senha.";
    valid = false;
  }

  //Se tudo estiver válido, checa credenciais fixas
  if (valid) {
    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();
  // Se tudo estiver válido, checa credenciais fixas
  if (valid) {
    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

      //Se email e senha estiver corretos:
    if (email === "admin@cemi.com" && senha === "12345678") {
      // Redirecionar para a página principal
      window.location.href = "./principal.html";
        //FeedBack email e senha incorretos
    } else {
      passwordError.textContent = "Email ou senha incorretos.";
    }
  }
});


