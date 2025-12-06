# Tessera Backend

## Requirements

- Node.js 20+
- Docker (for local Supabase)
- pnpm

## Quick Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start local Supabase (Postgres + Auth + Studio)
pnpm db:start

# 3. Apply migrations
pnpm db:reset

# 4. Generate TypeScript types
pnpm db:types
```

Done! Supabase running at:
- **API:** http://localhost:54321
- **Studio:** http://localhost:54323
- **DB:** postgresql://postgres:postgres@localhost:54322/postgres

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run server in dev mode |
| `pnpm db:start` | Start local Supabase (Docker) |
| `pnpm db:stop` | Stop Supabase |
| `pnpm db:reset` | Reset DB and apply all migrations |
| `pnpm db:new <name>` | Create new migration file |
| `pnpm db:types` | Generate TS types from schema |

## Database

### Tables

```
users            - Developers (wallet required, social optional)
api_keys         - API keys (tsr_ak_xxx)
agents           - Registered agents with budgets
publishers       - Opt-in publishers with x402 endpoints
revenue_splits   - Revenue distribution (royalties)
requests         - Payment logs
usage_summary    - Aggregated stats for dashboard
```

### Create New Migration

```bash
pnpm db:new add_new_table    # creates timestamped file
# edit the file in supabase/migrations/
pnpm db:reset                # apply
```

### Generate Types

After changing the schema:

```bash
pnpm db:types
```

This generates `src/db/types.ts` with Supabase types.

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   └── types.ts       # Generated types (pnpm db:types)
│   └── index.ts           # Entry point
├── supabase/
│   ├── config.toml        # Supabase config
│   └── migrations/        # SQL migrations
├── package.json
└── tsconfig.json
```