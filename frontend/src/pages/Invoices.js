import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Edit, Trash2, Eye, Download } from 'lucide-react';
import AddInvoiceModal from '../components/AddInvoiceModal';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Buscar notas fiscais
  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Garantir que invoices seja sempre um array
        const invoicesArray = Array.isArray(data) ? data : (data.invoices || data.docs || []);
        setInvoices(invoicesArray);
      }
    } catch (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      setInvoices([]); // Em caso de erro, definir como array vazio
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filtrar notas fiscais
  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(invoice => {
    const matchesSearch = invoice.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  // Adicionar nova nota fiscal
  const handleInvoiceAdded = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  // Deletar nota fiscal
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setInvoices(prev => prev.filter(invoice => invoice._id !== invoiceId));
      } else {
        alert('Erro ao excluir nota fiscal');
      }
    } catch (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      alert('Erro ao excluir nota fiscal');
    }
  };

  // Emitir nota fiscal
  const handleEmitInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/emitir`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        setInvoices(prev => prev.map(invoice => 
          invoice._id === invoiceId ? updatedInvoice : invoice
        ));
      } else {
        alert('Erro ao emitir nota fiscal');
      }
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      alert('Erro ao emitir nota fiscal');
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Formatar valor
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      rascunho: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
      emitida: { color: 'bg-blue-100 text-blue-800', label: 'Emitida' },
      cancelada: { color: 'bg-red-100 text-red-800', label: 'Cancelada' },
      paga: { color: 'bg-green-100 text-green-800', label: 'Paga' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" /> Notas Fiscais
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Nova Nota Fiscal
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por número ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="rascunho">Rascunho</option>
              <option value="emitida">Emitida</option>
              <option value="cancelada">Cancelada</option>
              <option value="paga">Paga</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Notas Fiscais */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.numero}
                    </div>
                    <div className="text-sm text-gray-500">
                      Série {invoice.serie}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.cliente.nome}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.cliente.cnpj}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {invoice.tipo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(invoice.dataVencimento)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      {invoice.status === 'rascunho' && (
                        <button
                          onClick={() => handleEmitInvoice(invoice._id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Emitir"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(invoice._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma nota fiscal encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'Tente ajustar os filtros.' : 'Comece criando sua primeira nota fiscal.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Nota Fiscal */}
      <AddInvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInvoiceAdded={handleInvoiceAdded}
      />
    </div>
  );
};

export default Invoices; 