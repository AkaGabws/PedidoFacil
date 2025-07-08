# 📋 Guia de Instalação - PedidoFácil

Este guia irá te ajudar a configurar e executar o sistema PedidoFácil em sua máquina local.

## 🎯 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **MongoDB** (versão 4.4 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)

### Verificando as instalações:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar MongoDB
mongod --version
```

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd PedidoFacil
```

### 2. Configurar o Backend

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp env.example .env
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na pasta `backend` com suas configurações:

```env
# Configurações do Banco de Dados
MONGO_URI=mongodb://localhost:27017/pedidofacil

# Configurações do Servidor
PORT=5000
NODE_ENV=development

# JWT Secret (IMPORTANTE: Altere para uma chave segura!)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_123456789

# Configurações de Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Configurações de Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Configurar o MongoDB

Certifique-se de que o MongoDB está rodando:

```bash
# Iniciar MongoDB (Linux/Mac)
sudo systemctl start mongod

# Ou no Windows, inicie o serviço MongoDB
# Ou execute: mongod
```

### 5. Popular o Banco de Dados

```bash
# Ainda na pasta backend
npm run seed
```

Este comando irá:
- Conectar ao MongoDB
- Criar usuários de demonstração
- Criar pedidos de exemplo
- Criar notas fiscais de exemplo

### 6. Iniciar o Backend

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Ou modo produção
npm start
```

O servidor estará rodando em: `http://localhost:5000`

### 7. Configurar o Frontend

Abra um novo terminal e navegue para a pasta do projeto:

```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install
```

### 8. Iniciar o Frontend

```bash
npm start
```

O frontend estará rodando em: `http://localhost:3000`

## ✅ Verificação da Instalação

### 1. Verificar Backend

Acesse: `http://localhost:5000/api/health`

Você deve ver uma resposta como:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Verificar Frontend

Acesse: `http://localhost:3000`

Você deve ver a tela de login do PedidoFácil.

### 3. Fazer Login

Use uma das credenciais de demonstração:

**Admin:**
- Email: `admin@pedidofacil.com`
- Senha: `admin123`

**Gerente:**
- Email: `gerente@pedidofacil.com`
- Senha: `gerente123`

**Operador:**
- Email: `operador@pedidofacil.com`
- Senha: `operador123`

## 🔧 Solução de Problemas

### Problema: MongoDB não conecta

**Solução:**
```bash
# Verificar se o MongoDB está rodando
sudo systemctl status mongod

# Se não estiver, iniciar:
sudo systemctl start mongod

# Verificar se a porta 27017 está livre
netstat -tlnp | grep 27017
```

### Problema: Porta 5000 já está em uso

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :5000

# Matar o processo
kill -9 <PID>

# Ou alterar a porta no .env
PORT=5001
```

### Problema: Porta 3000 já está em uso

**Solução:**
```bash
# O React automaticamente tentará a próxima porta
# Ou você pode especificar:
PORT=3001 npm start
```

### Problema: Erro de dependências

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: Erro de permissão

**Solução:**
```bash
# No Linux/Mac, dar permissão de execução
chmod +x scripts/seed.js

# Ou executar com sudo (não recomendado)
sudo npm run seed
```

## 📁 Estrutura de Arquivos

Após a instalação, sua estrutura deve ficar assim:

```
PedidoFacil/
├── backend/
│   ├── node_modules/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── scripts/
│   ├── .env                 # Criado por você
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── INSTALACAO.md
```

## 🚀 Comandos Úteis

### Backend
```bash
cd backend

# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test

# Popular banco
npm run seed

# Ver logs
npm run logs
```

### Frontend
```bash
cd frontend

# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test
```

## 🔒 Configurações de Segurança

### 1. JWT Secret
**IMPORTANTE:** Sempre altere o JWT_SECRET no arquivo `.env`:

```env
JWT_SECRET=chave_super_secreta_com_pelo_menos_32_caracteres_123456789
```

### 2. MongoDB
Para produção, configure autenticação no MongoDB:

```bash
# Criar usuário admin
use admin
db.createUser({
  user: "admin",
  pwd: "senha_segura",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

### 3. Variáveis de Ambiente
Nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. Verifique se todos os pré-requisitos estão instalados
2. Confirme se as portas não estão sendo usadas por outros serviços
3. Verifique os logs de erro no terminal
4. Abra uma issue no GitHub com detalhes do erro

## 🎉 Próximos Passos

Após a instalação bem-sucedida:

1. Explore o dashboard
2. Crie alguns pedidos de teste
3. Experimente as diferentes funcionalidades
4. Personalize as configurações conforme necessário
5. Configure para produção quando estiver pronto

---

**Boa sorte com sua instalação! 🚀** 