#!/bin/bash

# Substitua pelo seu endereço de wallet completo
WALLET="0x9d..." # <-- COLOQUE SEU ENDEREÇO COMPLETO AQUI

echo "🔍 Debugando usuário: $WALLET"
echo ""

# Se estiver rodando localmente
curl "http://localhost:3000/api/admin/debug-user?wallet=$WALLET" | jq

# Se estiver em produção, use:
# curl "https://tessera-frontend-nine.vercel.app/api/admin/debug-user?wallet=$WALLET" | jq
