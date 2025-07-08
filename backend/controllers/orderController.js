const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// Criar novo pedido
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      client,
      quantidade,
      produto,
      valorUnitario,
      prazo,
      observacoes
    } = req.body;

    const newOrder = await Order.create({
      client,
      quantidade,
      produto,
      valorUnitario,
      prazo,
      observacoes,
      criadoPor: req.user.id
    });

    await newOrder.populate('criadoPor', 'nome email');

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso!',
      data: newOrder
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Buscar todos os pedidos com filtros
exports.getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      client,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    // Filtros
    if (status) filter.status = status;
    if (client) filter.client = { $regex: client, $options: 'i' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Ordenação
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'criadoPor', select: 'nome email' },
        { path: 'atualizadoPor', select: 'nome email' }
      ]
    };

    const orders = await Order.paginate(filter, options);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('criadoPor', 'nome email')
      .populate('atualizadoPor', 'nome email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar pedido
exports.updateOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Verificar permissões
    if (req.user.role !== 'admin' && order.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para editar este pedido'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        atualizadoPor: req.user.id
      },
      { new: true, runValidators: true }
    ).populate('criadoPor', 'nome email')
     .populate('atualizadoPor', 'nome email');

    res.json({
      success: true,
      message: 'Pedido atualizado com sucesso!',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar pedido
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Verificar permissões
    if (req.user.role !== 'admin' && order.criadoPor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para deletar este pedido'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pedido deletado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Estatísticas dos pedidos
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$valorTotal' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalValue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$valorTotal' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalOrders,
        totalValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};