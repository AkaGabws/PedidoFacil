const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configurações
const MONGODB_URI = 'mongodb+srv://gabrielallves44:SUA_SENHA@bank.qmpue.mongodb.net/pedidofacil?retryWrites=true&w=majority';
const DATABASE_NAME = 'pedidofacil';

async function importDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    const db = client.db(DATABASE_NAME);

    // Ler arquivo de dados
    const dataPath = path.join(__dirname, 'pedidofacil-db.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('📁 Iniciando importação dos dados...');

    // Importar usuários
    if (data.collections.users) {
      const usersCollection = db.collection('users');
      await usersCollection.deleteMany({}); // Limpar dados existentes
      await usersCollection.insertMany(data.collections.users);
      console.log(`👤 ${data.collections.users.length} usuários importados`);
    }

    // Importar pedidos
    if (data.collections.orders) {
      const ordersCollection = db.collection('orders');
      await ordersCollection.deleteMany({}); // Limpar dados existentes
      await ordersCollection.insertMany(data.collections.orders);
      console.log(`📦 ${data.collections.orders.length} pedidos importados`);
    }

    // Importar notas fiscais
    if (data.collections.invoices) {
      const invoicesCollection = db.collection('invoices');
      await invoicesCollection.deleteMany({}); // Limpar dados existentes
      await invoicesCollection.insertMany(data.collections.invoices);
      console.log(`🧾 ${data.collections.invoices.length} notas fiscais importadas`);
    }

    console.log('\n✅ Importação concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`  - Usuários: ${data.collections.users?.length || 0}`);
    console.log(`  - Pedidos: ${data.collections.orders?.length || 0}`);
    console.log(`  - Notas Fiscais: ${data.collections.invoices?.length || 0}`);

    console.log('\n🔑 Credenciais de acesso:');
    console.log('  Admin: admin@pedidofacil.com / admin123');
    console.log('  Gerente: gerente@pedidofacil.com / gerente123');
    console.log('  Operador: operador@pedidofacil.com / operador123');

  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
  } finally {
    await client.close();
    console.log('🔌 Desconectado do MongoDB');
  }
}

// Executar importação
importDatabase(); 