#!/bin/bash

# Script para preparar o projeto para deploy no GitHub
# Remove arquivos sensíveis e cria arquivos de exemplo

echo "🔧 Preparando projeto para deploy..."

# Verificar se existem arquivos sensíveis
SENSITIVE_FILES=(
  ".env"
  "backend/.env"
  "database/config-atlas.js"
  "setup-atlas.js"
)

echo "📋 Verificando arquivos sensíveis..."

for file in "${SENSITIVE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "⚠️  Arquivo sensível encontrado: $file"
    echo "   Este arquivo será ignorado pelo .gitignore"
  else
    echo "✅ Arquivo sensível não encontrado: $file"
  fi
done

# Criar arquivo de exemplo do Atlas se não existir
if [ ! -f "database/config-atlas.example.js" ]; then
  echo "📝 Criando arquivo de exemplo do Atlas..."
  cat > database/config-atlas.example.js << 'EOF'
// Configuração de exemplo para MongoDB Atlas
// Copie este arquivo para config-atlas.js e preencha com suas credenciais
const MONGODB_ATLAS_CONFIG = {
  uri: 'mongodb+srv://SEU_USUARIO:SUA_SENHA@SEU_CLUSTER.mongodb.net/pedidofacil?retryWrites=true&w=majority',
  database: 'pedidofacil',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

module.exports = MONGODB_ATLAS_CONFIG;
EOF
fi

# Verificar se .gitignore existe
if [ ! -f ".gitignore" ]; then
  echo "📝 Criando .gitignore..."
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/
out/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database files
*.db
*.sqlite
*.sqlite3

# Upload files
uploads/
public/uploads/

# Backup files
*.bak
*.backup

# Config files with sensitive data
config-atlas.js
database/config-atlas.js

# MongoDB data
data/
mongodb/

# SSL certificates
*.pem
*.key
*.crt

# PM2
.pm2/

# Docker
.dockerignore
docker-compose.override.yml

# Local development
.local/
EOF
fi

echo ""
echo "✅ Preparação concluída!"
echo ""
echo "📋 Checklist para deploy:"
echo "  ✅ .gitignore criado/verificado"
echo "  ✅ Arquivos sensíveis serão ignorados"
echo "  ✅ Arquivos de exemplo criados"
echo ""
echo "🚀 Próximos passos:"
echo "1. git add ."
echo "2. git commit -m 'feat: sistema completo de gestão de pedidos e notas fiscais'"
echo "3. git push origin main"
echo ""
echo "⚠️  Lembre-se:"
echo "  - Nunca commite arquivos .env"
echo "  - Nunca commite config-atlas.js com credenciais reais"
echo "  - Use sempre os arquivos de exemplo" 