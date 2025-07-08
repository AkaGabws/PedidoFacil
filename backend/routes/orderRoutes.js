const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validações
const orderValidation = [
  body('client')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do cliente deve ter entre 2 e 100 caracteres'),
  body('quantidade')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que zero'),
  body('produto')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome do produto deve ter entre 2 e 200 caracteres'),
  body('valorUnitario')
    .isFloat({ min: 0 })
    .withMessage('Valor unitário deve ser um número positivo'),
  body('prazo')
    .isISO8601()
    .withMessage('Prazo deve ser uma data válida')
    .custom(value => {
      if (new Date(value) <= new Date()) {
        throw new Error('Prazo deve ser uma data futura');
      }
      return true;
    }),
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem ter mais de 500 caracteres')
];

// Rotas
router.post('/', authenticate, orderValidation, createOrder);
router.get('/', authenticate, getOrders);
router.get('/stats', authenticate, authorize(['admin', 'gerente']), getOrderStats);
router.get('/:id', authenticate, getOrderById);
router.put('/:id', authenticate, orderValidation, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;
