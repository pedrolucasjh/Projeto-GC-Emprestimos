const form = document.getElementById('loginForm');

form.addEventListener('submit', function(event) {
// 3. Previne o comportamento padrão do formulário (que é recarregar a página)
event.preventDefault();

// 4. Pega os valores digitados nos campos de email e senha
const email = document.getElementById('floatingInput').value;
const password = document.getElementById('floatingPassword').value;

// --- Lógica de Autenticação (Simulada) ---
// Em um projeto real, isso seria enviado para um servidor.
// Aqui, vamos apenas verificar valores fixos.
const emailCorreto = 'teste@exemplo.com';
const senhaCorreta = '1234';

if (email === emailCorreto && password === senhaCorreta)  {
  window.location.href = '../home/home.html' ; // Redireciona para a página home.html
} else {
// 6. Se estiver incorreto, mostra uma mensagem de erro
alert('Email ou senha inválidos. Tente novamente.');
}
      });




