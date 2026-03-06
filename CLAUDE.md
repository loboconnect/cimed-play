# CLAUDE.md - Campanha Digital 2026

## PARTE 1 — ARQUITETURA DO PROJETO
Objetivo: Sistema de comunicação digital para campanha eleitoral de 60 dias, robusto, seguro e redundante. Sem decisões políticas.

Fluxo principal:
Candidato (OBS ou celular) → RTMP/WebRTC → Dashboard Central → replica feed → YouTube Principal + Vimeo Backup → TV Flutuante (PWA / APK)

### Módulos:
**Dashboard Central**
- Recebe feed ao vivo
- Replica automaticamente para YouTube e Vimeo via Signal Router
- Controles: Modo Flutuante, Expandido, Full Screen, Overlay, Logo, QR Code, Banner inferior, Contador regressivo, Botão Modo Urgente
- Relatórios: acessos, visualizações, cadastros
- Logs auditáveis
- Modo Urgente: Full Screen + push automático

**Signal Router**
- Duplica sinal do YouTube para Vimeo
- Configuração única por operador autorizado
- Métricas: espectadores, logins, cadastros

**TV Flutuante**
- Captura feed final
- Minimizar, redimensionar, ampliar ou Full Screen emergência
- Interação controlada pelo Dashboard (QR Code, logo, banner)

**Protótipo duplo**
- PWA: testes rápidos, instalável, push notifications, offline parcial
- APK: campanha oficial, controle total do celular, atualização via loja

### Restrições:
- Redundância obrigatória (YouTube + Vimeo)
- Sem decisões políticas
- Logs de auditoria imutáveis
- Modo Urgente crítico, latência mínima
- Configuração de links/embeds só por operador autorizado

### Decisões Arquiteturais
- Dashboard em Next.js (App Router)
- API interna via Route Handlers
- Node.js + node-media-server para Signal Router
- PostgreSQL (Supabase) para logs and storage
- Firebase FCM para push notifications
- PWA + PWABuilder para TV Flutuante
- Separação clara de camadas (domain, application, infrastructure)
- Estrutura modular / pastas: /public, /icons, /manifest.json, /service-worker.js

### Modelo de Dados
**LogAuditoria**
- acao_detalhada
- ip_origem
- dado_antes
- dado_depois
- usuario
- timestamp

**Entidades Principais**
- Usuario, Operador, Video, Feed, TVFlutuante, Metrics

### Stack
- Node.js 20 LTS
- Next.js 14+
- Prisma 5+
- Supabase free tier
- Firebase FCM
- PWABuilder
- Banidos: serviços pagos não essenciais, extensões limitadas

### Convenções
- Pastas: /app, /domain, /infrastructure, /public
- Nomenclatura camelCase para variáveis, PascalCase para classes e componentes

## PARTE 2 — PROCESSO DE DESENVOLVIMENTO
1. TDD obrigatório
2. Commits pequenos e frequentes
3. Refatorar antes da próxima feature
4. Soluções complexas: primeiro versão simples
5. Nunca violar fronteiras de camadas
6. CI deve passar antes de avançar
7. Documentar limitações ou bugs
8. Perguntar se houver ambiguidade
9. Humano navigator, agente driver
