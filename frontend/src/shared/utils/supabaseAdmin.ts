import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/shared/types/database"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || ""

if (!SUPABASE_SERVICE_ROLE && process.env.NODE_ENV === "production") {
  throw new Error("SUPABASE_SERVICE_ROLE is required in production")
}

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
