const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Importar modelos
const User = require('../models/User');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// Dados de exemplo
const users = [
  {
    nome: 'João Silva',
    email: 'admin@pedidofacil.com',
    senha: 'admin123',
    role: 'admin'
  },
  {
    nome: 'Maria Santos',
    email: 'gerente@pedidofacil.com',
    senha: 'gerente123',
    role: 'gerente'
  },
  {
    nome: 'Pedro Oliveira',
    email: 'operador@pedidofacil.com',
    senha: 'operador123',
    role: 'operador'
  },
  {
    nome: 'Ana Costa',
    email: 'ana.costa@pedidofacil.com',
    senha: 'ana123',
    role: 'operador'
  },
  {
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@pedidofacil.com',
    senha: 'carlos123',
    role: 'gerente'
  }
];

const orders = [
  {
    client: 'Empresa ABC Ltda',
    quantidade: 100,
    produto: 'Notebook Dell Inspiron 15',
    valorUnitario: 2850.00,
    valorTotal: 285000.00,
    prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pendente',
    observacoes: 'Pedido urgente - Cliente VIP'
  },
  {
    client: 'Comércio XYZ',
    quantidade: 50,
    produto: 'Mouse Wireless Logitech',
    valorUnitario: 89.90,
    valorTotal: 4495.00,
    prazo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'em_producao',
    observacoes: 'Entrega na sede - Embalagem especial'
  },
  {
    client: 'Distribuidora 123',
    quantidade: 200,
    produto: 'Teclado Mecânico RGB',
    valorUnitario: 299.90,
    valorTotal: 59980.00,
    prazo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'pronto',
    observacoes: 'Produto com embalagem especial'
  },
  {
    client: 'Loja Virtual Tech',
    quantidade: 75,
    produto: 'Monitor LG 24" Full HD',
    valorUnitario: 599.90,
    valorTotal: 44992.50,
    prazo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'pendente',
    observacoes: 'Entrega em horário comercial'
  },
  {
    client: 'Escritório Moderno',
    quantidade: 30,
    produto: 'Impressora HP LaserJet',
    valorUnitario: 1299.90,
    valorTotal: 38997.00,
    prazo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'entregue',
    observacoes: 'Instalação incluída'
  },
  {
    client: 'Startup Inovação',
    quantidade: 25,
    produto: 'Webcam HD 1080p',
    valorUnitario: 159.90,
    valorTotal: 3997.50,
    prazo: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    status: 'em_producao',
    observacoes: 'Produto para home office'
  },
  {
    client: 'Escola Municipal',
    quantidade: 150,
    produto: 'Tablet Samsung Galaxy Tab A',
    valorUnitario: 899.90,
    valorTotal: 134985.00,
    prazo: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'pendente',
    observacoes: 'Projeto educacional'
  },
  {
    client: 'Hospital São Lucas',
    quantidade: 40,
    produto: 'Scanner de Código de Barras',
    valorUnitario: 450.00,
    prazo: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: 'cancelado',
    observacoes: 'Cancelado pelo cliente'
  }
];

const invoices = [
  {
    numero: 'NF001',
    serie: '001',
    tipo: 'saida',
    dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cliente: {
      nome: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      }
    },
    itens: [
      {
        produto: 'Notebook Dell Inspiron 15',
        quantidade: 100,
        valorUnitario: 2850.00
      }
    ],
    impostos: {
      icms: 2850.00,
      pis: 185.25,
      cofins: 855.00
    },
    status: 'emitida'
  },
  {
    numero: 'NF002',
    serie: '001',
    tipo: 'saida',
    dataVencimento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    cliente: {
      nome: 'Comércio XYZ',
      cnpj: '98.765.432/0001-10',
      endereco: {
        logradouro: 'Avenida Principal',
        numero: '456',
        bairro: 'Jardim América',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000'
      }
    },
    itens: [
      {
        produto: 'Mouse Wireless Logitech',
        quantidade: 50,
        valorUnitario: 89.90
      }
    ],
    impostos: {
      icms: 449.50,
      pis: 29.22,
      cofins: 134.85
    },
    status: 'paga'
  },
  {
    numero: 'NF003',
    serie: '001',
    tipo: 'saida',
    dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    cliente: {
      nome: 'Distribuidora 123',
      cnpj: '11.222.333/0001-44',
      endereco: {
        logradouro: 'Rua do Comércio',
        numero: '789',
        bairro: 'Centro Empresarial',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        cep: '30000-000'
      }
    },
    itens: [
      {
        produto: 'Teclado Mecânico RGB',
        quantidade: 200,
        valorUnitario: 299.90
      }
    ],
    impostos: {
      icms: 5998.00,
      pis: 389.87,
      cofins: 1799.40
    },
    status: 'rascunho'
  },
  {
    numero: 'NF004',
    serie: '001',
    tipo: 'saida',
    dataVencimento: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    cliente: {
      nome: 'Loja Virtual Tech',
      cnpj: '55.666.777/0001-88',
      endereco: {
        logradouro: 'Avenida Digital',
        numero: '321',
        bairro: 'Tech Park',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '80000-000'
      }
    },
    itens: [
      {
        produto: 'Monitor LG 24" Full HD',
        quantidade: 75,
        valorUnitario: 599.90
      }
    ],
    impostos: {
      icms: 4499.25,
      pis: 292.45,
      cofins: 1349.78
    },
    status: 'emitida'
  },
  {
    numero: 'NF005',
    serie: '001',
    tipo: 'saida',
    dataVencimento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Vencida
    cliente: {
      nome: 'Escritório Moderno',
      cnpj: '99.888.777/0001-66',
      endereco: {
        logradouro: 'Rua dos Escritórios',
        numero: '555',
        bairro: 'Centro Empresarial',
        cidade: 'Salvador',
        estado: 'BA',
        cep: '40000-000'
      }
    },
    itens: [
      {
        produto: 'Impressora HP LaserJet',
        quantidade: 30,
        valorUnitario: 1299.90
      }
    ],
    impostos: {
      icms: 3899.70,
      pis: 253.48,
      cofins: 1169.91
    },
    status: 'emitida'
  }
];

// Função para popular o banco
const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Conectado ao MongoDB');

    // Limpar dados existentes
    await User.deleteMany({});
    await Order.deleteMany({});
    await Invoice.deleteMany({});

    console.log('🧹 Dados anteriores removidos');

    // Criar usuários
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Usuário criado: ${user.nome} (${user.email})`);
    }

    // Criar pedidos
    const createdOrders = [];
    for (const orderData of orders) {
      const order = await Order.create({
        ...orderData,
        criadoPor: createdUsers[0]._id // Admin cria os pedidos
      });
      createdOrders.push(order);
      console.log(`📦 Pedido criado: ${order.client} - ${order.produto}`);
    }

    // Criar notas fiscais
    for (const invoiceData of invoices) {
      const invoice = await Invoice.create({
        ...invoiceData,
        pedido: createdOrders[0]._id,
        emitidoPor: createdUsers[0]._id
      });
      console.log(`🧾 Nota fiscal criada: ${invoice.numero}`);
    }

    console.log('✅ Banco de dados populado com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('👤 Admin: admin@pedidofacil.com / admin123');
    console.log('👤 Gerente: gerente@pedidofacil.com / gerente123');
    console.log('👤 Operador: operador@pedidofacil.com / operador123');

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    process.exit(0);
  }
};

// Executar se for chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 