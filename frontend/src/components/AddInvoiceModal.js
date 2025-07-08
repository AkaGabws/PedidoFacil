import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AddInvoiceModal = ({ isOpen, onClose, onInvoiceAdded }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    numero: '',
    serie: '001',
    tipo: 'saida',
    dataVencimento: '',
    pedido: '',
    cliente: {
      nome: '',
      cnpj: '',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    },
    itens: [{
      produto: '',
      quantidade: '',
      valorUnitario: ''
    }]
  });

  // Buscar pedidos disponíveis
  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Garantir que orders seja sempre um array
        const ordersArray = Array.isArray(data) ? data : (data.orders || data.docs || []);
        setOrders(ordersArray);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setOrders([]); // Em caso de erro, definir como array vazio
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name.includes('endereco.')) {
      const field = name.split('endereco.')[1];
      setFormData(prev => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          endereco: {
            ...prev.cliente.endereco,
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePedidoChange = (e) => {
    const orderId = e.target.value;
    const selectedOrder = orders.find(order => order._id === orderId);
    
    if (selectedOrder) {
      setFormData(prev => ({
        ...prev,
        pedido: orderId,
        cliente: {
          ...prev.cliente,
          nome: selectedOrder.client
        },
        itens: [{
          produto: selectedOrder.produto,
          quantidade: selectedOrder.quantidade,
          valorUnitario: selectedOrder.valorUnitario
        }]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          dataVencimento: new Date(formData.dataVencimento),
          itens: formData.itens.map(item => ({
            ...item,
            quantidade: parseInt(item.quantidade),
            valorUnitario: parseFloat(item.valorUnitario),
            valorTotal: parseInt(item.quantidade) * parseFloat(item.valorUnitario)
          }))
        })
      });

      if (response.ok) {
        const newInvoice = await response.json();
        onInvoiceAdded(newInvoice);
        onClose();
        setFormData({
          numero: '',
          serie: '001',
          tipo: 'saida',
          dataVencimento: '',
          pedido: '',
          cliente: {
            nome: '',
            cnpj: '',
            endereco: {
              logradouro: '',
              numero: '',
              bairro: '',
              cidade: '',
              estado: '',
              cep: ''
            }
          },
          itens: [{
            produto: '',
            quantidade: '',
            valorUnitario: ''
          }]
        });
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      alert('Erro ao criar nota fiscal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Nova Nota Fiscal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NF001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Série *
              </label>
              <input
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="saida">Saída</option>
                <option value="entrada">Entrada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pedido Relacionado
              </label>
              <select
                name="pedido"
                value={formData.pedido}
                onChange={handlePedidoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um pedido</option>
                {orders.map(order => (
                  <option key={order._id} value={order._id}>
                    {order.client} - {order.produto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                name="dataVencimento"
                value={formData.dataVencimento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cliente */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Dados do Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="cliente.nome"
                  value={formData.cliente.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  name="cliente.cnpj"
                  value={formData.cliente.cnpj}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro
                </label>
                <input
                  type="text"
                  name="endereco.logradouro"
                  value={formData.cliente.endereco.logradouro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua/Avenida"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  name="endereco.numero"
                  value={formData.cliente.endereco.numero}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  name="endereco.bairro"
                  value={formData.cliente.endereco.bairro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Centro"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  name="endereco.cidade"
                  value={formData.cliente.endereco.cidade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  name="endereco.estado"
                  value={formData.cliente.endereco.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  name="endereco.cep"
                  value={formData.cliente.endereco.cep}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Nota Fiscal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal; 