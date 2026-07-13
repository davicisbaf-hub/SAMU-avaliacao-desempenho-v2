![Descrição](src/assets/cisbaf.png)

![Version](https://img.shields.io/badge/version-1.0.0-blue)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

# SAMU - Sistema de Avaliação de Desempenho v2

**Plataforma web para gerenciamento e avaliação de desempenho de profissionais do SAMU** (Serviço de Atendimento Móvel de Urgência).

---

## 📋 Sobre o Projeto

Sistema completo de avaliação de desempenho que permite:
- ✅ Criar e gerenciar avaliações para diferentes categorias profissionais
- ✅ Registrar fichas de avaliação com critérios específicos
- ✅ Visualizar relatórios e KPIs de desempenho
- ✅ Exportar avaliações em PDF
- ✅ Autenticação segura com JWT

---

## 🏗️ Arquitetura

**Full-Stack TypeScript**

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │  REST   │   Backend        │
│   React 19.2    │◄───────►│   Express 5.2    │
│   TypeScript    │  API    │   TypeScript     │
│   Vite          │         │   JWT Auth       │
└─────────────────┘         └────────┬─────────┘
                                     │
                            ┌────────▼─────────┐
                            │   PostgreSQL     │
                            │   Banco de Dados │
                            └──────────────────┘
```

---

## 📂 Estrutura do Projeto

```
SAMU-avaliacao-desempenho-v2/
│
├── 📁 api/                         # Backend Express.js
│   ├── server.ts                   # Servidor principal
│   ├── pool.ts                     # Conexão PostgreSQL
│   ├── ScalarDocs.yaml             # Documentação OpenAPI
│   ├── middleware/
│   │   └── auth.ts                 # Middleware JWT
│   ├── routes/                     # Definição de rotas
│   │   ├── auth.ts                 # Autenticação
│   │   ├── usuarios.ts             # Usuários
│   │   ├── avaliacoes.ts           # Avaliações
│   │   ├── criterios.ts            # Critérios
│   │   ├── kpis.ts                 # Relatórios
│   │   └── auxiliares.ts           # Utilitários
│   └── controllers/                # Lógica de negócio
│       ├── authController.ts
│       ├── usuariosController.ts
│       ├── avaliacoesController.ts
│       ├── criteriosController.ts
│       ├── kpisController.ts
│       └── auxiliaresController.ts
│
├── 📁 src/                         # Frontend React
│   ├── main.tsx                    # Entrada da aplicação
│   ├── App.tsx                     # Componente raiz
│   ├── 📁 Pages/                   # Páginas principais
│   │   ├── Login.tsx               # Autenticação
│   │   ├── Cadastro.tsx            # Registro
│   │   ├── Inicio.tsx              # Dashboard
│   │   ├── Painel.tsx              # Painel KPI
│   │   ├── Avaliacao.tsx           # Gestão avaliações
│   │   ├── BaixarFicha.tsx         # Export PDF
│   │   ├── PlanoDesenvolvimento.tsx # Plano desenvolvimento
│   │   ├── Configuracoes.tsx       # Settings
│   │   ├── Como-avaliar.tsx        # Guia
│   │   └── Help.tsx                # Ajuda
│   ├── 📁 Fichas/                  # Fichas por categoria
│   │   ├── FichaAvaliacaoMedico.tsx
│   │   ├── FichaAvaliacaoEnf.tsx
│   │   ├── FichaAvaliacaoTecEnf.tsx
│   │   ├── FichaAvaliacaoCondutor.tsx
│   │   ├── FichaAvaliacaoLiderado-lideranca.tsx
│   │   ├── FichaAvaliacaoLideranca-liderado.tsx
│   │   └── FichaAvaliacaoPar.tsx
│   ├── 📁 components/              # Componentes reutilizáveis
│   │   ├── PrivateRoute.tsx        # Proteção de rotas
│   │   ├── PrivateRoutePerfil.tsx  # Proteção por perfil
│   │   ├── FichaAvaliacaoTemplate.tsx # Template base
│   │   ├── Header.tsx              # Cabeçalho
│   │   ├── Nav.tsx                 # Navegação
│   │   ├── KPICard.tsx             # Card de KPI
│   │   ├── StatusCardsKPI.tsx      # Status
│   │   ├── table.tsx               # Tabela
│   │   ├── table-avaliacao.tsx     # Tabela avaliações
│   │   ├── fichas-card.tsx         # Card fichas
│   │   ├── Assinatura.tsx          # Assinatura
│   │   └── ui/                     # Componentes shadcn
│   ├── 📁 contexts/                # State global
│   │   └── UserSession.tsx         # Contexto do usuário
│   ├── 📁 hooks/                   # Custom hooks
│   │   └── useAuthFetch.ts         # Hook autenticado
│   ├── 📁 lib/                     # Utilitários
│   │   └── utils.ts                # Funções auxiliares
│   ├── 📁 assets/                  # Imagens e ícones
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── index.css                   # Estilos base
│   └── App.css                     # Estilos globais
│
│
├── 📁 public/                      # Assets estáticos
│   ├── favicon.png
│   └── icons.svg
│
├── 📄 docker-compose.yml           # Orquestração Docker
├── 📄 Dockerfile.api               # Build API
├── 📄 Dockerfile.frontend          # Build Frontend
├── 📄 package.json                 # Dependências
├── 📄 vite.config.ts               # Config Vite
├── 📄 tsconfig.json                # Config TypeScript
├── 📄 eslint.config.js             # Linting
├── 📄 .env                         # Variáveis ambiente
└── 📄 .gitignore
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+

### 3️⃣ Variáveis de Ambiente

Criar arquivo `.env`:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/samu
JWT_SECRET=seu_secret_super_seguro_aqui

# Frontend
VITE_API_URL=http://localhost:3001
```

---

## 🔐 Autenticação & Segurança

- **JWT (JSON Web Tokens)** para autenticação stateless
- **bcrypt** para hash de senhas
- Middleware de autenticação em todas as rotas protegidas
- Proteção de rotas no frontend com componentes `PrivateRoute`
- Validação de perfil em `PrivateRoutePerfil`

---

## 📊 Categorias de Avaliação

Sistema suporta avaliação para:

| Categoria | Ficha | Descrição |
|-----------|-------|-----------|
| 👨‍⚕️ Médico | `FichaAvaliacaoMedico.tsx` | Desempenho clínico |
| 👩‍⚕️ Enfermeiro | `FichaAvaliacaoEnf.tsx` | Práticas de enfermagem |
| 🏥 Técnico Enf. | `FichaAvaliacaoTecEnf.tsx` | Suporte técnico |
| 🚗 Condutor | `FichaAvaliacaoCondutor.tsx` | Habilidades dirigir |
| 👔 Liderança | `FichaAvaliacaoLideranca-liderado.tsx` | Avaliação superior |
| 👤 Liderado | `FichaAvaliacaoLiderado-lideranca.tsx` | Avaliação subordinado |
| 👥 Pares | `FichaAvaliacaoPar.tsx` | Avaliação entre colegas |

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev       # Frontend em dev (http://localhost:5173)
npm run api       # Backend em dev (http://localhost:3001)
npm run build     # Build production (TS + Vite)
npm run lint      # ESLint check
npm run preview   # Visualizar build
```

---

## 📚 Principais Funcionalidades

### 📋 Fichas de Avaliação
- Formulários específicos por categoria profissional
- Campos multi-choice e texto livre
- Escala de avaliação (1-5)
- Assinatura digital

### 📈 Dashboard & KPIs
- Visualização em tempo real
- Gráficos de performance
- Filtros por período e categoria
- Status das avaliações

### 📥 Exportação de Relatórios
- Download em PDF
- Captura de layout visual
- Tabelas formatadas
- Assinaturas incluídas

### 👥 Gestão de Usuários
- Cadastro e autenticação
- Perfis e permissões
- Histórico de avaliações

---


## 📖 Documentação API

**Scalar/OpenAPI** disponível em:
- Arquivo: `api/ScalarDocs.yaml`
- URL (quando rodando): `http://localhost:3001/docs`

---


## Manual Sistema
📄 **Manual completo**: [Baixar PDF](docs/manual-sistema.pdf)

---

## 🎨 Tecnologias Frontend

- **Tailwind CSS** - Styling responsivo
- **shadcn/ui** - Componentes de UI
- **Material-UI** - Componentes avançados
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

---


## ⚙️ Configurações Importantes

- **TypeScript**: Configurado em `tsconfig.json`
- **Vite**: Configurado em `vite.config.ts`
- **ESLint**: Configurado em `eslint.config.js`
- **Componentes**: Configurado em `components.json`

---