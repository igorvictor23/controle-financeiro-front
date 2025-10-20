// script.js

console.log("Script iniciado. Verificando token...");

// --- PASSO 1: VERIFICAÇÃO DE AUTENTICAÇÃO ---
const token = localStorage.getItem('authToken');
console.log("Token encontrado no localStorage:", token);

if (!token) {
    console.log("Nenhum token encontrado. Redirecionando para login.html...");
    // Se NÃO tem token, manda o usuário para a página de login IMEDIATAMENTE
    window.location.href = 'login.html';
} else {
    // Se TEM token, TODO o código da aplicação principal vai AQUI DENTRO
    console.log("Token encontrado! Carregando a aplicação...");

    // --- 1. Definições Globais ---
    const apiUrl = 'https://iv-controle-financeiro.onrender.com'; // OU a URL do seu backend no Render
    
    // Elementos da Interface
    const listaTransacoes = document.getElementById('lista-transacoes');
    const form = document.getElementById('form-transacao');
    const formDescricao = document.getElementById('form-descricao');
    const formValor = document.getElementById('form-valor');
    const formTipo = document.getElementById('form-tipo');
    const totalReceitasEl = document.getElementById('total-receitas');
    const totalDespesasEl = document.getElementById('total-despesas');
    const saldoTotalEl = document.getElementById('saldo-total');
    const userNameSpan = document.getElementById('user-name'); // Para a mensagem de boas-vindas
    const btnLogout = document.getElementById('btn-logout');

    // --- Lógica para mostrar nome (Opcional) ---
    const nomeUsuario = localStorage.getItem('userName');
    if (userNameSpan && nomeUsuario) {
        userNameSpan.textContent = nomeUsuario;
    }

    // --- 2. Funções de Comunicação com API (COM AUTENTICAÇÃO) ---

    /**
     * Busca TODAS as transações do usuário logado (GET /transacoes).
     */
    async function carregarTransacoes() {
        console.log('Carregando transações...');
        try {
            const response = await fetch(`${apiUrl}/transacoes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Envia o token
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const transacoes = await response.json();
            console.log('Transações recebidas:', transacoes);

            listaTransacoes.innerHTML = ''; // Limpa a lista antes de redesenhar
            transacoes.forEach(adicionarTransacaoNaTela);

            await atualizarResumo(); // Atualiza os cards após carregar

        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            if (error.message.includes('401') || error.message.includes('token')) {
                 alert('Sua sessão expirou ou é inválida. Faça o login novamente.');
                 fazerLogout(); // Função que limpa token e redireciona
            } else {
                 alert('Falha ao buscar dados do servidor.');
            }
        }
    }

    /**
     * Envia uma nova transação (POST /transacoes).
     */
    async function criarTransacao(transacaoData) {
        console.log('Criando nova transação:', transacaoData);
        try {
            const response = await fetch(`${apiUrl}/transacoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token
                },
                body: JSON.stringify(transacaoData)
            });

            const data = await response.json(); // Tenta ler a resposta

            if (!response.ok) {
                throw new Error(data.message || `Erro HTTP: ${response.status}`);
            }

            console.log('Transação criada:', data);
            adicionarTransacaoNaTela(data); // Adiciona na tela
            await atualizarResumo(); // Atualiza os cards

            form.reset(); // Limpa o formulário

        } catch (error) {
            console.error('Erro ao criar transação:', error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    }

    /**
     * Deleta uma transação (DELETE /transacoes/:id).
     * Esta função é chamada diretamente pelo onclick no HTML.
     */
    async function deletarTransacao(id) {
        console.log('Tentando deletar transação ID:', id);
        if (!confirm('Tem certeza que deseja deletar esta transação?')) {
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/transacoes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Envia o token
                }
            });

             const data = await response.json(); // Tenta ler a resposta

            if (!response.ok) {
                 throw new Error(data.message || `Erro HTTP: ${response.status}`);
            }

            console.log('Transação deletada:', data.message);

            // Remove o item da tela
            const itemParaDeletar = document.querySelector(`li[data-id="${id}"]`);
            if (itemParaDeletar) {
                itemParaDeletar.remove();
            }

            await atualizarResumo(); // Atualiza os cards

        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            alert(`Erro ao deletar: ${error.message}`);
        }
    }

     /**
      * Busca o resumo financeiro (GET /transacoes/resumo).
      */
    async function atualizarResumo() {
        console.log('Atualizando resumo...');
         try {
            const response = await fetch(`${apiUrl}/transacoes/resumo`, {
                 method: 'GET',
                 headers: {
                    'Authorization': `Bearer ${token}` // Envia o token
                }
            });

            if (!response.ok) {
                 throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const resumo = await response.json();
            console.log('Resumo recebido:', resumo);

            totalReceitasEl.textContent = formatarParaBRL(resumo.receitas || 0);
            totalDespesasEl.textContent = formatarParaBRL(resumo.despesas || 0);
            saldoTotalEl.textContent = formatarParaBRL(resumo.saldo || 0);

            // Atualiza a cor do saldo
            saldoTotalEl.classList.remove('receita', 'despesa');
            if (resumo.saldo < 0) {
                saldoTotalEl.classList.add('despesa');
            } else if (resumo.saldo > 0) {
                saldoTotalEl.classList.add('receita');
            }

         } catch (error) {
            console.error('Erro ao atualizar resumo:', error);
            // Não mostra alert aqui para não ser chato, mas registra o erro
         }
    }


    // --- 3. Função de "Desenho" na Tela ---
    function adicionarTransacaoNaTela(transacao) {
        const tipo = transacao.tipo;
        const classeCss = (tipo === 'receita') ? 'receita' : 'despesa';
        // Usa a nova função de formatação
        const valorFormatado = formatarParaBRL(tipo === 'despesa' ? -transacao.valor : transacao.valor); 

        const item = document.createElement('li');
        item.classList.add('item-transacao');
        item.classList.add(classeCss);
        item.dataset.id = transacao._id;

        item.innerHTML = `
            <span class="descricao">${transacao.descricao}</span>
            <span class="valor">${valorFormatado}</span>
            <button class="btn-delete" onclick="deletarTransacao('${transacao._id}')">X</button>
        `;
        
        // Adiciona o novo item no INÍCIO da lista para ficar mais visível
        listaTransacoes.prepend(item); 
    }

    // --- 4. Função Utilitária de Formatação ---
    function formatarParaBRL(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // --- 5. Função e "Ouvinte" de Logout ---
    function fazerLogout() {
        console.log('Fazendo logout...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', fazerLogout);
    }

    // --- 6. "Ouvinte" do Formulário de Adicionar Transação ---
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const descricao = formDescricao.value;
        const valor = parseFloat(formValor.value);
        const tipo = formTipo.value;

        if (!descricao || isNaN(valor) || !tipo) { // Verifica se valor é número
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const transacaoData = {
            descricao: descricao,
            // O backend espera sempre valor POSITIVO, o 'tipo' define a operação
            valor: Math.abs(valor), 
            tipo: tipo
        };

        criarTransacao(transacaoData);
        // A limpeza do form foi movida para dentro de criarTransacao (após sucesso)
    });

    // --- 7. Inicialização ---
    // Chama as funções para carregar os dados assim que o HTML estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
        carregarTransacoes(); 
        // Não precisa chamar atualizarResumo aqui, pois carregarTransacoes já o chama no final.
    });

} // --- FIM DO BLOCO 'else' ---
