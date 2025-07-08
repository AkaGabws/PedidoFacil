import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: { total: 0, stats: [] },
    invoices: { total: 0, stats: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersResponse, invoicesResponse] = await Promise.all([
          axios.get('/api/orders/stats'),
          axios.get('/api/invoices/stats'),
        ]);

        setStats({
          orders: ordersResponse.data.data,
          invoices: invoicesResponse.data.data,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return 'text-warning-600 bg-warning-100';
      case 'em_producao':
        return 'text-primary-600 bg-primary-100';
      case 'pronto':
        return 'text-success-600 bg-success-100';
      case 'entregue':
        return 'text-success-600 bg-success-100';
      case 'cancelado':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'em_producao':
        return <TrendingUp className="h-4 w-4" />;
      case 'pronto':
      case 'entregue':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do sistema PedidoFácil
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Pedidos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.orders.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-success-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.invoices.totalInvoices || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-warning-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {(stats.orders.totalValue || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-danger-600 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Notas Vencidas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.invoices.vencidas || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status dos Pedidos */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Status dos Pedidos</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {stats.orders.statusStats?.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat._id)}`}>
                      {getStatusIcon(stat._id)}
                      <span className="ml-1 capitalize">{stat._id.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{stat.count}</p>
                    <p className="text-xs text-gray-500">
                      R$ {stat.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status das Notas Fiscais */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Status das Notas Fiscais</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {stats.invoices.statusStats?.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat._id)}`}>
                      {getStatusIcon(stat._id)}
                      <span className="ml-1 capitalize">{stat._id}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{stat.count}</p>
                    <p className="text-xs text-gray-500">
                      R$ {stat.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="btn btn-primary">
              <Package className="h-5 w-5 mr-2" />
              Novo Pedido
            </button>
            <button className="btn btn-success">
              <FileText className="h-5 w-5 mr-2" />
              Nova Nota Fiscal
            </button>
            <button className="btn btn-secondary">
              <TrendingUp className="h-5 w-5 mr-2" />
              Relatórios
            </button>
            <button className="btn btn-warning">
              <Clock className="h-5 w-5 mr-2" />
              Pedidos Pendentes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 