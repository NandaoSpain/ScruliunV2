# Scruliun V2

![GitHub](https://img.shields.io/github/license/NandaoSpain/Scruliun)
![GitHub last commit](https://img.shields.io/github/last-commit/NandaoSpain/Scruliun)
![GitHub repo size](https://img.shields.io/github/repo-size/NandaoSpain/Scruliun)

## 📌 Descrição
Esta é uma API de gerenciamento de tasks, permitindo criar, listar, atualizar e excluir tarefas. Ideal para organização pessoal ou equipes.

## 🛠 Tecnologias Utilizadas
- **Linguagem**: TypeScript - Uma linguagem que adiciona tipagem estática ao JavaScript, melhorando a robustez do código.
- **Framework**: Node.js com Express - Node.js é um runtime JavaScript assíncrono e orientado a eventos, enquanto Express é um framework minimalista para construir APIs.
- **Banco de Dados**: PostgreSQL - Um banco de dados relacional robusto, open-source e altamente escalável.
- **Autenticação**: JWT - JSON Web Token é um método seguro e amplamente utilizado para autenticação de usuários.
- **ORM**: Prisma - Um ORM moderno para Node.js e TypeScript, que simplifica o gerenciamento do banco de dados.
- **Criptografia**: Bcrypt - Biblioteca para hashing seguro de senhas, essencial para armazenar credenciais de forma protegida.
- **Validação**: Zod - Biblioteca TypeScript para validação de esquemas, garantindo a integridade dos dados.
- **Testes**: Jest - Framework de testes em JavaScript/TypeScript, focado em simplicidade e desempenho.
- **Docker**: Plataforma de containerização que permite empacotar a aplicação e suas dependências, garantindo execução consistente em diferentes ambientes.

## 🚀 Como Rodar o Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/task-management-api.git
cd task-management-api
```

### 2️⃣ Criar e ativar ambiente virtual (opcional)
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as configurações necessárias.

### 4️⃣ Rodar o projeto com Docker
```bash
docker-compose up --build
```

### 5️⃣ Rodar a API sem Docker
```bash
npm run dev
```

## 🔗 Rotas da API 
| Método | Endpoint | Descrição |
|---------|----------|-------------|
| USERS   |
| POST    | `/users` | Cria um novo usuário |
| GET     | `/users/` | Lista todos os usuários |
| GET     | `/users/{id}` | Obtém dados de um usuário |
| PUT     | `/users/{id}` | Atualiza os dados de um usuário |
| DELETE  | `/users` | Remove um usuário|
| SESSIONS|
| POST    | `/sessions` | Autenticação de usuário |
| TASKS   |
| GET     | `/tasks` | Lista todas as tasks |
| POST    | `/tasks` | Cria uma nova task |
| GET     | `/tasks/{id}` | Busca uma task pelo ID |
| PUT     | `/tasks/{id}` | Atualiza uma task |
| DELETE  | `/tasks/{id}` | Remove uma task |
| TEAMS   |
| GET     | `/teams` | Lista todas as equipes |
| POST    | `/teams` | Cria uma nova equipe |
| GET	    |`/teams/{id}`| Obtém detalhes de uma equipe
| PUT	    |`/teams/{id}`|	Atualiza os dados de uma equipe
|DELETE	  |`/teams/{id}`|	Remove uma equipe
| TEAM MEMBERS| 
| GET     | `/team-members` | Lista todas os membros de uma equipe  |
| POST    | `/team-members` | Adiciona um usuário a uma equipe |
| DELETE  | `/team-members/{id}` | Remove um membro de uma equipe |

## 📌 Contribuição
Contribuições são bem-vindas! Siga os passos:
1. **Fork** este repositório
2. Crie um **branch** (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -m 'Minha nova feature'`)
4. Push para o branch (`git push origin minha-feature`)
5. Abra um **Pull Request**

---
**📄 Licença**: MIT License
---
