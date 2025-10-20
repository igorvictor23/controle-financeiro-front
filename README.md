# Controle Financeiro (Frontend)

Este é o projeto de **Frontend** da aplicação full-stack de Controle Financeiro. Ele fornece a interface de usuário para interagir com a [API segura de Controle Financeiro (Backend)](https://github.com/igorvictor23/controle-financeiro-back).

A aplicação permite que usuários se cadastrem, façam login e gerenciem suas transações financeiras pessoais (receitas e despesas) de forma isolada e segura. A interface é dinâmica, atualizando-se em tempo real sem recarregar a página, utilizando JavaScript moderno (`async/await`, `fetch` API) e gerenciamento de estado via `localStorage`.

## 🚀 Funcionalidades

* **Autenticação:** Páginas separadas para Cadastro (`login.html`) e Login (`login.html`) de usuários.
* **Gerenciamento de Token:** Armazena o token JWT recebido no `localStorage` após o login.
* **Rotas Protegidas (Frontend):** Redireciona automaticamente para a página de login se o usuário tentar acessar a aplicação principal (`index.html`) sem um token válido.
* **Visualização Dinâmica:** Carrega e exibe o histórico de transações do usuário logado (`index.html`).
* **Resumo em Tempo Real:** Mostra os cards de "Receitas", "Despesas" e "Saldo Total" do usuário, atualizados automaticamente.
* **Criação e Exclusão:** Permite ao usuário logado adicionar e deletar suas próprias transações.
* **Logout:** Botão para limpar o token e redirecionar para a página de login.
* **Design Responsivo:** Interface adaptada para desktops e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

* **HTML5**
* **CSS3** (Flexbox, Media Queries)
* **JavaScript (ES6+)** (DOM, `fetch`, `localStorage`, `async/await`)

---

## 🚦 Como Executar o Projeto (Importante!)

Este frontend **depende totalmente** da API Backend para funcionar. Garanta que o servidor backend esteja rodando antes de iniciar o frontend.

### Passo 1: Configurar e Rodar o Backend

1.  Clone e configure o repositório do **backend** (`controle-financeiro-back`).
2.  Siga as instruções do `README.md` do backend para instalar dependências, criar o arquivo `.env` (com `DATABASE_URL` e `JWT_SECRET`) e iniciar o servidor (`node index.js`).
3.  Certifique-se de que o backend está rodando (geralmente em `http://localhost:3000`).

### Passo 2: Rodar este Frontend

1.  Clone este repositório (`controleFinanceiro-front`):
    ```bash
    git clone [https://github.com/igorvictor23/controleFinanceiro-front.git](https://github.com/igorvictor23/controleFinanceiro-front.git)
    cd controleFinanceiro-front
    ```
2.  **Não é necessário `npm install`**.

3.  Abra o arquivo **`login.html`** no seu navegador. A forma mais fácil é usando a extensão **Live Server** do VS Code:
    * Clique com o botão direito no arquivo `login.html`.
    * Selecione **"Open with Live Server"**.

4.  Você será direcionado para a página de login/cadastro. Após o login bem-sucedido, será redirecionado para a `index.html` principal.

### Observação: URL da API

O arquivo `login.js` e `script.js` deste projeto estão configurados para se comunicar com a API em `http://localhost:3000`. Se você hospedar o backend em um serviço como o Render, **lembre-se de atualizar a variável `apiUrl`** em ambos os arquivos JavaScript para a nova URL pública do seu backend.


// Exemplo (no topo de login.js e script.js):
const apiUrl = '[https://seu-backend-no-render.onrender.com](https://seu-backend-no-render.onrender.com)';
