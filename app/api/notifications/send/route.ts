import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPushNotification } from '@/lib/firebaseAdmin'

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

 const { title, message, data } = await req.json()

 const { data: tokens } = await supabase
   .from('device_tokens')
   .select('fcm_token')

 const tokenList = tokens?.map(t => t.fcm_token) || []

 await sendPushNotification(tokenList, title, message, data)

 return NextResponse.json({
   success: true,
   sent: tokenList.length
 })

}
