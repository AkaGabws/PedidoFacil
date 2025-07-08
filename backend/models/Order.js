const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: { 
    type: String, 
    required: [true, 'Nome do cliente é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do cliente não pode ter mais de 100 caracteres']
  },
  quantidade: { 
    type: Number, 
    required: [true, 'Quantidade é obrigatória'],
    min: [1, 'Quantidade deve ser maior que zero']
  },
  produto: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome do produto não pode ter mais de 200 caracteres']
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
  },
  prazo: { 
    type: Date, 
    required: [true, 'Prazo de entrega é obrigatório'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Prazo deve ser uma data futura'
    }
  },
  status: {
    type: String,
    enum: ['pendente', 'em_producao', 'pronto', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  notaFiscal: {
    numero: { type: String },
    dataEmissao: { type: Date },
    arquivo: { type: String }
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem ter mais de 500 caracteres']
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  atualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para melhor performance
orderSchema.index({ client: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ prazo: 1 });
orderSchema.index({ criadoPor: 1 });

// Virtual para calcular valor total automaticamente
orderSchema.virtual('valorCalculado').get(function() {
  return this.quantidade * this.valorUnitario;
});

// Middleware para calcular valor total antes de salvar
orderSchema.pre('save', function(next) {
  if (this.isModified('quantidade') || this.isModified('valorUnitario')) {
    this.valorTotal = this.quantidade * this.valorUnitario;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
