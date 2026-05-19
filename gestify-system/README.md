# Gestify System

Painel administrativo para gestão de loja. **Todos os dados vêm do Supabase.**

## Variáveis de ambiente

| Variável | Onde usar | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Servidor | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente** API routes (`app/api/*`) | Sim |

A chave **publishable/anon** não é usada pelo Gestify hoje: o browser chama `/api/...` e o Next fala com o Supabase usando a **service_role**, que ignora RLS e evita erro ao criar produto/pedido.

### Como obter a service_role

1. [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto  
2. **Project Settings** → **API**  
3. Copie **service_role** (formato `eyJ...`) ou **secret** (`sb_secret_...`)  
4. Cole no `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Reinicie `npm run dev` após salvar.

> **Segurança:** não coloque a service_role em variáveis `NEXT_PUBLIC_*` nem no código do cliente.

## Setup

1. Execute `supabase/schema.sql` no **SQL Editor** do Supabase.  
2. Copie `.env.example` → `.env` e preencha as duas variáveis acima.  
3. `npm install` && `npm run dev`

## Testar

```bash
curl http://localhost:3000/api/health
# {"ok":true,"source":"supabase","productsCount":0}
```

Cadastre um produto no painel → confira em **Table Editor → products**.

## Deploy (Vercel)

- **Root Directory:** `gestify-system`  
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## API

| Rota | Descrição |
|------|-----------|
| `GET /api/health` | Testa conexão Supabase |
| `GET /api/bootstrap` | Carga inicial do painel |
| `/api/products`, `/api/orders`, … | CRUD |
