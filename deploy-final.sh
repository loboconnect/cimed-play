#!/bin/bash

# Deploy Automático - Campanha Digital 2026
# Execute este script em um NOVO terminal

cd /workspaces/campanha-digital-2026

echo "🚀 Iniciando deploy automático na Vercel..."
echo ""

# Verificar se está logado
echo "🔍 Verificando login na Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Você não está logado na Vercel!"
    echo "Execute: vercel login"
    echo "Acesse: https://vercel.com/device"
    echo "Digite o código fornecido."
    exit 1
fi

echo "✅ Login confirmado!"
echo ""

# Fazer deploy com respostas pré-configuradas
echo "📦 Fazendo deploy em produção..."
echo "Respostas automáticas:"
echo "  - Set up and deploy: yes"
echo "  - Scope: loboconnect"
echo "  - Link to existing: no"
echo "  - Project name: campanha-digital-2026"
echo "  - Directory: ./"
echo ""

# Executar deploy com flags para minimizar prompts
vercel --prod --name campanha-digital-2026 --yes

echo ""
echo "🎉 Deploy concluído!"
echo "Acesse a URL fornecida pela Vercel para ver sua aplicação Synapse!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no painel da Vercel"
echo "2. Teste o login (/login)"
echo "3. Verifique o dashboard (/dashboard)"
echo "4. Teste operações críticas (/dashboard/operations)"