#!/bin/bash

# Script para deploy na Vercel - Campanha Digital 2026
# Execute este script em um novo terminal

cd /workspaces/campanha-digital-2026

echo "🚀 Iniciando deploy na Vercel..."

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "❌ Você precisa fazer login na Vercel primeiro."
    echo "Execute: vercel login"
    echo "Acesse: https://vercel.com/device"
    echo "Digite o código que aparecerá."
    exit 1
fi

echo "✅ Login verificado!"

# Fazer deploy com flags para evitar prompts
echo "📦 Fazendo deploy em produção..."
vercel --prod --yes

echo "🎉 Deploy concluído!"
echo "Acesse a URL fornecida pela Vercel para ver sua aplicação."