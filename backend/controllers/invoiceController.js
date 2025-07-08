const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// Criar nova nota fiscal
exports.createInvoice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      numero,
      serie,
      tipo,
      dataVencimento,
      cliente,
      itens,
      impostos,
      observacoes,
      pedidoId
    } = req.body;

    // Verificar se pedido existe
    const order = await Order.findById(pedidoId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Verificar se já existe nota fiscal para este pedido
    const existingInvoice = await Invoice.findOne({ pedido: pedidoId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma nota fiscal para este pedido'
      });
    }

    const invoice = await Invoice.create({
      numero,
      serie,
      tipo,
      dataVencimento,
      cliente,
      itens,
      impostos,
      observacoes,
      pedido: pedidoId,
      emitidoPor: req.user.id
    });

    await invoice.populate([
      { path: 'pedido', select: 'client produto quantidade valorTotal' },
      { path: 'emitidoPor', select: 'nome email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Nota fiscal criada com sucesso!',
      data: invoice
    });
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar todas as notas fiscais
exports.getInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      tipo,
      startDate,
      endDate,
      search,
      sortBy = 'dataEmissao',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (tipo) filter.tipo = tipo;
    if (startDate || endDate) {
      filter.dataEmissao = {};
      if (startDate) filter.dataEmissao.$gte = new Date(startDate);
      if (endDate) filter.dataEmissao.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { numero: { $regex: search, $options: 'i' } },
        { 'cliente.nome': { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'pedido', select: 'client produto quantidade valorTotal' },
        { path: 'emitidoPor', select: 'nome email' }
      ]
    };

    const invoices = await Invoice.paginate(filter, options);

    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar nota fiscal por ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('pedido', 'client produto quantidade valorTotal')
      .populate('emitidoPor', 'nome email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Nota fiscal não encontrada'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Erro ao buscar nota fiscal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar nota fiscal
exports.updateInvoice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Nota fiscal não encontrada'
      });
    }

    // Verificar se pode ser editada
    if (invoice.status === 'emitida' || invoice.status === 'paga') {
      return res.status(400).json({
        success: false,
        message: 'Nota fiscal já foi emitida e não pode ser editada'
      });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'pedido', select: 'client produto quantidade valorTotal' },
      { path: 'emitidoPor', select: 'nome email' }
    ]);

    res.json({
      success: true,
      message: 'Nota fiscal atualizada com sucesso!',
      data: updatedInvoice
    });
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Emitir nota fiscal
exports.emitInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Nota fiscal não encontrada'
      });
    }

    if (invoice.status !== 'rascunho') {
      return res.status(400).json({
        success: false,
        message: 'Apenas notas fiscais em rascunho podem ser emitidas'
      });
    }

    // Aqui você pode integrar com a API da SEFAZ ou sistema de notas fiscais
    // Por enquanto, apenas atualizamos o status
    invoice.status = 'emitida';
    invoice.dataEmissao = new Date();
    await invoice.save();

    await invoice.populate([
      { path: 'pedido', select: 'client produto quantidade valorTotal' },
      { path: 'emitidoPor', select: 'nome email' }
    ]);

    res.json({
      success: true,
      message: 'Nota fiscal emitida com sucesso!',
      data: invoice
    });
  } catch (error) {
    console.error('Erro ao emitir nota fiscal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Cancelar nota fiscal
exports.cancelInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Nota fiscal não encontrada'
      });
    }

    if (invoice.status === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'Nota fiscal já está cancelada'
      });
    }

    if (invoice.status === 'paga') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar uma nota fiscal paga'
      });
    }

    invoice.status = 'cancelada';
    await invoice.save();

    await invoice.populate([
      { path: 'pedido', select: 'client produto quantidade valorTotal' },
      { path: 'emitidoPor', select: 'nome email' }
    ]);

    res.json({
      success: true,
      message: 'Nota fiscal cancelada com sucesso!',
      data: invoice
    });
  } catch (error) {
    console.error('Erro ao cancelar nota fiscal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Marcar nota fiscal como paga
exports.markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Nota fiscal não encontrada'
      });
    }

    if (invoice.status === 'paga') {
      return res.status(400).json({
        success: false,
        message: 'Nota fiscal já está marcada como paga'
      });
    }

    if (invoice.status === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível marcar como paga uma nota fiscal cancelada'
      });
    }

    invoice.status = 'paga';
    await invoice.save();

    await invoice.populate([
      { path: 'pedido', select: 'client produto quantidade valorTotal' },
      { path: 'emitidoPor', select: 'nome email' }
    ]);

    res.json({
      success: true,
      message: 'Nota fiscal marcada como paga!',
      data: invoice
    });
  } catch (error) {
    console.error('Erro ao marcar nota fiscal como paga:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Estatísticas das notas fiscais
exports.getInvoiceStats = async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      }
    ]);

    const totalInvoices = await Invoice.countDocuments();
    const totalValue = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const vencidas = await Invoice.countDocuments({
      dataVencimento: { $lt: new Date() },
      status: { $nin: ['paga', 'cancelada'] }
    });

    res.json({
      success: true,
      data: {
        statusStats: stats,
        totalInvoices,
        totalValue: totalValue[0]?.total || 0,
        vencidas
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