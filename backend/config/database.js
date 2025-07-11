const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Plugin de paginação para todos os modelos
mongoose.plugin(mongoosePaginate);

// Configurações do MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 