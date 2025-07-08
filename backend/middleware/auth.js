const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticação
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await User.findById(decoded.id).select('-senha');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    console.error('Erro na autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware de autorização
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para acessar este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar se é o próprio usuário ou admin
exports.ownResourceOrAdmin = (resourceUserIdField = 'criadoPor') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Admin pode acessar qualquer recurso
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar se o recurso pertence ao usuário
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    if (resourceUserId && resourceUserId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para acessar este recurso'
      });
    }

    next();
  };
}; 