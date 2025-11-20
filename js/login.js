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
//email e senha criptografado
  eval(function(m,c,h){function z(i){return(i< 62?'':z(parseInt(i/62)))+((i=i%62)>35?String.fromCharCode(i+29):i.toString(36))}for(var i=0;i< m.length;i++)h[z(i)]=m[i];function d(w){return h[w]?h[w]:w;};return c.replace(/\b\w+\b/g,d);}('if|email|admin|cemi|com|senha|12345678|window|location|href|principal|html|else|passwordError|textContent|Email|ou|incorretos'.split('|'),'0(1==="2@3.4"&&5==="6"){7.8.9="./a.b";}c {d.e="f g 5 h.";}}',{}))

});

