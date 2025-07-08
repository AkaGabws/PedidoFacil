#!/bin/bash

# Script de Instalação Rápida do Banco de Dados - PedidoFácil
# Este script automatiza a configuração do banco de dados MongoDB

echo "🚀 Iniciando configuração do banco de dados PedidoFácil..."
echo ""

# Verificar se o MongoDB está instalado
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB não encontrado!"
    echo "📥 Por favor, instale o MongoDB primeiro:"
    echo "   - Windows: https://docs.mongodb.com/manual/installation/"
    echo "   - macOS: brew install mongodb-community"
    echo "   - Ubuntu: sudo apt install mongodb"
    exit 1
fi

echo "✅ MongoDB encontrado!"

# Verificar se o MongoDB está rodando
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB não está rodando. Iniciando..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start mongod
    else
        # Linux/macOS
        sudo systemctl start mongod
    fi
    sleep 3
fi

echo "✅ MongoDB está rodando!"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Por favor, instale o Node.js primeiro:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado!"

# Instalar dependência do MongoDB se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install mongodb
fi

# Executar script de importação
echo "📁 Importando dados no MongoDB..."
node database/import-mongodb.js

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env no backend:"
echo "   cp backend/env.example backend/.env"
echo ""
echo "2. Inicie o backend:"
echo "   cd backend && npm install && npm run dev"
echo ""
echo "3. Inicie o frontend:"
echo "   cd frontend && npm install && npm start"
echo ""
echo "🔑 Credenciais de acesso:"
echo "   Admin: admin@pedidofacil.com / admin123"
echo "   Gerente: gerente@pedidofacil.com / gerente123"
echo "   Operador: operador@pedidofacil.com / operador123"
echo ""
echo "🌐 Acesse: http://localhost:3000" 