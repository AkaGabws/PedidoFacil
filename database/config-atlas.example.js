// Configuração de exemplo para MongoDB Atlas
// Copie este arquivo para config-atlas.js e preencha com suas credenciais
const MONGODB_ATLAS_CONFIG = {
  // Sua string de conexão do MongoDB Atlas
  uri: 'mongodb+srv://SEU_USUARIO:SUA_SENHA@SEU_CLUSTER.mongodb.net/pedidofacil?retryWrites=true&w=majority',
  
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

module.exports = MONGODB_ATLAS_CONFIG; 