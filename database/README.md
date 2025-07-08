# 🗄️ Banco de Dados - PedidoFácil

Este diretório contém os arquivos necessários para configurar e popular o banco de dados MongoDB do sistema PedidoFácil.

## 📁 Arquivos

- `pedidofacil-db.json` - Dados completos em formato JSON
- `import-mongodb.js` - Script para importar dados no MongoDB local
- `import-atlas.js` - Script para importar dados no MongoDB Atlas
- `config-atlas.js` - Configuração para MongoDB Atlas
- `README.md` - Esta documentação

## 🚀 Como Importar os Dados

### MongoDB Atlas (Recomendado)

#### Configuração Automática
```bash
# Executar script de configuração
node setup-atlas.js
```

#### Configuração Manual
1. **Editar arquivo de configuração:**
   ```bash
   # Editar database/config-atlas.js
   # Substituir SUA_SENHA pela sua senha real
   ```

2. **Executar importação:**
   ```bash
   node database/import-atlas.js
   ```

### MongoDB Local

#### Opção 1: Usando o Script de Importação

1. **Instalar dependência do MongoDB:**
   ```bash
   npm install mongodb
   ```

2. **Executar o script de importação:**
   ```bash
   node database/import-mongodb.js
   ```

### Opção 2: Usando o Script de Seed do Backend

1. **Configurar o ambiente:**
   ```bash
   cd backend
   cp env.example .env
   # Editar .env com suas configurações
   ```

2. **Executar o seed:**
   ```bash
   npm run seed
   ```

### Opção 3: Importação Manual no MongoDB

1. **Conectar ao MongoDB:**
   ```bash
   mongosh
   ```

2. **Criar e usar o banco:**
   ```javascript
   use pedidofacil
   ```

3. **Importar dados:**
   ```javascript
   // Importar usuários
   db.users.insertMany([
     // ... dados do arquivo JSON
   ])

   // Importar pedidos
   db.orders.insertMany([
     // ... dados do arquivo JSON
   ])

   // Importar notas fiscais
   db.invoices.insertMany([
     // ... dados do arquivo JSON
   ])
   ```

## 📊 Dados Incluídos

### 👤 Usuários (5 registros)
- **Admin:** João Silva (admin@pedidofacil.com)
- **Gerente:** Maria Santos (gerente@pedidofacil.com)
- **Operador:** Pedro Oliveira (operador@pedidofacil.com)
- **Operador:** Ana Costa (ana.costa@pedidofacil.com)
- **Gerente:** Carlos Ferreira (carlos.ferreira@pedidofacil.com)

### 📦 Pedidos (8 registros)
- Notebook Dell Inspiron 15 (100 unidades)
- Mouse Wireless Logitech (50 unidades)
- Teclado Mecânico RGB (200 unidades)
- Monitor LG 24" Full HD (75 unidades)
- Impressora HP LaserJet (30 unidades)
- Webcam HD 1080p (25 unidades)
- Tablet Samsung Galaxy Tab A (150 unidades)
- Scanner de Código de Barras (40 unidades)

### 🧾 Notas Fiscais (5 registros)
- NF001 - Empresa ABC Ltda (Emitida)
- NF002 - Comércio XYZ (Paga)
- NF003 - Distribuidora 123 (Rascunho)
- NF004 - Loja Virtual Tech (Emitida)
- NF005 - Escritório Moderno (Emitida - Vencida)

## 🔑 Credenciais de Acesso

### Admin
- **Email:** admin@pedidofacil.com
- **Senha:** admin123
- **Permissões:** Total acesso ao sistema

### Gerente
- **Email:** gerente@pedidofacil.com
- **Senha:** gerente123
- **Permissões:** Gerenciar pedidos e notas fiscais

### Operador
- **Email:** operador@pedidofacil.com
- **Senha:** operador123
- **Permissões:** Visualizar e criar pedidos

## 🏗️ Estrutura do Banco

### Collection: users
```javascript
{
  _id: ObjectId,
  nome: String,
  email: String,
  senha: String (criptografada),
  role: String (admin|gerente|operador),
  ativo: Boolean,
  ultimoLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: orders
```javascript
{
  _id: ObjectId,
  client: String,
  quantidade: Number,
  produto: String,
  valorUnitario: Number,
  valorTotal: Number,
  prazo: Date,
  status: String (pendente|em_producao|pronto|entregue|cancelado),
  observacoes: String,
  criadoPor: ObjectId (ref: users),
  atualizadoPor: ObjectId (ref: users),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: invoices
```javascript
{
  _id: ObjectId,
  numero: String,
  serie: String,
  tipo: String (entrada|saida),
  dataEmissao: Date,
  dataVencimento: Date,
  cliente: {
    nome: String,
    cnpj: String,
    endereco: {
      logradouro: String,
      numero: String,
      bairro: String,
      cidade: String,
      estado: String,
      cep: String
    }
  },
  itens: [{
    produto: String,
    quantidade: Number,
    valorUnitario: Number,
    valorTotal: Number
  }],
  subtotal: Number,
  impostos: {
    icms: Number,
    pis: Number,
    cofins: Number
  },
  total: Number,
  status: String (rascunho|emitida|cancelada|paga),
  pedido: ObjectId (ref: orders),
  emitidoPor: ObjectId (ref: users),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configurações

### Índices Recomendados
```javascript
// Usuários
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "ativo": 1 })

// Pedidos
db.orders.createIndex({ "client": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "prazo": 1 })
db.orders.createIndex({ "criadoPor": 1 })

// Notas Fiscais
db.invoices.createIndex({ "numero": 1 }, { unique: true })
db.invoices.createIndex({ "status": 1 })
db.invoices.createIndex({ "dataEmissao": 1 })
db.invoices.createIndex({ "pedido": 1 })
db.invoices.createIndex({ "emitidoPor": 1 })
```

## 🚨 Importante

1. **Senhas:** As senhas estão criptografadas com bcrypt
2. **IDs:** Os ObjectIds são fixos para facilitar relacionamentos
3. **Datas:** Todas as datas estão em formato ISO
4. **Valores:** Valores monetários estão em centavos ou como números decimais

## 🔄 Backup e Restore

### Backup
```bash
mongodump --db pedidofacil --out ./backup
```

### Restore
```bash
mongorestore --db pedidofacil ./backup/pedidofacil
```

## 📞 Suporte

Se encontrar problemas com a importação:

1. Verifique se o MongoDB está rodando
2. Confirme se a porta 27017 está livre
3. Verifique as permissões de acesso ao banco
4. Consulte os logs de erro no terminal

---

**Banco de dados pronto para uso! 🎉** 