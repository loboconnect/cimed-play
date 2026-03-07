import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

 const body = await req.json()

 const { fcm_token, device_type } = body

 const { data, error } = await supabase
   .from('device_tokens')
   .insert([{ fcm_token, device_type }])

 if (error) {
   return NextResponse.json({ error }, { status: 500 })
 }

 return NextResponse.json({ success: true })
}
