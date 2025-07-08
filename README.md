# 🚀 PedidoFácil

Sistema completo de gestão de pedidos e notas fiscais desenvolvido com as mais modernas tecnologias.

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- Sistema de login seguro com JWT
- Controle de acesso baseado em roles (Admin, Gerente, Operador)
- Criptografia de senhas com bcrypt
- Middleware de autenticação e autorização

### 📦 Gestão de Pedidos
- Criação, edição e exclusão de pedidos
- Controle de status (Pendente, Em Produção, Pronto, Entregue, Cancelado)
- Cálculo automático de valores
- Filtros e busca avançada
- Paginação de resultados

### 🧾 Gestão de Notas Fiscais
- Criação de notas fiscais vinculadas aos pedidos
- Controle de status (Rascunho, Emitida, Cancelada, Paga)
- Cálculo automático de impostos
- Validação de dados fiscais
- Controle de vencimento

### 👥 Gestão de Usuários
- Cadastro e gerenciamento de usuários
- Controle de permissões por role
- Perfil de usuário personalizável
- Histórico de ações

### 📊 Dashboard
- Estatísticas em tempo real
- Gráficos de status de pedidos e notas fiscais
- Indicadores de performance
- Ações rápidas

## 🛠️ Tecnologias

### Backend
- **Node.js** com Express
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para criptografia
- **express-validator** para validações
- **helmet** e **cors** para segurança
- **mongoose-paginate-v2** para paginação

### Frontend
- **React 18** com Hooks
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **Lucide React** para ícones
- **React Hot Toast** para notificações

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- MongoDB
- npm ou yarn

### Banco de Dados (MongoDB)

#### MongoDB Atlas (Recomendado)
```bash
# Configuração automática
node setup-atlas.js
```

#### MongoDB Local

#### Opção 1: Instalação Automática
```bash
# Linux/macOS
chmod +x setup-database.sh
./setup-database.sh

# Windows
setup-database.bat
```

#### Opção 2: Instalação Manual
```bash
# 1. Instalar dependência
npm install mongodb

# 2. Importar dados
node database/import-mongodb.js

# 3. Ou usar o script de seed do backend
cd backend
npm run seed
```

#### Dados Incluídos
- **5 usuários** com diferentes níveis de acesso
- **8 pedidos** com produtos variados
- **5 notas fiscais** em diferentes status

#### Credenciais de Acesso
- **Admin:** admin@pedidofacil.com / admin123
- **Gerente:** gerente@pedidofacil.com / gerente123
- **Operador:** operador@pedidofacil.com / operador123

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd PedidoFacil
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp env.example .env
# Edite o arquivo .env com suas configurações
npm run seed  # Popula o banco com dados iniciais
npm run dev   # Inicia o servidor de desenvolvimento
```

### 3. Configure o Frontend
```bash
cd frontend
npm install
npm start     # Inicia o servidor de desenvolvimento
```

### 4. Acesse a aplicação
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👤 Credenciais de Demonstração

### Admin
- **Email:** admin@pedidofacil.com
- **Senha:** admin123

### Gerente
- **Email:** gerente@pedidofacil.com
- **Senha:** gerente123

### Operador
- **Email:** operador@pedidofacil.com
- **Senha:** operador123

## 📁 Estrutura do Projeto

```
PedidoFacil/
├── backend/
│   ├── controllers/     # Controladores da API
│   ├── models/         # Modelos do MongoDB
│   ├── routes/         # Rotas da API
│   ├── middleware/     # Middlewares customizados
│   ├── config/         # Configurações
│   ├── scripts/        # Scripts utilitários
│   └── server.js       # Servidor principal
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── contexts/   # Contextos React
│   │   └── App.js      # Componente principal
│   └── package.json
├── database/
│   ├── pedidofacil-db.json    # Dados completos para importação
│   ├── import-mongodb.js      # Script de importação (local)
│   ├── import-atlas.js        # Script de importação (Atlas)
│   ├── config-atlas.js        # Configuração MongoDB Atlas
│   └── README.md              # Documentação do banco
├── setup-atlas.js             # Configuração automática Atlas
├── setup-database.sh          # Script de instalação (Linux/macOS)
├── setup-database.bat         # Script de instalação (Windows)
└── README.md
```

## 🔧 Configuração do Ambiente

### ⚠️ Segurança - Arquivos Sensíveis

**IMPORTANTE:** Os seguintes arquivos contêm informações sensíveis e NÃO devem ser commitados:

- `.env` (variáveis de ambiente)
- `database/config-atlas.js` (configuração do MongoDB Atlas)
- `backend/.env` (configuração do backend)

Use os arquivos de exemplo fornecidos:
- `backend/env.example` → copie para `backend/.env`
- `database/config-atlas.example.js` → copie para `database/config-atlas.js`

### Variáveis de Ambiente (.env)
```env
# Banco de Dados
MONGO_URI=mongodb://localhost:27017/pedidofacil

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

## 📝 API Endpoints

### Autenticação
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/:id` - Buscar pedido
- `PUT /api/orders/:id` - Atualizar pedido
- `DELETE /api/orders/:id` - Deletar pedido
- `GET /api/orders/stats` - Estatísticas

### Notas Fiscais
- `GET /api/invoices` - Listar notas fiscais
- `POST /api/invoices` - Criar nota fiscal
- `GET /api/invoices/:id` - Buscar nota fiscal
- `PUT /api/invoices/:id` - Atualizar nota fiscal
- `PATCH /api/invoices/:id/emitir` - Emitir nota fiscal
- `PATCH /api/invoices/:id/cancelar` - Cancelar nota fiscal
- `PATCH /api/invoices/:id/pagar` - Marcar como paga

## 🎨 Interface

A interface foi desenvolvida com foco na usabilidade e experiência do usuário:

- **Design Responsivo** - Funciona em desktop, tablet e mobile
- **Tema Moderno** - Interface limpa e profissional
- **Navegação Intuitiva** - Sidebar com navegação clara
- **Feedback Visual** - Notificações e estados de loading
- **Acessibilidade** - Componentes acessíveis

## 🔒 Segurança

- Autenticação JWT
- Criptografia de senhas
- Validação de dados
- Rate limiting
- Headers de segurança
- CORS configurado

## 📈 Próximas Funcionalidades

- [ ] Relatórios avançados
- [ ] Integração com SEFAZ
- [ ] Upload de arquivos
- [ ] Notificações por email
- [ ] Backup automático
- [ ] API para terceiros
- [ ] App mobile

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@pedidofacil.com ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para simplificar a gestão empresarial**
