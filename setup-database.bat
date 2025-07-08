@echo off
chcp 65001 >nul

echo 🚀 Iniciando configuração do banco de dados PedidoFácil...
echo.

REM Verificar se o MongoDB está instalado
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB não encontrado!
    echo 📥 Por favor, instale o MongoDB primeiro:
    echo    https://docs.mongodb.com/manual/installation/
    pause
    exit /b 1
)

echo ✅ MongoDB encontrado!

REM Verificar se o MongoDB está rodando
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB está rodando!
) else (
    echo ⚠️  MongoDB não está rodando. Iniciando...
    start mongod
    timeout /t 3 /nobreak >nul
)

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Por favor, instale o Node.js primeiro:
    echo    https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!

REM Instalar dependência do MongoDB se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install mongodb
)

REM Executar script de importação
echo 📁 Importando dados no MongoDB...
node database/import-mongodb.js

echo.
echo 🎉 Configuração concluída!
echo.
echo 📋 Próximos passos:
echo 1. Configure o arquivo .env no backend:
echo    copy backend\env.example backend\.env
echo.
echo 2. Inicie o backend:
echo    cd backend ^&^& npm install ^&^& npm run dev
echo.
echo 3. Inicie o frontend:
echo    cd frontend ^&^& npm install ^&^& npm start
echo.
echo 🔑 Credenciais de acesso:
echo    Admin: admin@pedidofacil.com / admin123
echo    Gerente: gerente@pedidofacil.com / gerente123
echo    Operador: operador@pedidofacil.com / operador123
echo.
echo 🌐 Acesse: http://localhost:3000
echo.
pause 