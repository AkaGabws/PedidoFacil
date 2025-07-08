const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validações
const userValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['admin', 'gerente', 'operador'])
    .withMessage('Role deve ser admin, gerente ou operador')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const profileValidation = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ser válido'),
  body('senha')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Rotas públicas
router.post('/register', userValidation, register);
router.post('/login', loginValidation, login);

// Rotas protegidas
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, profileValidation, updateProfile);

// Rotas de administração (apenas admin)
router.get('/', authenticate, authorize(['admin']), getUsers);
router.get('/:id', authenticate, authorize(['admin']), getUserById);
router.put('/:id', authenticate, authorize(['admin']), userValidation, updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router; 