# Guia de Desenvolvimento Local - Tessera

Este guia explica como configurar o ambiente de desenvolvimento local para testar o Tessera com todos os componentes rodando localmente.

## 📋 Visão Geral

O Tessera possui 3 componentes principais que você pode rodar localmente:

1. **Frontend** (Next.js) - porta 3000
2. **Gateway** (Express) - porta 3001
3. **Publisher Server** (Express) - porta 8080 (exemplo)

## 🔧 Configuração Inicial

### 1. Setup do Banco de Dados (Supabase)

Primeiro, configure o publisher localhost no banco de dados:

1. Acesse o [Supabase Dashboard](https://bjuaxwdcsirvcjsoyxug.supabase.co)
2. Vá em **SQL Editor**
3. Execute o script: `scripts/setup-dev-publisher.sql`

Este script cria:
- Um publisher com slug `localhost`
- Um endpoint apontando para `http://localhost:8080/tessera/articles/:id`

### 2. Configuração dos Arquivos .env.local

Já criamos os arquivos `.env.local` para você! Eles sobrescrevem os arquivos `.env` de produção.

#### Frontend (.env.local)
```bash
# Localização: frontend/.env.local
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001
```

#### Gateway (.env.local)
```bash
# Localização: packages/gateway/.env.local
PORT=3001
SUPABASE_URL=https://bjuaxwdcsirvcjsoyxug.supabase.co
SUPABASE_ANON_KEY=[sua-key]
```

#### Publisher Server (.env.local)
```bash
# Localização: examples/publisher-server/.env.local
PORT=8080
TESSERA_PARTNER_SECRET=demo-tessera-key-for-publisher-auth
```

## 🚀 Rodando o Ambiente Local

### Opção 1: Rodar tudo manualmente

Abra 3 terminais:

**Terminal 1 - Gateway:**
```bash
cd packages/gateway
pnpm install
pnpm dev
# Gateway rodando em http://localhost:3001
```

**Terminal 2 - Publisher Server:**
```bash
cd examples/publisher-server
pnpm install
pnpm dev
# Publisher rodando em http://localhost:8080
```

**Terminal 3 - Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
# Frontend rodando em http://localhost:3000
```

### Opção 2: Usar o workspace root (recomendado)

```bash
# Na raiz do projeto
pnpm install

# Rodar todos os serviços (se configurado no package.json root)
pnpm dev
```

## 🧪 Testando o Setup

### Teste 1: Publisher Server
```bash
curl -H "X-Tessera-Key: demo-tessera-key" http://localhost:8080/tessera/articles/test-article
```

Deve retornar um JSON com título e conteúdo.

### Teste 2: Gateway Preview
```bash
curl "http://localhost:3001/preview?url=http://localhost:8080/article/test-article"
```

Deve retornar informações do publisher e preço.

### Teste 3: Frontend
1. Acesse http://localhost:3000
2. Teste fazer fetch de uma URL: `http://localhost:8080/article/ai-agents-2025`
3. Deve aparecer o preview com o preço de $0.01

## 🔍 Troubleshooting

### Erro: "Publisher not found for hostname: localhost"

**Causa:** O publisher localhost não está cadastrado no banco de dados.

**Solução:** Execute o script SQL em `scripts/setup-dev-publisher.sql`

### Erro: "Connection refused" no Gateway

**Causa:** O Gateway não está rodando ou está na porta errada.

**Solução:**
1. Verifique se o Gateway está rodando: `curl http://localhost:3001`
2. Verifique o `.env.local` do frontend tem `NEXT_PUBLIC_GATEWAY_URL=http://localhost:3001`

### Erro: "x402 not configured"

**Causa:** Faltam as variáveis de ambiente do Thirdweb.

**Solução:** Copie as variáveis do `.env` para o `.env.local` do gateway:
```bash
THIRDWEB_SECRET_KEY=...
THIRDWEB_SERVER_WALLET_ADDRESS=...
MERCHANT_WALLET_ADDRESS=...
```

### Publisher Server não responde

**Causa:** Pode estar rodando na porta errada ou não iniciado.

**Solução:**
1. Verifique se está rodando: `curl http://localhost:8080`
2. Verifique se o PORT no `.env.local` é 8080
3. Verifique se não há outro processo usando a porta 8080

## 🌍 Diferenças entre Dev e Produção

| Componente | Desenvolvimento | Produção |
|------------|----------------|----------|
| Frontend | http://localhost:3000 | Vercel/Railway |
| Gateway URL | http://localhost:3001 | tessera-production-352c.up.railway.app |
| Publisher | http://localhost:8080 | medium.com, nature.com, etc. |
| Supabase | Cloud (mesmo de prod) | Cloud |

## 📝 Notas Importantes

1. **Não commite arquivos .env.local**: Eles são ignorados pelo git e contêm configurações locais
2. **Use o mesmo Supabase**: Em dev, usamos o mesmo banco de produção para acessar publishers reais
3. **Publisher Key**: A key `demo-tessera-key-for-publisher-auth` deve ser a mesma no gateway e no publisher server
4. **Preços em dev**: Configure preços baixos (ex: $0.01) para testes com o publisher localhost

## 🆘 Precisa de Ajuda?

Se encontrar problemas não listados aqui, verifique:
1. Logs do terminal de cada serviço
2. Console do navegador (F12)
3. Network tab para ver requisições falhando

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca commite:
- Arquivos `.env.local`
- Keys privadas do Thirdweb
- Service role keys do Supabase
- API keys reais

Use sempre `.env.example` como template para outros desenvolvedores.
