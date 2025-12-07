import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/shared/types/database"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Só valida em produção ou se as variáveis estiverem definidas
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  const supabaseUrlPattern = /^(https:\/\/[a-z0-9-]+\.supabase\.co|http:\/\/(localhost|127\.0\.0\.1):\d+)$/
  if (!supabaseUrlPattern.test(SUPABASE_URL)) {
    throw new Error(`URL do Supabase inválida: ${SUPABASE_URL}. Use formato https://xxx.supabase.co ou http://localhost:port`)
  }

  if (process.env.NODE_ENV === "production" && (SUPABASE_URL.includes("localhost") || SUPABASE_URL.includes("127.0.0.1"))) {
    throw new Error("Configuração de produção inválida - não use localhost em produção")
  }
} else if (process.env.NODE_ENV === "production") {
  throw new Error("Configuração do Supabase incompleta. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env")
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        "Prefer": "return=representation",
      },
    },
  }
)

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).supabase = supabase
}
