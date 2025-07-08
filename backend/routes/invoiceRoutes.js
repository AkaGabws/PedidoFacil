const express = require('express');
const { body } = require('express-validator');
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  emitInvoice,
  cancelInvoice,
  markAsPaid,
  getInvoiceStats
} = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validações
const invoiceValidation = [
  body('numero')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Número da nota fiscal é obrigatório'),
  body('serie')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Série da nota fiscal é obrigatória'),
  body('tipo')
    .isIn(['entrada', 'saida'])
    .withMessage('Tipo deve ser entrada ou saida'),
  body('dataVencimento')
    .isISO8601()
    .withMessage('Data de vencimento deve ser válida'),
  body('cliente.nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do cliente é obrigatório'),
  body('cliente.cnpj')
    .optional()
    .isLength({ min: 14, max: 18 })
    .withMessage('CNPJ deve ter entre 14 e 18 caracteres'),
  body('cliente.cpf')
    .optional()
    .isLength({ min: 11, max: 14 })
    .withMessage('CPF deve ter entre 11 e 14 caracteres'),
  body('itens')
    .isArray({ min: 1 })
    .withMessage('Pelo menos um item é obrigatório'),
  body('itens.*.produto')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome do produto é obrigatório'),
  body('itens.*.quantidade')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que zero'),
  body('itens.*.valorUnitario')
    .isFloat({ min: 0 })
    .withMessage('Valor unitário deve ser um número positivo'),
  body('impostos.icms')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ICMS deve ser um número positivo'),
  body('impostos.pis')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('PIS deve ser um número positivo'),
  body('impostos.cofins')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('COFINS deve ser um número positivo'),
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem ter mais de 500 caracteres'),
  body('pedidoId')
    .isMongoId()
    .withMessage('ID do pedido deve ser válido')
];

// Rotas
router.post('/', authenticate, authorize(['admin', 'gerente']), invoiceValidation, createInvoice);
router.get('/', authenticate, getInvoices);
router.get('/stats', authenticate, authorize(['admin', 'gerente']), getInvoiceStats);
router.get('/:id', authenticate, getInvoiceById);
router.put('/:id', authenticate, authorize(['admin', 'gerente']), invoiceValidation, updateInvoice);
router.patch('/:id/emitir', authenticate, authorize(['admin', 'gerente']), emitInvoice);
router.patch('/:id/cancelar', authenticate, authorize(['admin', 'gerente']), cancelInvoice);
router.patch('/:id/pagar', authenticate, authorize(['admin', 'gerente']), markAsPaid);

module.exports = router; 