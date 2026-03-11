import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sendPushNotification } from '@/lib/firebaseAdmin'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (!userData || !['operator', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const body = await request.json()
    const { commandType, payload } = body

    if (!commandType) {
      return NextResponse.json({ error: 'commandType é obrigatório' }, { status: 400 })
    }

    const allowedCommands = ['START_OPERATION', 'STOP_OPERATION', 'TRIGGER_EFFECT', 'LOCK_SYSTEM', 'EMERGENCY_STOP']
    if (!allowedCommands.includes(commandType)) {
      return NextResponse.json({ error: 'Tipo de comando inválido' }, { status: 400 })
    }

    const { data: command, error: insertError } = await supabase
      .from('operational_commands')
      .insert({
        command_type: commandType,
        payload: payload || {},
        issued_by: user.email,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir comando:', insertError)
      return NextResponse.json({ error: 'Erro ao salvar comando' }, { status: 500 })
    }

    const criticalCommands = ['EMERGENCY_STOP', 'LOCK_SYSTEM']
    if (criticalCommands.includes(commandType)) {
      try {
        const { data: deviceTokens } = await supabase
          .from('device_tokens')
          .select('fcm_token')

        if (deviceTokens && deviceTokens.length > 0) {
          const tokens = deviceTokens.map((dt: any) => dt.fcm_token)
          sendPushNotification(
            tokens,
            '🚨 ALERTA CRÍTICO - Synapse',
            `${commandType.replace('_', ' ')} executado por: ${user.email}`,
            { type: 'critical_command', commandType, commandId: command.id }
          ).catch(console.error)
        }
      } catch (notificationError) {
        console.error('Erro na notificação:', notificationError)
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
    console.error('Erro ao processar comando:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
