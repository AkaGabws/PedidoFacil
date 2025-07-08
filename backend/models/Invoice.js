const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: [true, 'Número da nota fiscal é obrigatório'],
    unique: true,
    trim: true
  },
  serie: {
    type: String,
    required: [true, 'Série da nota fiscal é obrigatória'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['entrada', 'saida'],
    required: [true, 'Tipo da nota fiscal é obrigatório']
  },
  dataEmissao: {
    type: Date,
    required: [true, 'Data de emissão é obrigatória'],
    default: Date.now
  },
  dataVencimento: {
    type: Date,
    required: [true, 'Data de vencimento é obrigatória']
  },
  cliente: {
    nome: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório'],
      trim: true
    },
    cnpj: {
      type: String,
      trim: true
    },
    cpf: {
      type: String,
      trim: true
    },
    endereco: {
      logradouro: String,
      numero: String,
      complemento: String,
      bairro: String,
      cidade: String,
      estado: String,
      cep: String
    }
  },
  itens: [{
    produto: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true
    },
    quantidade: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: [1, 'Quantidade deve ser maior que zero']
    },
    valorUnitario: {
      type: Number,
      required: [true, 'Valor unitário é obrigatório'],
      min: [0, 'Valor unitário não pode ser negativo']
    },
    valorTotal: {
      type: Number,
      required: true,
      min: [0, 'Valor total não pode ser negativo']
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal não pode ser negativo']
  },
  impostos: {
    icms: { type: Number, default: 0 },
    pis: { type: Number, default: 0 },
    cofins: { type: Number, default: 0 }
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total não pode ser negativo']
  },
  status: {
    type: String,
    enum: ['rascunho', 'emitida', 'cancelada', 'paga'],
    default: 'rascunho'
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem ter mais de 500 caracteres']
  },
  arquivo: {
    type: String // Caminho para o arquivo PDF
  },
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Pedido é obrigatório']
  },
  emitidoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
invoiceSchema.index({ numero: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dataEmissao: 1 });
invoiceSchema.index({ pedido: 1 });
invoiceSchema.index({ emitidoPor: 1 });

// Middleware para calcular totais antes de salvar
invoiceSchema.pre('save', function(next) {
  // Calcular subtotal dos itens
  this.subtotal = this.itens.reduce((total, item) => {
    item.valorTotal = item.quantidade * item.valorUnitario;
    return total + item.valorTotal;
  }, 0);
  
  // Calcular impostos
  const totalImpostos = this.impostos.icms + this.impostos.pis + this.impostos.cofins;
  
  // Calcular total final
  this.total = this.subtotal + totalImpostos;
  
  next();
});

// Virtual para verificar se está vencida
invoiceSchema.virtual('vencida').get(function() {
  return this.dataVencimento < new Date() && this.status !== 'paga';
});

// Virtual para dias até vencimento
invoiceSchema.virtual('diasVencimento').get(function() {
  const hoje = new Date();
  const vencimento = new Date(this.dataVencimento);
  const diffTime = vencimento - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

module.exports = mongoose.model('Invoice', invoiceSchema); 