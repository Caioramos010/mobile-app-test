# mobile-api

API REST em Node.js com PostgreSQL para o sistema de Gerador de Senhas Mobile.

## Tecnologias

- **Node.js** + **Express**
- **PostgreSQL** via `pg`
- **bcryptjs** — hash de senhas dos usuários
- **jsonwebtoken** — autenticação JWT
- **dotenv** — variáveis de ambiente
- **cors** — liberação de origens
- **nodemon** — hot-reload em desenvolvimento

## Estrutura

```
mobile-api/
├── server.js              # Entry point
├── .env                   # Variáveis de ambiente
├── src/
│   ├── app.js             # Configuração do Express
│   ├── config/
│   │   ├── database.js    # Pool de conexão PostgreSQL
│   │   └── migrations.js  # Criação automática das tabelas
│   ├── controllers/
│   │   ├── authController.js      # SignUp / SignIn
│   │   └── passwordController.js  # CRUD de senhas
│   ├── middlewares/
│   │   └── auth.js        # Validação do JWT
│   └── routes/
│       ├── authRoutes.js      # /auth
│       └── passwordRoutes.js  # /passwords
```

## 🐳 Rodando com Docker (recomendado)

Sobe a API + PostgreSQL com um único comando, sem precisar instalar nada localmente:

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000` e o banco persistirá dados no volume `postgres_data`.

Para parar:
```bash
docker compose down
```

Para parar **e apagar os dados do banco**:
```bash
docker compose down -v
```

---

## Configuração (sem Docker)

1. Crie um banco PostgreSQL:
```sql
CREATE DATABASE mobile_db;
```

2. Copie e configure o `.env`:
```bash
cp .env.example .env
```
> Ajuste `DB_PASSWORD` e `JWT_SECRET` conforme seu ambiente. Ao rodar localmente, mantenha `DB_HOST=localhost`.

3. Instale as dependências:
```bash
npm install
```

4. Inicie em desenvolvimento:
```bash
npm run dev
```

As tabelas (`users` e `passwords`) são criadas automaticamente na primeira execução.

---

## Endpoints

### Autenticação

| Método | Rota           | Descrição            | Auth |
|--------|----------------|----------------------|------|
| POST   | /auth/signup   | Cadastro de usuário  | ❌   |
| POST   | /auth/signin   | Login de usuário     | ❌   |

#### POST /auth/signup
```json
// Body
{ "name": "João", "email": "joao@email.com", "password": "123456" }

// Response 201
{ "user": { "id": 1, "name": "João", "email": "joao@email.com", "created_at": "..." }, "token": "<jwt>" }
```

#### POST /auth/signin
```json
// Body
{ "email": "joao@email.com", "password": "123456" }

// Response 200
{ "user": { "id": 1, "name": "João", "email": "joao@email.com" }, "token": "<jwt>" }
```

---

### Senhas (requer `Authorization: Bearer <token>`)

| Método | Rota            | Descrição              |
|--------|-----------------|------------------------|
| GET    | /passwords      | Lista senhas do usuário |
| POST   | /passwords      | Salva uma nova senha   |
| DELETE | /passwords/:id  | Remove uma senha       |

#### POST /passwords
```json
// Body
{ "app_name": "Instagram", "password": "Ab3#xY9!" }

// Response 201
{ "id": 1, "user_id": 1, "app_name": "Instagram", "password": "Ab3#xY9!", "created_at": "..." }
```

#### DELETE /passwords/:id
```json
// Response 200
{ "message": "Senha removida com sucesso." }
```

---

### Health Check

| Método | Rota     | Descrição         |
|--------|----------|-------------------|
| GET    | /health  | Status da API     |
