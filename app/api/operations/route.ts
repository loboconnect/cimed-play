import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendPushNotification } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar role do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !['operator', 'admin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Acesso negado. Role insuficiente.' },
        { status: 403 }
      )
    }

    // Parse do corpo da requisição
    const body = await request.json()
    const { commandType, payload } = body

    if (!commandType) {
      return NextResponse.json(
        { error: 'commandType é obrigatório' },
        { status: 400 }
      )
    }

    // Validar tipos de comando permitidos
    const allowedCommands = [
      'START_OPERATION',
      'STOP_OPERATION',
      'TRIGGER_EFFECT',
      'LOCK_SYSTEM',
      'EMERGENCY_STOP'
    ]

    if (!allowedCommands.includes(commandType)) {
      return NextResponse.json(
        { error: 'Tipo de comando inválido' },
        { status: 400 }
      )
    }

    // Inserir comando na tabela usando Supabase
    const { data: command, error: insertError } = await supabase
      .from('operational_commands')
      .insert({
        command_type: commandType,
        payload: payload || {},
        issued_by: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir comando:', insertError)
      return NextResponse.json(
        { error: 'Erro ao salvar comando' },
        { status: 500 }
      )
    }

    // Log de auditoria
    await supabase
      .from('LogAuditoria')
      .insert({
        userId: user.id,
        acao_detalhada: `Comando operacional emitido: ${commandType}`,
        ip_origem: request.headers.get('x-forwarded-for') || 'unknown',
        dado_antes: '',
        dado_depois: JSON.stringify({ commandId: command.id, commandType, payload })
      })

    // Disparar notificação push para comandos críticos
    const criticalCommands = ['EMERGENCY_STOP', 'LOCK_SYSTEM']
    if (criticalCommands.includes(commandType)) {
      try {
        // Buscar email do usuário
        const { data: userProfile } = await supabase.auth.admin.getUserById(user.id)

        // Buscar tokens FCM de todos os operadores (exceto o emissor)
        const { data: deviceTokens } = await supabase
          .from('device_tokens')
          .select('fcm_token')
          .neq('user_id', user.id)

        if (deviceTokens && deviceTokens.length > 0) {
          const tokens = deviceTokens.map(dt => dt.fcm_token)

          const notificationPayload = {
            title: '🚨 ALERTA CRÍTICO - Synapse',
            body: `${commandType.replace('_', ' ')}\nExecutado por: ${user.email || 'Operador'}\n${new Date().toLocaleString('pt-BR')}`,
            severity: 'high' as const,
            data: {
              type: 'critical_command',
              commandType,
              commandId: command.id,
              operator: userProfile.user?.email || 'Operador',
              timestamp: new Date().toISOString()
            }
          }

          // Enviar notificação em background (não bloquear resposta)
          sendPushNotification(tokens, "🚨 ALERTA CRÍTICO - Synapse", notificationPayload.body, notificationPayload.data)
            .then(response => {
              console.log(`Critical notification sent for ${commandType}:`, {
                successCount: response.successCount,
                failureCount: response.failureCount
              })
            })
            .catch(error => {
              console.error(`Failed to send critical notification for ${commandType}:`, error)
            })
        }
      } catch (notificationError) {
        // Não falhar a operação se a notificação falhar
        console.error('Error sending critical notification:', notificationError)
      }
    }

    return NextResponse.json({
      success: true,
      command: {
        id: command.id,
        commandType: command.command_type,
        status: command.status,
        createdAt: command.created_at
      }
    })

  } catch (error) {
    console.error('Erro ao processar comando operacional:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}