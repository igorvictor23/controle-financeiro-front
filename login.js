// login.js

// --- 1. Elementos Globais ---
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const errorMessageP = document.getElementById('auth-error-message');

const formLogin = document.getElementById('form-login');
const loginEmailInput = document.getElementById('login-email');
const loginSenhaInput = document.getElementById('login-senha');

const formRegister = document.getElementById('form-register');
const registerNomeInput = document.getElementById('register-nome');
const registerEmailInput = document.getElementById('register-email');
const registerSenhaInput = document.getElementById('register-senha');

// A URL da sua API (Importante!)
const apiUrl = 'https://iv-controle-financeiro.onrender.com/'; // OU a URL do Render, se já fez deploy

// --- 2. Funções para Trocar de Tela ---
function mostrarLogin() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    errorMessageP.style.display = 'none'; // Esconde erros ao trocar
}

function mostrarRegistro() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    errorMessageP.style.display = 'none'; // Esconde erros ao trocar
}

// --- 3. "Ouvintes" para os Links de Troca ---
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault(); // Impede o link de navegar
    mostrarRegistro();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Impede o link de navegar
    mostrarLogin();
});

// --- 4. Função para Exibir Erros ---
function exibirErro(mensagem) {
    errorMessageP.textContent = mensagem;
    errorMessageP.style.display = 'block';
}

// --- 5. Lógica de Login (Sua Vez!) ---
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessageP.style.display = 'none'; // Esconde erro anterior

    const email = loginEmailInput.value;
    const senha = loginSenhaInput.value;

    if (!email || !senha) {
        exibirErro('Por favor, preencha email e senha.');
        return;
    }

    try {
        // SUA LÓGICA FETCH POST PARA /auth/login AQUI
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        });

        const data = await response.json(); // Tenta ler a resposta mesmo se der erro

        if (!response.ok) {
            // Usa a mensagem do backend ou uma padrão
            throw new Error(data.message || `Erro HTTP: ${response.status}`);
        }

        // SUCESSO!
        console.log('Login bem-sucedido:', data);
        
        // **GUARDA O TOKEN!** (A chave para as próximas requisições)
        localStorage.setItem('authToken', data.token); 
        localStorage.setItem('userName', data.nome); // Guarda o nome também (opcional)

        // **REDIRECIONA PARA A APLICAÇÃO PRINCIPAL!**
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Erro no login:', error);
        exibirErro(error.message || 'Falha no login. Verifique suas credenciais.');
    }
});

// --- 6. Lógica de Registro (Sua Vez!) ---
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessageP.style.display = 'none'; // Esconde erro anterior

    const nome = registerNomeInput.value;
    const email = registerEmailInput.value;
    const senha = registerSenhaInput.value;

    if (!nome || !email || !senha) {
        exibirErro('Por favor, preencha todos os campos.');
        return;
    }
    if (senha.length < 6) {
        exibirErro('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        // SUA LÓGICA FETCH POST PARA /auth/register AQUI
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, email: email, senha: senha })
        });
        
        const data = await response.json(); // Tenta ler a resposta mesmo se der erro

        if (!response.ok) {
            // Usa a mensagem do backend ou uma padrão
            throw new Error(data.message || `Erro HTTP: ${response.status}`);
        }

        // SUCESSO!
        console.log('Registro bem-sucedido:', data);
        
        // Talvez fazer o login automaticamente após o registro? Ou apenas avisar?
        alert('Cadastro realizado com sucesso! Faça o login para continuar.');
        mostrarLogin(); // Volta para a tela de login
        formRegister.reset(); // Limpa o formulário de registro

    } catch (error) {
        console.error('Erro no registro:', error);
        exibirErro(error.message || 'Falha no registro. Verifique os dados ou tente outro email.');
    }
});