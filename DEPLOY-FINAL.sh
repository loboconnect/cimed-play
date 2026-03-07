#!/bin/bash

# DEPLOY FINAL - CAMPANHA DIGITAL 2026
# Execute este script em um NOVO TERMINAL

echo "🚀 DEPLOY FINAL - CAMPANHA DIGITAL 2026"
echo "========================================"
echo ""

cd /workspaces/campanha-digital-2026

# Verificar login
echo "🔐 Verificando login na Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ ERRO: Você não está logado na Vercel!"
    echo ""
    echo "SOLUÇÃO:"
    echo "1. Execute: vercel login"
    echo "2. Acesse: https://vercel.com/device"
    echo "3. Digite o código fornecido"
    echo "4. Execute este script novamente"
    exit 1
fi

echo "✅ Login confirmado!"
echo ""

# Deploy com flags para evitar prompts
echo "📦 Iniciando deploy em produção..."
echo "Configurações:"
echo "  - Projeto: campanha-digital-2026"
echo "  - Scope: loboconnect"
echo "  - Framework: Next.js"
echo "  - Diretório: ./"
echo ""

vercel --prod --name campanha-digital-2026 --yes

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Acesse a URL fornecida pela Vercel"
echo "2. Configure variáveis de ambiente no painel da Vercel:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - NEXT_PUBLIC_SUPABASE_*"
echo "   - FIREBASE_*"
echo "3. Teste a aplicação:"
echo "   - /login"
echo "   - /dashboard"
echo "   - /dashboard/operations"
echo ""
echo "🚀 A CAMPANHA DIGITAL 2026 ESTÁ NO AR!"