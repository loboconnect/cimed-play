#!/usr/bin/env node

/**
 * Script de teste para validar o sistema de notificações push
 * Este script testa a integração do Firebase Admin SDK
 */

import { sendPushNotification } from '../lib/firebaseAdmin.js'

async function testPushNotification() {
  console.log('🧪 Testando sistema de notificações push...')

  try {
    // Teste com token fictício (em produção seria um token real)
    const testTokens = ['test-token-123']

    const testPayload = {
      title: 'Teste de Notificação',
      body: 'Esta é uma notificação de teste do sistema Synapse',
      severity: 'normal' as const,
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    }

    console.log('📤 Enviando notificação de teste...')
    const result = await sendPushNotification(testTokens, testPayload)

    console.log('✅ Teste concluído com sucesso!')
    console.log('📊 Resultado:', result)

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    console.log('ℹ️  Nota: Este erro é esperado em desenvolvimento sem credenciais reais do Firebase')
  }
}

// Executar teste apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testPushNotification()
}

export { testPushNotification }