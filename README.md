# Campanha Digital 2026

Sistema de comunicação digital para campanha eleitoral com transmissão ao vivo redundante e notificações push críticas.

## 🚀 Funcionalidades

### Transmissão ao Vivo
- **RTMP/WebRTC**: Recebimento de feed ao vivo do candidato
- **Redundância**: Duplicação automática para YouTube + Vimeo
- **Dashboard Central**: Controles em tempo real (Modo Flutuante, Expandido, Full Screen, Overlay)
- **TV Flutuante**: PWA/APK com minimização, redimensionamento e modo emergência

### Sistema de Operações
- **Comandos Operacionais**: EMERGENCY_STOP, LOCK_SYSTEM, UNLOCK_SYSTEM, etc.
- **Auditoria Completa**: Logs imutáveis de todas as ações
- **Notificações Push**: Alertas automáticos para comandos críticos

### Segurança e Conformidade
- **Autenticação**: Supabase Auth com controle de acesso
- **Logs de Auditoria**: Rastreamento completo de ações e alterações
- **Row Level Security**: Políticas de segurança no banco de dados

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js 20 LTS
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: Supabase Auth
- **Notificações**: Firebase Cloud Messaging
- **Transmissão**: node-media-server, YouTube/Vimeo APIs
- **PWA**: PWABuilder, Service Workers

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 20 LTS
- npm ou yarn
- Conta Supabase
- Projeto Firebase

### Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd campanha-digital-2026

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Configurar banco de dados
npx prisma db push

# Executar migrações
npm run db:migrate

# Build do projeto
npm run build

# Executar em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
DATABASE_URL=your_database_url

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_firebase_vapid_key

# Firebase Admin (para notificações push)
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_json
```

## 🔧 Sistema de Notificações Push

### Visão Geral
O sistema implementa notificações push automáticas para alertas críticos usando Firebase Cloud Messaging (FCM).

### Funcionalidades
- **Registro de Dispositivos**: Tokens FCM armazenados com segurança no Supabase
- **Notificações Automáticas**: Alertas para comandos críticos (EMERGENCY_STOP, LOCK_SYSTEM)
- **Suporte Multiplataforma**: Android, iOS, Web (PWA)
- **Priorização**: Níveis de severidade (low, normal, high)
- **Service Worker**: Tratamento de mensagens em background

### API Endpoints

#### Registro de Dispositivo
```http
POST /api/notifications/register-device
Content-Type: application/json

{
  "token": "fcm_token_here",
  "deviceType": "web|android|ios",
  "userAgent": "browser_info"
}
```

#### Envio de Notificação
```http
POST /api/notifications/send
Content-Type: application/json
Authorization: Bearer <operator_token>

{
  "title": "Alerta Crítico",
  "body": "Sistema de emergência ativado",
  "severity": "high",
  "data": {
    "command": "EMERGENCY_STOP",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Teste do Sistema

```bash
# Executar teste de notificações
node scripts/test-notifications.js
```

## 📊 Monitoramento e Logs

### Logs de Auditoria
Todas as ações são registradas na tabela `log_auditoria`:
- Comando executado
- Usuário responsável
- IP de origem
- Dados antes/depois
- Timestamp

### Métricas
- Visualizações de transmissão
- Cadastros de dispositivos
- Taxa de entrega de notificações
- Acessos ao dashboard

## 🚨 Modo de Emergência

### Ativação
O modo de emergência é ativado automaticamente quando:
- Comando `EMERGENCY_STOP` é executado
- Sistema detecta falha crítica
- Operador força modo full screen

### Funcionalidades
- **Full Screen Automático**: Interface ocupa tela completa
- **Notificações Push**: Alertas enviados para todos os dispositivos
- **Bloqueio de Sistema**: Prevenção de alterações não autorizadas
- **Logs de Emergência**: Rastreamento completo do incidente

## 🔒 Segurança

### Autenticação
- Login obrigatório para todas as operações
- Controle de acesso baseado em roles
- Sessões seguras com Supabase Auth

### Autorização
- Apenas operadores autorizados podem executar comandos críticos
- Validação de permissões em cada endpoint
- Logs de todas as tentativas de acesso

### Dados Sensíveis
- Credenciais armazenadas como variáveis de ambiente
- Chaves de API nunca expostas no frontend
- Criptografia de dados em trânsito e repouso

## 🧪 Desenvolvimento

### Convenções
- **TDD**: Testes obrigatórios antes da implementação
- **Commits Pequenos**: Commits frequentes e descritivos
- **Refatoração**: Limpeza de código após cada feature
- **Camadas**: Separação clara (domain, application, infrastructure)

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção

# Banco de dados
npm run db:push      # Sincronizar schema
npm run db:migrate   # Executar migrações
npm run db:studio    # Interface gráfica do Prisma

# Qualidade
npm run lint         # Verificar código
npm run test         # Executar testes
npm run type-check   # Verificar tipos TypeScript
```

## 📱 PWA e Aplicativos

### Progressive Web App
- Instalável em dispositivos móveis
- Funciona offline parcialmente
- Notificações push nativas
- Service worker para cache inteligente

### APK Nativo (Futuro)
- Controle total do dispositivo
- Integração nativa com sistema
- Atualização automática via loja

## 🤝 Contribuição

1. Criar branch para nova feature
2. Implementar com TDD
3. Testes passando
4. Commit pequeno e descritivo
5. Pull request com descrição detalhada
6. Code review aprovado
7. Merge após CI passar

## � Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Projeto configurado no Supabase
- Projeto configurado no Firebase

### Método Rápido (Recomendado)

```bash
# Executar script de deploy automatizado
./scripts/deploy.sh
```

O script irá:
- ✅ Verificar instalação do Vercel CLI
- ✅ Validar login na Vercel
- ✅ Verificar variáveis de ambiente
- ✅ Fazer build local para validação
- ✅ Deploy para produção

### Método Manual

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login na Vercel
```bash
vercel login
```
Siga as instruções no navegador para autenticação.

#### 3. Inicializar Projeto
```bash
vercel
```
Configurações:
- **Set up and deploy**: Yes
- **Which scope**: Selecione sua conta
- **Project name**: `campanha-digital-2026`
- **Framework**: Next.js (detectado automaticamente)
- **Root directory**: `./`
- **Build command**: `next build` (padrão)
- **Output directory**: `.next` (padrão)

#### 4. Configurar Variáveis de Ambiente

No painel da Vercel (ou via CLI):

```bash
# Supabase
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add DATABASE_URL

# Firebase
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_VAPID_KEY
```

#### 5. Deploy para Produção
```bash
vercel --prod
```

### Arquivos de Configuração Criados

- **`vercel.json`**: Configuração do framework Next.js
- **`next.config.js`**: Configurações específicas do Next.js para Vercel
- **`.env.example`**: Template de variáveis de ambiente
- **`scripts/deploy.sh`**: Script automatizado de deploy

### Verificação Pós-Deploy

Após o deploy, confirme:

- ✅ **Build sem erros**: Verificar logs do build na Vercel
- ✅ **Rotas funcionando**: Acesse a URL gerada
- ✅ **Auth Supabase**: Teste login em `/login`
- ✅ **Push Notifications**: Verifique console do navegador
- ✅ **Dashboard**: Acesse `/dashboard` e `/dashboard/operations`

### Domínio Personalizado

Para configurar um domínio personalizado:

1. Acesse o dashboard do projeto na Vercel
2. Vá em **Settings** > **Domains**
3. Adicione seu domínio
4. Configure os registros DNS conforme instruído

### Deploy Contínuo

O projeto está configurado para **deploy contínuo**:
- ✅ Commits na branch `main` fazem deploy automático
- ✅ Pull requests geram previews
- ✅ Builds são executados na Vercel

### Troubleshooting

#### Build Falhando
- Verifique variáveis de ambiente
- Confirme que `npm run build` funciona localmente
- Verifique logs detalhados no dashboard da Vercel

#### Auth Não Funcionando
- Confirme URLs do Supabase
- Verifique chaves de API
- Compare com `.env.example`

#### Notifications Não Funcionando
- Verifique configuração do Firebase
- Confirme VAPID key
- Teste no console do navegador

### URLs Importantes

Após deploy, você terá:
- **Produção**: `https://campanha-digital-2026.vercel.app`
- **Dashboard**: `/dashboard`
- **Operações**: `/dashboard/operations`
- **Login**: `/login`

## �📄 Licença

Este projeto é propriedade da campanha eleitoral 2026. Uso restrito e confidencial.
