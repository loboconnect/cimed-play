# Módulo de Comandos Operacionais - Synapse

## 📋 Visão Geral

Este módulo implementa o núcleo operacional do sistema Synapse, permitindo que operadores autorizados enviem comandos em tempo real que são processados e distribuídos instantaneamente para todos os clientes conectados.

## 🏗️ Arquitetura

### Fluxo de Dados
```
Operador → API (/api/operations) → Supabase Database → Realtime Event → Todos os Clientes
```

### Componentes Principais

1. **API Endpoint** (`/app/api/operations/route.ts`)
   - Valida autenticação e permissões
   - Aceita comandos POST
   - Registra logs de auditoria

2. **Página de Controle** (`/app/dashboard/operations/page.tsx`)
   - Interface para operadores
   - 5 tipos de comandos disponíveis
   - Proteção por role (operator/admin)

3. **Console Operacional** (`/components/OperationalConsole.tsx`)
   - Feed em tempo real de comandos
   - Supabase Realtime integration
   - Histórico de comandos

## 🚀 Como Usar

### 1. Configurar Banco de Dados

Execute o script SQL no Supabase SQL Editor:

```sql
-- Copie e execute o conteúdo de scripts/create_operational_commands.sql
```

### 2. Criar Usuário Operador

No painel do Supabase:
- Authentication → Users → Add User
- Criar usuário com email/senha
- Na tabela `User`, definir `role = 'operator'` ou `role = 'admin'`

### 3. Testar o Sistema

```bash
# Iniciar servidor
npm run dev

# Acessar
# 1. http://localhost:3000/login
# 2. Fazer login com usuário operator/admin
# 3. Ir para /dashboard/operations
# 4. Clicar em qualquer botão de comando
# 5. Ver comando aparecer em tempo real no console
```

### 4. Abrir Múltiplas Abas

Para testar o realtime:
- Abra `/dashboard/operations` em múltiplas abas/janelas
- Envie comandos de uma aba
- Veja os comandos aparecerem instantaneamente nas outras abas

## 📊 Tipos de Comando

| Comando | Descrição | Cor |
|---------|-----------|-----|
| START_OPERATION | Inicia operação do sistema | 🟢 Verde |
| STOP_OPERATION | Para operação atual | 🟡 Amarelo |
| TRIGGER_EFFECT | Ativa efeito especial | 🔵 Azul |
| LOCK_SYSTEM | Bloqueia sistema | 🟠 Laranja |
| EMERGENCY_STOP | Parada de emergência | 🔴 Vermelho |

## 🔒 Segurança

- **Autenticação**: Apenas usuários logados
- **Autorização**: Roles `operator` ou `admin`
- **Auditoria**: Todos os comandos são logados
- **RLS**: Row Level Security no Supabase

## 📡 Realtime

O sistema usa Supabase Realtime para distribuição instantânea:

```typescript
// Listener ativo no OperationalConsole
supabase
  .channel('operational_commands')
  .on('INSERT', (payload) => {
    // Novo comando recebido
    setCommands(prev => [newCommand, ...prev])
  })
```

## 🧪 Testes

### Cenários de Teste

1. **Acesso Não Autorizado**
   - Usuário sem role operator/admin → 403 Forbidden

2. **Comando Inválido**
   - Enviar commandType não permitido → 400 Bad Request

3. **Realtime**
   - Múltiplas sessões simultâneas
   - Verificação de latência < 1s

4. **Auditoria**
   - Verificar logs na tabela `LogAuditoria`

## 📁 Estrutura de Arquivos

```
app/
├── api/operations/
│   └── route.ts              # Endpoint POST
├── dashboard/operations/
│   └── page.tsx              # Interface operacional
└── login/
    └── page.tsx              # Autenticação

components/
└── OperationalConsole.tsx    # Feed realtime

lib/
└── supabaseClient.ts         # Cliente Supabase

scripts/
└── create_operational_commands.sql  # Schema DB
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

### Dependências
- `@supabase/supabase-js` (cliente)
- Next.js 14 (App Router)
- TypeScript

## 🚨 Próximos Passos

1. **Processamento de Comandos**: Implementar lógica para executar comandos recebidos
2. **WebSocket Fallback**: Suporte para navegadores sem realtime
3. **Notificações Push**: Alertas para operadores sobre comandos críticos
4. **Dashboard de Métricas**: Estatísticas de comandos por período
5. **Histórico Avançado**: Filtros e busca no console operacional

---

**Status**: ✅ Implementado e testado
**Compatibilidade**: Next.js 14, Supabase, TypeScript