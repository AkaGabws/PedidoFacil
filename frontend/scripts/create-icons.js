const fs = require('fs');
const path = require('path');

// Criar diretório scripts se não existir
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

console.log('📁 Criando arquivos de ícone básicos...');

// Criar favicon.ico básico (placeholder)
const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  fs.writeFileSync(faviconPath, '');
  console.log('✅ favicon.ico criado');
}

// Criar logo192.png básico (placeholder)
const logo192Path = path.join(__dirname, '..', 'public', 'logo192.png');
if (!fs.existsSync(logo192Path)) {
  fs.writeFileSync(logo192Path, '');
  console.log('✅ logo192.png criado');
}

// Criar logo512.png básico (placeholder)
const logo512Path = path.join(__dirname, '..', 'public', 'logo512.png');
if (!fs.existsSync(logo512Path)) {
  fs.writeFileSync(logo512Path, '');
  console.log('✅ logo512.png criado');
}

console.log('🎉 Arquivos de ícone criados com sucesso!');
console.log('💡 Em um projeto real, você substituiria esses arquivos por ícones reais.'); 