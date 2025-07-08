import React from 'react';
import { Users as UsersIcon, Plus } from 'lucide-react';

const Users = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UsersIcon className="w-6 h-6" /> Usuários
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>
      {/* Conteúdo futuro */}
      <div className="bg-white rounded shadow p-6 text-gray-500 text-center">
        Em breve: gerenciamento de usuários.
      </div>
    </div>
  );
};

export default Users; 