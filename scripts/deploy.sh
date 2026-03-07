#!/bin/bash

# Script de Deploy para Vercel - Campanha Digital 2026
# Este script automatiza o processo de deploy na Vercel

echo "🚀 Iniciando deploy do projeto Campanha Digital 2026 na Vercel..."

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "🔐 Você precisa fazer login na Vercel primeiro."
    echo "Execute: vercel login"
    echo "E siga as instruções no navegador."
    exit 1
fi

# Verificar se as variáveis de ambiente estão configuradas
echo "🔍 Verificando variáveis de ambiente..."
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "DATABASE_URL"
    "FIREBASE_PROJECT_ID"
    "FIREBASE_CLIENT_EMAIL"
    "FIREBASE_PRIVATE_KEY"
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    "NEXT_PUBLIC_FIREBASE_APP_ID"
    "NEXT_PUBLIC_FIREBASE_VAPID_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        missing_vars+=("$var")
    fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo "⚠️  As seguintes variáveis de ambiente estão faltando:"
    printf '   - %s\n' "${missing_vars[@]}"
    echo ""
    echo "Configure-as no painel da Vercel ou no arquivo .env"
    echo "Arquivo .env.example criado como referência."
    exit 1
fi

# Fazer build local para verificar se está tudo ok
echo "🔨 Fazendo build local para validação..."
if ! npm run build; then
    echo "❌ Build falhou. Corrija os erros antes do deploy."
    exit 1
fi

echo "✅ Build local bem-sucedido!"

# Deploy para produção
echo "📦 Fazendo deploy para produção..."
if vercel --prod; then
    echo "🎉 Deploy realizado com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Acesse a URL fornecida pela Vercel"
    echo "2. Teste o login (/login)"
    echo "3. Verifique o dashboard (/dashboard)"
    echo "4. Teste as operações críticas (/dashboard/operations)"
    echo "5. Configure o domínio personalizado se necessário"
    echo ""
    echo "🔧 Para configurar variáveis de ambiente na Vercel:"
    echo "   - Acesse o dashboard do projeto"
    echo "   - Vá em Settings > Environment Variables"
    echo "   - Adicione todas as variáveis do .env.example"
else
    echo "❌ Deploy falhou. Verifique os logs acima."
    exit 1
fi