#!/bin/bash

# DEPLOY EMERGENCIAL - CAMPANHA DIGITAL 2026
# Execute este script em um NOVO TERMINAL

echo "🚨 DEPLOY EMERGENCIAL - CAMPANHA DIGITAL 2026"
echo "=============================================="
echo ""

cd /workspaces/campanha-digital-2026

# Verificar se está logado
echo "🔐 Verificando autenticação..."
if ! vercel whoami &> /dev/null; then
    echo "❌ ERRO: Login necessário!"
    echo ""
    echo "Execute primeiro:"
    echo "vercel login"
    echo "https://vercel.com/device"
    exit 1
fi

echo "✅ Autenticado!"
echo ""

# Deploy forçado
echo "📦 Executando deploy forçado..."
echo "Comando: vercel --prod --yes --name campanha-digital-2026"
echo ""

vercel --prod --yes --name campanha-digital-2026

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo ""
echo "📋 VERIFICAÇÕES PÓS-DEPLOY:"
echo "1. URL gerada pela Vercel"
echo "2. Configure variáveis de ambiente:"
echo "   - SUPABASE_URL, SUPABASE_ANON_KEY, etc."
echo "   - FIREBASE_PROJECT_ID, etc."
echo "3. Teste funcionalidades:"
echo "   - /login (autenticação)"
echo "   - /dashboard (painel)"
echo "   - /dashboard/operations (comandos)"
echo ""
echo "🚀 CAMPANHA DIGITAL 2026 ESTÁ NO AR!"