const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const config = require('./config-atlas');

async function importToAtlas() {
  const client = new MongoClient(config.uri, config.options);

  try {
    console.log('🔗 Conectando ao MongoDB Atlas...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas');

    const db = client.db(config.database);

    // Ler arquivo de dados
    const dataPath = path.join(__dirname, 'pedidofacil-db.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('📁 Iniciando importação dos dados no Atlas...');

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

    console.log('\n✅ Importação no Atlas concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`  - Usuários: ${data.collections.users?.length || 0}`);
    console.log(`  - Pedidos: ${data.collections.orders?.length || 0}`);
    console.log(`  - Notas Fiscais: ${data.collections.invoices?.length || 0}`);

    console.log('\n🔑 Credenciais de acesso:');
    console.log('  Admin: admin@pedidofacil.com / admin123');
    console.log('  Gerente: gerente@pedidofacil.com / gerente123');
    console.log('  Operador: operador@pedidofacil.com / operador123');

    console.log('\n🌐 URL do Atlas:');
    console.log('  https://cloud.mongodb.com/');

  } catch (error) {
    console.error('❌ Erro durante a importação no Atlas:', error);
    console.log('\n💡 Dicas para resolver:');
    console.log('  1. Verifique se a senha está correta no config-atlas.js');
    console.log('  2. Confirme se o IP está liberado no Atlas');
    console.log('  3. Verifique se o usuário tem permissões de escrita');
  } finally {
    await client.close();
    console.log('🔌 Desconectado do MongoDB Atlas');
  }
}

// Executar importação
importToAtlas(); 