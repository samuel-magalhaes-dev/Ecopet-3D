# 🌱 EcoPet 3D — Ecommerce Fullstack

Plataforma de ecommerce ecológica para venda de filamentos 3D reciclados (PET), com planos de assinatura, autenticação JWT, carrinho persistente, checkout visual e finalização automática via WhatsApp.

---

## 🚀 Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion  
**Backend:** Node.js + Express + Prisma ORM + PostgreSQL + JWT + bcryptjs

---

## ⚙️ Instalação Rápida

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente

### 1. Frontend (raiz do projeto)
```bash
npm install
cp .env.example .env
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edite `backend/.env` com suas credenciais do PostgreSQL:
```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/ecopet?schema=public"
JWT_SECRET="ecopet3d_super_secret_jwt_key_2024"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

Crie o banco antes:
```sql
CREATE DATABASE ecopet;
```

### 3. Migrations e Seed
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Rodar o projeto

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

---

## 🔗 Rotas da API

| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/auth/register` | - |
| POST | `/api/auth/login` | - |
| GET | `/api/auth/me` | ✅ |
| GET | `/api/products` | - |
| GET | `/api/plans` | - |
| GET/POST | `/api/cart` | ✅ |
| POST | `/api/orders` | ✅ |

---

## 💡 Fluxo do Checkout

1. Adiciona itens → clica "Finalizar Compra"
2. Se não logado → redireciona para login
3. Se logado → modal de checkout
4. Preenche dados → confirma pedido
5. Pedido salvo no banco → WhatsApp aberto com mensagem automática

---

## 📱 WhatsApp: +55 88 9983 0658
