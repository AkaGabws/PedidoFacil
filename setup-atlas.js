#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuração do MongoDB Atlas - PedidoFácil');
console.log('');

// Função para fazer perguntas
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupAtlas() {
  try {
    console.log('📝 Vamos configurar sua conexão com o MongoDB Atlas');
    console.log('');

    // Solicitar senha
    const password = await askQuestion('🔐 Digite sua senha do MongoDB Atlas: ');
    
    if (!password) {
      console.log('❌ Senha é obrigatória!');
      rl.close();
      return;
    }

    // Atualizar arquivo de configuração do Atlas
    const configPath = path.join(__dirname, 'database', 'config-atlas.js');
    const configContent = `// Configuração para MongoDB Atlas
const MONGODB_ATLAS_CONFIG = {
  // Sua string de conexão do MongoDB Atlas
  uri: 'mongodb+srv://gabrielallves44:${password}@bank.qmpue.mongodb.net/pedidofacil?retryWrites=true&w=majority',
  
  // Nome do banco de dados
  database: 'pedidofacil',
  
  // Opções de conexão
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

module.exports = MONGODB_ATLAS_CONFIG;`;

    fs.writeFileSync(configPath, configContent);
    console.log('✅ Arquivo de configuração atualizado');

    // Atualizar arquivo .env do backend
    const envPath = path.join(__dirname, 'backend', '.env');
    const envContent = `# Configurações do Banco de Dados
# MongoDB Atlas
MONGO_URI=mongodb+srv://gabrielallves44:${password}@bank.qmpue.mongodb.net/pedidofacil?retryWrites=true&w=majority

# Configurações do Servidor
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=sua_chave_secreta_muito_segura_aqui

# Configurações de Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Configurações de Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env do backend atualizado');

    // Perguntar se quer importar dados
    const importData = await askQuestion('📁 Deseja importar os dados de exemplo agora? (s/n): ');
    
    if (importData.toLowerCase() === 's' || importData.toLowerCase() === 'sim') {
      console.log('');
      console.log('📦 Instalando dependência mongodb...');
      
      // Verificar se node_modules existe
      if (!fs.existsSync('node_modules')) {
        const { execSync } = require('child_process');
        execSync('npm install mongodb', { stdio: 'inherit' });
      }
      
      console.log('📁 Importando dados no Atlas...');
      const { execSync } = require('child_process');
      execSync('node database/import-atlas.js', { stdio: 'inherit' });
    }

    console.log('');
    console.log('🎉 Configuração concluída!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Inicie o backend: cd backend && npm install && npm run dev');
    console.log('2. Inicie o frontend: cd frontend && npm install && npm start');
    console.log('3. Acesse: http://localhost:3000');
    console.log('');
    console.log('🔑 Credenciais de acesso:');
    console.log('  Admin: admin@pedidofacil.com / admin123');
    console.log('  Gerente: gerente@pedidofacil.com / gerente123');
    console.log('  Operador: operador@pedidofacil.com / operador123');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  } finally {
    rl.close();
  }
}

// Executar configuração
setupAtlas(); 