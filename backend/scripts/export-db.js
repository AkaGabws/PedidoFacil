const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Importar modelos
const User = require('../models/User');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// Função para exportar dados
const exportDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Conectado ao MongoDB');

    // Criar pasta de exportação se não existir
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Exportar usuários
    const users = await User.find({}).select('-senha');
    fs.writeFileSync(
      path.join(exportDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`👤 ${users.length} usuários exportados`);

    // Exportar pedidos
    const orders = await Order.find({})
      .populate('criadoPor', 'nome email')
      .populate('atualizadoPor', 'nome email');
    fs.writeFileSync(
      path.join(exportDir, 'orders.json'),
      JSON.stringify(orders, null, 2)
    );
    console.log(`📦 ${orders.length} pedidos exportados`);

    // Exportar notas fiscais
    const invoices = await Invoice.find({})
      .populate('pedido', 'client produto quantidade valorTotal')
      .populate('emitidoPor', 'nome email');
    fs.writeFileSync(
      path.join(exportDir, 'invoices.json'),
      JSON.stringify(invoices, null, 2)
    );
    console.log(`🧾 ${invoices.length} notas fiscais exportadas`);

    // Criar arquivo de estatísticas
    const stats = {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalInvoices: invoices.length,
      exportDate: new Date().toISOString(),
      database: process.env.MONGO_URI
    };

    fs.writeFileSync(
      path.join(exportDir, 'stats.json'),
      JSON.stringify(stats, null, 2)
    );

    console.log('✅ Exportação concluída!');
    console.log(`📁 Arquivos salvos em: ${exportDir}`);
    console.log('\n📋 Arquivos criados:');
    console.log('  - users.json (Usuários)');
    console.log('  - orders.json (Pedidos)');
    console.log('  - invoices.json (Notas Fiscais)');
    console.log('  - stats.json (Estatísticas)');

  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    process.exit(0);
  }
};

// Executar se for chamado diretamente
if (require.main === module) {
  exportDatabase();
}

module.exports = exportDatabase; 