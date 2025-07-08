const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false // Não retorna a senha nas consultas
  },
  role: {
    type: String,
    enum: ['admin', 'gerente', 'operador'],
    default: 'operador'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoLogin: {
    type: Date
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ ativo: 1 });

// Middleware para criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

// Método para verificar se usuário tem permissão
userSchema.methods.temPermissao = function(permissao) {
  const permissoes = {
    admin: ['admin', 'gerente', 'operador'],
    gerente: ['gerente', 'operador'],
    operador: ['operador']
  };
  
  return permissoes[this.role]?.includes(permissao) || false;
};

// Método para retornar dados públicos do usuário
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.senha;
  return user;
};

module.exports = mongoose.model('User', userSchema); 