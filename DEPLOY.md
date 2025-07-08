# 🚀 Guia de Deploy - PedidoFácil

Este guia explica como preparar e fazer deploy do projeto PedidoFácil no GitHub.

## 📋 Pré-requisitos

- Git instalado
- Conta no GitHub
- Node.js e npm instalados

## 🔒 Segurança - Arquivos Sensíveis

**⚠️ IMPORTANTE:** Os seguintes arquivos contêm informações sensíveis e NÃO devem ser commitados:

- `.env` (variáveis de ambiente)
- `backend/.env` (configuração do backend)
- `database/config-atlas.js` (configuração do MongoDB Atlas)
- `setup-atlas.js` (script com credenciais)

Estes arquivos já estão no `.gitignore` e serão ignorados automaticamente.

## 🛠️ Preparação para Deploy

### 1. Executar script de preparação (opcional)

```bash
# Linux/macOS
chmod +x scripts/prepare-for-deploy.sh
./scripts/prepare-for-deploy.sh

# Windows
# Execute manualmente as verificações abaixo
```

### 2. Verificação manual

Certifique-se de que os seguintes arquivos existem:
- ✅ `.gitignore` (já criado)
- ✅ `backend/env.example` (já criado)
- ✅ `database/config-atlas.example.js` (já criado)
- ✅ `README.md` (já atualizado)

### 3. Verificar arquivos sensíveis

Confirme que os seguintes arquivos NÃO estão no repositório:
- ❌ `.env`
- ❌ `backend/.env`
- ❌ `database/config-atlas.js`
- ❌ `setup-atlas.js`

## 📤 Deploy no GitHub

### 1. Inicializar repositório Git (se ainda não feito)

```bash
git init
git add .
git commit -m "feat: sistema completo de gestão de pedidos e notas fiscais"
```

### 2. Conectar ao GitHub

```bash
# Criar repositório no GitHub primeiro, depois:
git remote add origin https://github.com/SEU_USUARIO/PedidoFacil.git
git branch -M main
git push -u origin main
```

### 3. Verificar se os arquivos sensíveis não foram enviados

```bash
git status
```

Você NÃO deve ver arquivos como `.env` ou `config-atlas.js` na lista.

## 🔧 Configuração para Outros Desenvolvedores

### 1. Clone do repositório

```bash
git clone https://github.com/SEU_USUARIO/PedidoFacil.git
cd PedidoFacil
```

### 2. Configurar ambiente

```bash
# Backend
cd backend
cp env.example .env
# Editar .env com suas configurações

# Database (se usar Atlas)
cd ../database
cp config-atlas.example.js config-atlas.js
# Editar config-atlas.js com suas credenciais
```

### 3. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configurar banco de dados

```bash
# MongoDB Local
cd backend
npm run seed

# MongoDB Atlas
cd ..
node setup-atlas.js
```

### 5. Executar aplicação

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm start
```

## 🌐 Deploy em Produção

### Opções de Hosting

1. **Vercel** (Frontend)
2. **Railway** (Backend)
3. **Heroku** (Backend)
4. **DigitalOcean** (Full-stack)
5. **AWS** (Full-stack)

### Variáveis de Ambiente em Produção

Configure as seguintes variáveis no seu provedor de hosting:

```env
# Backend
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_muito_segura
NODE_ENV=production
PORT=5000

# Frontend (se necessário)
REACT_APP_API_URL=https://seu-backend.railway.app
```

## 📝 Checklist Final

Antes de fazer push:

- [ ] `.gitignore` está configurado
- [ ] Arquivos sensíveis não estão no repositório
- [ ] Arquivos de exemplo estão criados
- [ ] README.md está atualizado
- [ ] Todas as funcionalidades estão testadas
- [ ] Credenciais de teste estão documentadas

## 🆘 Troubleshooting

### Erro: "Arquivo sensível foi commitado"

```bash
# Remover arquivo do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch CAMINHO_DO_ARQUIVO" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push
git push origin --force --all
```

### Erro: "MongoDB não conecta"

1. Verificar se o MongoDB está rodando
2. Verificar string de conexão no `.env`
3. Verificar se o IP está liberado (Atlas)

### Erro: "Porta já em uso"

```bash
# Encontrar processo usando a porta
lsof -i :5000  # Linux/macOS
netstat -ano | findstr :5000  # Windows

# Matar processo
kill -9 PID  # Linux/macOS
taskkill /PID PID /F  # Windows
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação no README.md
2. Consulte os logs de erro
3. Abra uma issue no GitHub
4. Entre em contato: suporte@pedidofacil.com

---

**🚀 Projeto pronto para deploy!** 