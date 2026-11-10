# 🏗️ M2A — Meeting to Architecture

![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Projeto acadêmico](https://img.shields.io/badge/Projeto-Acad%C3%AAmico-003e1f?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

> Transforme transcrições de reuniões em diagramas de arquitetura UML e C4 automaticamente com IA.

O **M2A (Meeting to Architecture)** é um projeto acadêmico da disciplina **Exploração Digital** da **Universidade Anhembi Morumbi**: uma plataforma web projetada para eliminar o trabalho manual de documentação técnica. Utilizando uma arquitetura de multi-agentes (Google Gemini + [Agent Development Kit](https://www.npmjs.com/package/@google/adk)), o M2A processa transcrições de reuniões (`.md` ou `.pdf`) e gera diagramas em formato Mermaid, que podem ser revisados, editados, exportados em SVG e compartilhados com um time.

Este repositório é um **monorepo npm workspaces** com duas aplicações:

| App | Caminho | Papel |
| :--- | :--- | :--- |
| **API** | [`apps/api`](apps/api) | Backend NestJS: autenticação, times, diagramas, aprovações e orquestração dos agentes de IA |
| **Web** | [`apps/web`](apps/web) | Frontend React + Vite: landing page, login/cadastro e o painel de diagramas, times e lixeira |

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário
    participant Web as Frontend (React)
    participant API as Backend (NestJS)
    box rgb(240, 240, 240) AI Intelligence Layer (ADK)
        participant Agent as Software Architect
        participant Analyzer as Transcript Analyzer
        participant Architect as Specialized Architect
    end
    participant Gemini as Google Gemini AI
    participant DB as PostgreSQL

    User->>Web: Upload .pdf / .md
    Web->>API: POST /agents/generate (File + Type)
    API->>Agent: Iniciar Orquestração
    Agent->>Analyzer: Analisar Transcrição
    Analyzer->>Gemini: Extrair contexto técnico
    Gemini-->>Analyzer: Technical Context
    Analyzer-->>Agent: Retorna Contexto
    Agent->>Architect: Gerar Diagrama (UML/C4)
    Architect->>Gemini: Gerar código Mermaid
    Gemini-->>Architect: Mermaid Code
    Architect-->>Agent: Retorna JSON (Title, Desc, Code)
    Agent-->>API: Resultado Final
    API->>API: Validação Rigorosa (Zod)
    API->>DB: Persistir Diagrama
    API-->>Web: 201 Created (Diagram Data)
    Web->>Web: Renderizar com Mermaid.js
    Web-->>User: Visualização do Diagrama
```

---

## ✨ O Problema
Documentar a arquitetura de um sistema após reuniões de design costuma ser uma tarefa lenta, sujeita a falhas humanas e frequentemente negligenciada. Transcrições de reuniões (Google Meet, Zoom, Teams) são ricas em detalhes, mas extrair essa estrutura manualmente para diagramas UML ou C4 exige tempo que os desenvolvedores prefeririam usar codificando.

---

## 🚀 A Solução
O M2A automatiza esse fluxo. Ao subir uma transcrição, a IA analisa o contexto técnico, identifica atores, componentes e fluxos, e gera o código Mermaid correspondente. O sistema permite a gestão de times com papéis, um fluxo de aprovação antes de um diagrama entrar no acervo do time e uma lixeira com restauração. Os prompts dos agentes ficam em arquivos Markdown versionados junto com o código, o que torna o comportamento da IA auditável.

---

## 🎯 Diferenciais
- **Fluxo sem etapas manuais**: Upload → Seleção do tipo → Diagrama pronto e salvo.
- **Arquitetura Multi-Agente**: um orquestrador e especialistas dedicados para análise, UML e C4.
- **Saída validada**: a resposta final dos agentes passa por um schema Zod antes de ser persistida.
- **Gestão de Times**: papéis inspirados no GitHub (`ADMIN`, `MAINTAINER`, `MEMBER`) e convites por e-mail.
- **Fluxo de Aprovação**: diagramas enviados por membros só entram no time depois de aprovados por um `ADMIN` ou `MAINTAINER`.
- **Lixeira**: exclusão lógica (soft delete) com restauração ou exclusão definitiva.
- **Exportação**: cópia do código Mermaid e download do diagrama renderizado em SVG.
- **Stack Docker com profiles**: banco, API e frontend sobem juntos ou separados.

---

## 🛠️ Stack Tecnológica

Versões conforme declaradas em [`apps/api/package.json`](apps/api/package.json), [`apps/web/package.json`](apps/web/package.json), nos Dockerfiles e no [`docker-compose.yml`](docker-compose.yml).

### Backend (`apps/api`)

| Camada | Tecnologia |
|---|---|
| **Runtime** | Node.js 22 (imagem `node:22-alpine`) |
| **Linguagem** | TypeScript ^5.7.3 |
| **Framework** | NestJS ^11.0.1 (`@nestjs/platform-express`, `@nestjs/config` ^4.0.4) |
| **Autenticação** | `@nestjs/jwt` ^11.0.2 (JWT Bearer, expiração de 24h) + bcrypt ^6.0.0 |
| **ORM & Migrations** | Prisma ^6.0.0 (`@prisma/client` ^6.0.0) |
| **Banco de Dados** | PostgreSQL 16 (imagem `postgres:16-alpine`) |
| **IA / Agentes** | `@google/adk` ^1.1.0 com Google Gemini (modelo padrão `gemini-1.5-flash`) |
| **Upload** | Multer (via `@nestjs/platform-express`, armazenamento em memória, limite de 10 MB) |
| **Validação** | Zod ^4.4.3 |
| **Qualidade** | ESLint ^9.18.0, Prettier ^3.4.2; Jest ^30.0.0 configurado (sem testes escritos) |

### Frontend (`apps/web`)

| Camada | Tecnologia |
|---|---|
| **Framework** | React ^18.3.1 |
| **Build / Dev server** | Vite ^6.0.0 (`@vitejs/plugin-react` ^4.3.4) |
| **Linguagem** | TypeScript ~5.7.0 |
| **Roteamento** | TanStack Router ^1.114.3 |
| **Design System** | Primer React ^37.12.0 (GitHub), `@primer/octicons-react` ^19.14.0, `@primer/primitives` ^11.9.0 |
| **Estilos** | Tailwind CSS ^4.1.0 (`@tailwindcss/vite`) + CSS Modules |
| **Diagramas** | Mermaid ^11.4.1 |
| **HTTP** | Axios ^1.16.1 com interceptor que injeta o token |
| **Servidor em produção** | Nginx (imagem `nginx:alpine`) servindo o build estático |

---

## 🏛️ Arquitetura

### Visão geral do monorepo

```mermaid
flowchart LR
    Browser[Navegador] --> Web["apps/web<br/>React + Vite<br/>:5173 dev / :8080 Docker"]
    Web -->|"HTTP + Bearer JWT<br/>(VITE_API_URL)"| API["apps/api<br/>NestJS<br/>:3000"]
    API -->|Prisma| DB[("PostgreSQL 16<br/>:5433 no host")]
    API -->|"@google/adk"| Gemini[Google Gemini API]
```

- O root [`package.json`](package.json) declara os workspaces `apps/*` e `packages/*` (a pasta `packages/` ainda não existe) e expõe atalhos para subir cada app.
- Não há pacote compartilhado entre API e Web: cada app tem seus próprios tipos e o contrato é o JSON trocado via HTTP.

### Backend (`apps/api`)

Cada domínio é um módulo NestJS em [`apps/api/src/modules`](apps/api/src/modules), sempre com o mesmo padrão de arquivos:

```
index.module.ts      ← Declaração do módulo NestJS
index.controller.ts  ← Rotas HTTP
index.service.ts     ← Regras de negócio e verificação de papéis
index.repository.ts  ← Acesso a dados via PrismaService
index.schema.ts      ← Schemas Zod e tipos (DTOs)
```

| Módulo | Prefixo | Responsabilidade |
| :--- | :--- | :--- |
| `auth` | `/auth` | Login, emissão do JWT, `AuthGuard` global, decorators `@SkipAuth()` e `@CurrentUser()` |
| `users` | `/user` | Cadastro, perfil, atualização, troca de senha e desativação do próprio usuário |
| `teams` | `/teams` | CRUD de times; quem cria vira `ADMIN` |
| `members` | `/members` | Listagem, troca de papel e remoção de membros |
| `invites` | `/invites` | Convites por e-mail e resposta do convidado |
| `diagrams` | `/diagrams` | Diagramas do próprio usuário, edição e exclusão lógica |
| `team-diagrams` | `/team-diagrams` | Diagramas do time, inclusão (direta ou por pedido de aprovação) e remoção |
| `approvals` | `/approvals` | Pedidos de inclusão de diagramas no time e suas respostas |
| `trash` | `/trash` | Lixeira: listar, restaurar e excluir definitivamente |
| `agents` | `/agents` | Upload da transcrição e orquestração dos agentes de IA |
| `prisma` | — | `PrismaService` global (conexão com o PostgreSQL) |

```mermaid
flowchart TD
    Req[Requisição HTTP] --> Guard["AuthGuard global (APP_GUARD)<br/>valida Bearer JWT, exceto @SkipAuth"]
    Guard --> Ctrl[Controller do módulo]
    Ctrl --> Zod["Schema Zod<br/>(nas rotas que validam o body)"]
    Ctrl --> Svc[Service<br/>regras e papéis do time]
    Svc --> Repo[Repository]
    Repo --> Prisma[PrismaService]
    Prisma --> DB[(PostgreSQL)]
    Ctrl -.->|/agents/generate| Agents[AgentService]
    Agents --> ADK["Runner do @google/adk<br/>software-architect"]
    ADK --> Gemini[Google Gemini]
    Agents -->|"DiagramResponseSchema (Zod)"| DiagramsSvc[DiagramsService.save]
    DiagramsSvc --> Repo
```

### 🤖 Arquitetura de Agentes
O módulo [`agents`](apps/api/src/modules/agents) usa o **@google/adk** para compor quatro agentes, todos sobre o mesmo modelo Gemini. Os prompts ficam em [`agents/prompts`](apps/api/src/modules/agents/agents/prompts) e são carregados em tempo de execução:

1. **Software Architect (Orchestrator)** — [`software-architect.md`](apps/api/src/modules/agents/agents/prompts/software-architect.md): recebe o arquivo e o tipo pedido, chama o analisador e depois decide entre o arquiteto UML ou C4. Os outros três agentes são expostos a ele como ferramentas (`AgentTool`).
2. **Transcript Analyzer** — [`transcript-analyzer.md`](apps/api/src/modules/agents/agents/prompts/transcript-analyzer.md): lê o documento bruto e extrai o "Technical Context": resumo, atores e componentes, fluxo lógico e decisões técnicas.
3. **UML Architect** — [`uml-architect.md`](apps/api/src/modules/agents/agents/prompts/uml-architect.md): transforma o contexto em Mermaid para os 13 tipos UML (estruturais e comportamentais), com regra de cabeçalho por tipo (`classDiagram`, `sequenceDiagram`, `flowchart` etc.).
4. **C4 Architect** — [`c4-architect.md`](apps/api/src/modules/agents/agents/prompts/c4-architect.md): gera diagramas C4 nos níveis Contexto, Container, Componente e Código (este último como `C4Component` com detalhe de classes).

Os arquitetos UML e C4 têm `inputSchema` e `outputSchema` definidos com Zod (`title`, `description`, `mermaid_code`). O `AgentService` remove blocos de código Markdown da resposta, valida o JSON com `DiagramResponseSchema` e só então salva o diagrama em nome do usuário. Arquivos `.md` são enviados como texto; `.pdf` como `inlineData` (base64) para o Gemini.

### Frontend (`apps/web`)

O código é organizado em **app / features / shared**:

```
app        ← Router (TanStack Router) e rota raiz com a sessão
features   ← Um diretório por domínio: auth, diagrams, landing, teams
   components  ← Telas, diálogos e cards
   hooks       ← Carregamento e ações da tela (use-diagrams, use-teams, use-team-detail, use-trash, use-auth)
   services    ← Chamadas HTTP da feature
   types       ← Tipos TypeScript
shared     ← Layout, sidebar, estados (loading/empty/error), toasts, cliente Axios, tokens de design e utilitários
```

```mermaid
flowchart LR
    Browser[Navegador] --> Router["TanStack Router<br/>rota /"]
    Router --> Root["__root.tsx<br/>lê token do localStorage<br/>GET /user/me"]
    Root -->|sem sessão| Landing[Landing] --> AuthFlow["AuthFlow<br/>e-mail → login ou cadastro"]
    Root -->|com sessão| Layout["AppLayout + Sidebar"]
    Layout --> Screens["DiagramsScreen / TeamsScreen / TrashScreen"]
    Screens --> Hooks[hooks da feature]
    Hooks --> Services[services da feature]
    Services --> Axios["shared/services/api<br/>Axios + Authorization: Bearer"]
    Axios --> API[M2A API]
    Screens --> Mermaid["Mermaid.js<br/>preview e export SVG"]
```

- Aliases de import `@/app`, `@/features` e `@/shared` são definidos em [`vite.config.ts`](apps/web/vite.config.ts).
- O token JWT fica em `localStorage` (`token`) e é enviado pelo interceptor do Axios em todas as requisições.
- A interface está em inglês.

---

## 🗄️ Modelo de Dados

Schema Prisma em [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma), com migrations em [`apps/api/prisma/migrations`](apps/api/prisma/migrations) (`init`, `align_diagram_type_uml_c4` e `add_team_description`). Todos os IDs são UUID gerados pelo banco (`gen_random_uuid()`).

```mermaid
erDiagram
    Users ||--o{ Team_Members : participa
    Teams ||--o{ Team_Members : possui
    Teams ||--o{ Team_Invites : recebe
    Users ||--o{ Team_Invites : "convida (invited_by)"
    Users |o--o{ Team_Invites : "é convidado (invited_user_id)"
    Users ||--o{ Diagrams : cria
    Teams |o--o{ Diagrams : agrupa
    Diagrams ||--o{ Diagram_Approval_Requests : "é pedido em"
    Teams ||--o{ Diagram_Approval_Requests : recebe
    Users ||--o{ Diagram_Approval_Requests : "solicita (requested_by)"
    Users |o--o{ Diagram_Approval_Requests : "revisa (reviewed_by)"

    Users {
        uuid id PK
        string name
        string email UK
        string password_hash
        boolean is_active
        timestamptz last_login_at
        timestamptz created_at
        timestamptz updated_at
    }
    Teams {
        uuid id PK
        string name
        string description
        timestamptz created_at
        timestamptz updated_at
    }
    Team_Members {
        uuid id PK
        uuid team_id FK
        uuid user_id FK
        role role
        timestamptz joined_at
        timestamptz created_at
    }
    Team_Invites {
        uuid id PK
        uuid team_id FK
        uuid invited_by FK
        uuid invited_user_id FK
        status status
        timestamptz created_at
    }
    Diagrams {
        uuid id PK
        string title
        string description
        diagram_type type
        string mermaid_code
        uuid created_by FK
        uuid team_id FK
        boolean is_deleted
        timestamptz created_at
        timestamptz updated_at
    }
    Diagram_Approval_Requests {
        uuid id PK
        uuid diagram_id FK
        uuid team_id FK
        uuid requested_by FK
        uuid reviewed_by FK
        approval_status status
        timestamptz requested_at
        timestamptz reviewed_at
    }
```

| Entidade (tabela) | Descrição |
| :--- | :--- |
| `User` (`Users`) | Conta com e-mail único e senha em hash bcrypt; `isActive` é desligado na desativação da conta |
| `Team` (`Teams`) | Time com nome e descrição opcional |
| `TeamMember` (`Team_Members`) | Vínculo usuário–time com o papel (`role`) |
| `TeamInvite` (`Team_Invites`) | Convite de um `ADMIN` para um usuário existente; apagado em cascata com o time |
| `Diagram` (`Diagrams`) | Diagrama gerado: título, descrição, tipo, código Mermaid, criador, time opcional e flag `isDeleted` |
| `ApprovalRequest` (`Diagram_Approval_Requests`) | Pedido de inclusão de um diagrama num time, com quem pediu, quem revisou e quando |

| Enum (tipo no banco) | Valores |
| :--- | :--- |
| `UserRole` (`role`) | `ADMIN`, `MEMBER`, `MAINTAINER` |
| `InviteStatus` (`status`) | `PENDING`, `ACCEPTED`, `REJECTED` |
| `ApprovalStatus` (`approval_status`) | `PENDING`, `ACCEPTED`, `REJECTED` |
| `DiagramType` (`diagram_type`) | 13 tipos UML + 4 tipos C4 (veja [Tipos de Diagrama Suportados](#-tipos-de-diagrama-suportados)) |

---

## 👥 Papéis e Regras de Negócio

Os papéis valem **por time** (`Team_Members.role`). Fora de times, cada usuário só enxerga e altera os próprios diagramas.

| Ação | `ADMIN` | `MAINTAINER` | `MEMBER` |
| :--- | :---: | :---: | :---: |
| Ver o time, seus membros e seus diagramas | ✅ | ✅ | ✅ |
| Editar nome/descrição ou excluir o time | ✅ | ❌ | ❌ |
| Convidar usuários por e-mail | ✅ | ❌ | ❌ |
| Alterar papéis e remover membros | ✅ | ❌ | ❌ |
| Incluir um diagrama no time | Direto | Por pedido de aprovação | Por pedido de aprovação |
| Ver e responder pedidos de aprovação do time | ✅ | ✅ | ❌ (recebe lista vazia) |
| Editar ou mover para a lixeira diagramas do time | ✅ | ✅ | Só os que criou |
| Remover um diagrama do time | ✅ | ❌ | ❌ |

- **Criação de time**: quem cria o time entra automaticamente como `ADMIN`.
- **Convites**: só funcionam para e-mails já cadastrados (caso contrário, 404). Ao aceitar, o convidado entra como `MEMBER`; recusar marca o convite como `REJECTED`.
- **Aprovação**: um pedido é recusado com 403 se o diagrama já tiver outro pedido `PENDING`. Ao aprovar, o diagrama recebe o `team_id`; o revisor e a data ficam registrados. Quem pediu pode cancelar o próprio pedido (o registro é apagado).
- **Exclusão de time**: numa transação, os diagramas do time voltam a ser pessoais (`team_id = null`) e membros, convites e pedidos de aprovação são apagados.
- **Lixeira (soft delete)**: `DELETE /diagrams/:id` só marca `is_deleted = true`. A lixeira lista os diagramas excluídos **criados pelo usuário**; restaurar e excluir definitivamente são exclusivos do criador.
- **Conta**: editar, trocar a senha (exige a senha atual) ou desativar só é permitido para o próprio usuário. A desativação é lógica (`is_active = false`).

---

## 🗺️ Telas & Rotas

O frontend usa o TanStack Router com **uma única rota de URL (`/`)**. A troca entre landing, login e painel acontece pelo estado de sessão em [`__root.tsx`](apps/web/src/app/router/routes/__root.tsx), e a navegação do painel (diagramas, times, lixeira) é feita pela sidebar, sem mudar a URL. URLs desconhecidas exibem a página 404 do router.

```mermaid
flowchart TD
    Root["/"] -->|sem token válido| Landing[Landing page]
    Landing -->|"Sign In / CTAs"| Email["Auth: etapa de e-mail<br/>GET /user/get-by-email/:email"]
    Email -->|e-mail existe| Login["Login<br/>POST /auth/login"]
    Email -->|e-mail novo| Signup["Cadastro<br/>POST /user"]
    Login --> Panel
    Signup --> Panel
    Root -->|token válido| Panel["Painel (AppLayout + Sidebar)"]
    Panel --> Diagrams[My Diagrams]
    Panel --> Teams[My Teams]
    Panel --> Trash[Trash]
    Diagrams -.dialog.-> New["New Diagram<br/>upload + tipo"]
    Diagrams -.-> Detail["Detalhe<br/>preview, copiar, exportar SVG, editar, excluir"]
    Diagrams -.drawer.-> MyReq[Meus pedidos de aprovação]
    Teams -.-> TeamDetail["Detalhe do time<br/>diagramas, convite, pedidos"]
    Teams -.dialog.-> Invites[Convites recebidos]
    Teams -.dialog.-> Members[Membros e papéis]
```

| Tela / visão | Como se chega | O que entrega | Acesso |
| :--- | :--- | :--- | :--- |
| Landing | `/` sem sessão | Hero, problema/solução, como funciona, tipos de diagrama, segurança e CTA | Público |
| Auth (e-mail → login ou cadastro) | **Sign In**, **Generate Your First Diagram** ou **Start for Free** na landing | Verifica se o e-mail existe e segue para login ou cadastro (senha com no mínimo 6 caracteres) | Público |
| My Diagrams | `/` com sessão (tela inicial) | Lista dos próprios diagramas, geração de novo diagrama, edição, exclusão, inclusão em time e acompanhamento dos pedidos de aprovação | Autenticado |
| Detalhe do diagrama | Clique num card | Preview Mermaid, copiar código, exportar SVG, editar e excluir | Criador ou `ADMIN`/`MAINTAINER` do time para editar/excluir |
| My Teams | Sidebar | Times com o papel do usuário, criação de time, convites recebidos; editar, membros e excluir para `ADMIN` | Autenticado |
| Detalhe do time | Clique num time | Diagramas do time; convite por e-mail (`ADMIN`); pedidos pendentes (`ADMIN`, `MAINTAINER`) | Membro do time |
| Trash | Sidebar | Diagramas excluídos pelo usuário, com restaurar e excluir definitivamente | Autenticado (criador) |

> O diálogo **New Diagram** oferece os 13 tipos UML e, no grupo C4, apenas **C4 Context**. Os demais níveis C4 (`C4_CONTAINER`, `C4_COMPONENT`, `C4_CODE`) estão disponíveis só pela API.

---

## 📁 Estrutura do Projeto

```text
meeting-to-architect-monorepo/
├── apps/
│   ├── api/                              # Backend NestJS (pacote m2a-api)
│   │   ├── prisma/
│   │   │   ├── schema.prisma             # Modelos, enums e datasource PostgreSQL
│   │   │   └── migrations/               # init, align_diagram_type_uml_c4, add_team_description
│   │   ├── src/
│   │   │   ├── main.ts                   # Bootstrap, CORS e porta (PORT ou 3000)
│   │   │   ├── app.module.ts             # ConfigModule global, módulos e AuthGuard global
│   │   │   ├── shared/
│   │   │   │   └── diagram-type.schema.ts  # Tipos UML/C4 em Zod
│   │   │   └── modules/
│   │   │       ├── agents/
│   │   │       │   ├── agents/           # software-architect, transcript-analyzer, uml-architect, c4-architect
│   │   │       │   │   └── prompts/      # System prompts em Markdown
│   │   │       │   └── helpers/          # file.helper (md/pdf → Gemini) e prompt.helper
│   │   │       ├── approvals/
│   │   │       ├── auth/                 # controller, guard, decorators, service, repository, schema
│   │   │       ├── diagrams/
│   │   │       ├── invites/
│   │   │       ├── members/
│   │   │       ├── prisma/               # PrismaService global
│   │   │       ├── team-diagrams/
│   │   │       ├── teams/
│   │   │       ├── trash/
│   │   │       └── users/
│   │   ├── .env.example                  # Modelo de variáveis da API
│   │   ├── Dockerfile                    # Build multi-stage; roda prisma migrate deploy ao iniciar
│   │   └── package.json
│   └── web/                              # Frontend React + Vite (pacote @m2a/web)
│       ├── src/
│       │   ├── main.tsx                  # Entrada: RouterProvider e temas Primer
│       │   ├── app/router/
│       │   │   ├── index.tsx             # createRouter + QueryClient no contexto
│       │   │   ├── routeTree.gen.ts      # Árvore de rotas gerada pelo TanStack Router
│       │   │   └── routes/               # __root.tsx (sessão, 404, erro) e index.tsx (painel)
│       │   ├── features/
│       │   │   ├── auth/                 # AuthFlow (EmailStep, LoginStep, SignupStep), use-auth, auth.service
│       │   │   ├── diagrams/             # Telas de diagramas, detalhe do time, lixeira, MermaidPreview e services
│       │   │   ├── landing/              # Seções da landing page
│       │   │   └── teams/                # TeamsScreen, diálogos de time, convites e membros
│       │   └── shared/
│       │       ├── components/           # AppLayout, Sidebar, Navbar, PanelBox, Empty/Error/LoadingState...
│       │       ├── constants/            # app-copy (textos) e tokens de design
│       │       ├── hooks/                # use-mobile, use-toast
│       │       ├── services/api/         # Cliente Axios com token
│       │       ├── styles/               # CSS global (Tailwind)
│       │       └── utils/                # cn, date-utils, error-capture, error-page
│       ├── .env                          # VITE_API_URL para o dev server
│       ├── Dockerfile                    # Build Vite + Nginx
│       ├── nginx.conf                    # SPA fallback e gzip
│       ├── vite.config.ts                # Plugins, aliases e porta 5173
│       └── package.json
├── docker-compose.yml                    # Serviços postgres, api e web com profiles
├── package.json                          # Workspaces e scripts globais
├── .prettierrc
└── LICENSE
```

---

## ⚡ Quick Start (recomendado: Docker)

### Pré-requisitos
- Docker e Docker Compose v2+
- Uma chave da API do Google Gemini (Google AI Studio)

### 1. Clone e configure
```bash
git clone https://github.com/matheusnascimentods/meeting-to-architect-monorepo.git
cd meeting-to-architect-monorepo
cp apps/api/.env.example apps/api/.env
```
Edite `apps/api/.env` e preencha `GEMINI_API_KEY`, `GEMINI_MODEL` (ex.: `gemini-1.5-flash`) e `JWT_SECRET`. O serviço `api` lê esse arquivo via `env_file`.

### 2. Subir com Docker (Stack Completa)
```bash
docker compose --profile db --profile api --profile web up -d --build
```
Ao iniciar, o container da API executa `prisma migrate deploy` antes de subir o servidor.

### 3. Subir partes separadas
- **Apenas Banco**: `docker compose --profile db up -d`
- **Apenas API**: `docker compose --profile api up -d --build`
- **Apenas Web**: `docker compose --profile web up -d --build`

| Serviço (compose) | URL | Porta no host |
| :--- | :--- | :--- |
| **Frontend** (`web`) | http://localhost:8080 | 8080 (`WEB_PORT`) → 80 no container |
| **Backend API** (`api`) | http://localhost:3000 | 3000 |
| **PostgreSQL** (`postgres`) | localhost:5433 | 5433 → 5432 no container |

> No Docker, a API se conecta ao banco por `host.docker.internal:5433` (o `docker-compose.yml` sobrescreve o `DATABASE_URL`), então o banco precisa estar publicado na porta 5433 do host — o profile `db` já faz isso. O frontend é compilado com `VITE_API_URL` (padrão `http://localhost:3000`), ou seja, o navegador chama a API diretamente.

### 4. Derrubando a stack
Para parar todos os serviços e manter os dados do banco:
```bash
docker compose --profile db --profile api --profile web down
```

Para remover tudo, incluindo os volumes de dados:
```bash
docker compose --profile db --profile api --profile web down -v
```

---

## 💻 Rodando Localmente (sem Docker)

### Pré-requisitos
- Node.js 22 (mesma versão das imagens Docker) e npm
- PostgreSQL acessível (o profile `db` do Docker é o caminho mais simples)

### Instalação passo a passo
1. **Instalar dependências** (na raiz, para todos os workspaces):
   ```bash
   npm install
   ```
   Os Dockerfiles usam `--legacy-peer-deps`; use a mesma flag se o npm reclamar de conflito de peer dependencies.
2. **Configurar a API**:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   O `DATABASE_URL` do exemplo já aponta para o Postgres do Docker em `localhost:5433`.
3. **Subir o banco, aplicar as migrations e gerar o Prisma Client**:
   ```bash
   docker compose --profile db up -d
   cd apps/api
   npx prisma migrate deploy
   npx prisma generate
   cd ../..
   ```
4. **Iniciar os serviços**:
   ```bash
   npm run dev:api  # Terminal 1 → http://localhost:3000
   npm run dev:web  # Terminal 2 → http://localhost:5173
   ```
   O frontend lê `VITE_API_URL` de [`apps/web/.env`](apps/web/.env) (`http://localhost:3000`).

---

## 💻 Comandos Úteis

### Raiz do monorepo
```bash
npm run dev:api   # nest start --watch em apps/api
npm run dev:web   # vite em apps/web
```

### API (`apps/api`)
```bash
npm run --prefix apps/api build        # nest build
npm run --prefix apps/api start        # nest start
npm run --prefix apps/api start:dev    # nest start --watch
npm run --prefix apps/api start:debug  # nest start --debug --watch
npm run --prefix apps/api start:prod   # node dist/main --watch
npm run --prefix apps/api lint         # eslint --fix
npm run --prefix apps/api format       # prettier --write

# Prisma (rodar dentro de apps/api para carregar o .env)
npx prisma migrate deploy   # aplica as migrations
npx prisma migrate dev      # cria uma nova migration a partir do schema
npx prisma generate         # gera o Prisma Client
npx prisma studio           # inspeciona o banco no navegador
```

### Web (`apps/web`)
```bash
npm run --prefix apps/web dev      # servidor de desenvolvimento (porta 5173)
npm run --prefix apps/web build    # tsc -b && vite build
npm run --prefix apps/web preview  # serve o build localmente
```

---

## 🔌 API Reference

Todas as rotas exigem `Authorization: Bearer <token>`, exceto as marcadas como 🔓 Público (decorator `@SkipAuth()`). As rotas não têm prefixo global e, quando o papel não é atendido, a API responde 403; um time do qual o usuário não participa responde 404 ou 403, conforme a rota. A coluna **Acesso** descreve a regra aplicada no service.

### 🔐 Auth (`/auth`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Login e geração do token JWT (24h) | 🔓 Público |

**Exemplo de Request:**
```json
{
  "email": "dev@example.com",
  "password": "strongpassword"
}
```

**Exemplo de Response:**
```json
{
  "message": "Login successful",
  "user": { "id": "uuid-v4", "email": "dev@example.com", "name": "Jane Doe" },
  "token": "<jwt>"
}
```

---

### 👤 Users (`/user`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/user` | Cadastro (`email`, `password`, `name`); responde `{ message, token }`. E-mail repetido → 409 | 🔓 Público |
| `GET` | `/user/get-by-email/:email` | Busca usuário por e-mail (usada na etapa de e-mail do login) | 🔓 Público |
| `GET` | `/user/me` | Dados do usuário logado | ✅ Autenticado |
| `GET` | `/user/:id` | Busca usuário por ID | ✅ Autenticado |
| `PATCH` | `/user/:id` | Atualiza `name` e/ou `email` | ✅ Só o próprio usuário |
| `PATCH` | `/user/:id/password` | Troca a senha (`currentPassword`, `newPassword`); senha atual errada → 401. Responde 204 | ✅ Só o próprio usuário |
| `DELETE` | `/user/:id` | Desativa a conta (`is_active = false`). Responde 204 | ✅ Só o próprio usuário |

**Exemplo de Response (`GET /user/me`):**
```json
{
  "id": "uuid-v4",
  "email": "jane@m2a.com",
  "name": "Jane Doe",
  "created_at": "2026-06-03T16:04:41.000Z"
}
```

---

### 👥 Teams (`/teams`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/teams` | Times do usuário, no formato `[{ team_id, role, Teams }]` | ✅ Autenticado |
| `POST` | `/teams` | Cria um time (`name` com no mínimo 2 caracteres, `description` opcional); o criador vira `ADMIN` | ✅ Autenticado |
| `GET` | `/teams/:id` | Time e papel do usuário (`{ role, Teams }`) | ✅ Membro |
| `PATCH` | `/teams/:id` | Atualiza nome e descrição | ✅ `ADMIN` |
| `DELETE` | `/teams/:id` | Exclui o time (diagramas voltam a ser pessoais). Responde 204 | ✅ `ADMIN` |

---

### 🧑‍🤝‍🧑 Members (`/members`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/members/team/:teamId` | Membros com papel, data de entrada e dados do usuário | ✅ Membro |
| `PATCH` | `/members/team/:teamId/user/:userId/role` | Altera o papel de um membro (`{ "role": "admin" \| "maintainer" \| "member" }`) | ✅ `ADMIN` |
| `PATCH` | `/members/team/:teamId/roles` | Altera papéis em lote (`{ "updates": [{ "userId", "role" }] }`) numa transação | ✅ `ADMIN` |
| `DELETE` | `/members/team/:teamId/user/:userId` | Remove um membro. Responde 204 | ✅ `ADMIN` |
| `DELETE` | `/members/team/:teamId/batch` | Remove vários membros (`{ "userIds": [...] }`). Responde 204 | ✅ `ADMIN` |

---

### ✉️ Invites (`/invites`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/invites/me` | Convites `PENDING` recebidos, com o nome do time | ✅ Autenticado |
| `POST` | `/invites/team/:teamId` | Convida um usuário cadastrado (`{ "email" }`); e-mail sem conta → 404 | ✅ `ADMIN` |
| `PATCH` | `/invites/:id/respond` | Aceita ou recusa (`{ "accept": true }`); aceitar adiciona como `MEMBER` | ✅ Só o convidado |

---

### 📊 Diagrams (`/diagrams`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/diagrams` | Diagramas criados pelo usuário e fora da lixeira, mais recentes primeiro | ✅ Autenticado |
| `PATCH` | `/diagrams/:id` | Atualiza `title`, `description`, `mermaid_code` e/ou `type` | ✅ Criador ou `ADMIN`/`MAINTAINER` do time |
| `DELETE` | `/diagrams/:id` | Soft delete (move para a lixeira). Responde 204 | ✅ Criador ou `ADMIN`/`MAINTAINER` do time |

---

### 🗃️ Team Diagrams (`/team-diagrams`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/team-diagrams/team/:teamId` | Diagramas do time fora da lixeira (`teamId` validado como UUID) | ✅ Membro |
| `POST` | `/team-diagrams/:id/add-to-team` | Inclui o diagrama no time (`{ "team_id": "uuid" }`): `ADMIN` inclui direto; demais papéis criam um pedido de aprovação | ✅ Membro |
| `DELETE` | `/team-diagrams/:id/remove-from-team` | Desvincula o diagrama do time | ✅ `ADMIN` do time do diagrama |

---

### ✅ Approvals (`/approvals`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/approvals/team/:teamId` | Pedidos `PENDING` do time, com diagrama e solicitante; `MEMBER` recebe `[]` | ✅ Membro |
| `GET` | `/approvals/diagram/:diagramId` | Times com pedido `PENDING` para o diagrama (`[{ teamId }]`) | ✅ Autenticado |
| `GET` | `/approvals/my-requests` | Todos os pedidos feitos pelo usuário, com diagrama e time | ✅ Autenticado |
| `PATCH` | `/approvals/:id/respond` | Aprova ou recusa (`{ "approve": true }`); aprovar vincula o diagrama ao time | ✅ `ADMIN`/`MAINTAINER` |
| `DELETE` | `/approvals/:id/cancel` | Cancela (apaga) o próprio pedido. Responde 204 | ✅ Só quem pediu |

---

### 🗑️ Trash (`/trash`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/trash` | Diagramas excluídos criados pelo usuário | ✅ Autenticado |
| `PATCH` | `/trash/:id/restore` | Restaura o diagrama. Responde 204 | ✅ Criador |
| `DELETE` | `/trash/:id` | Exclui definitivamente. Responde 204 | ✅ Criador |

---

### 🤖 Agents (`/agents`)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/agents/generate` | Gera e salva um diagrama via IA (multipart). Responde 201 | ✅ Autenticado |

**Request Body (Multipart):**
- `file`: Arquivo `.md` ou `.pdf` (até 10 MB)
- `diagramType`: Enum (ex: `CLASS`, `C4_CONTAINER`) — valor inválido → 400 com a lista de tipos aceitos

**Exemplo de Response:**
```json
{
  "id": "uuid-v4",
  "title": "Checkout Flow",
  "description": "Sequência de chamadas do checkout...",
  "mermaid_code": "sequenceDiagram\n  participant User ...",
  "created_by": "uuid-v4",
  "type": "SEQUENCE"
}
```

---

## 🗂️ Variáveis de Ambiente

### API (`apps/api/.env`)
Lidas pelo `ConfigModule` do NestJS (arquivo `.env` no diretório de execução da API) ou via `env_file` no Docker. Modelo em [`apps/api/.env.example`](apps/api/.env.example).

| Variável | Descrição | Obrigatória | Default |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão PostgreSQL usada pelo Prisma | Sim | `.env.example`: `postgresql://postgres:password@localhost:5433/diagrams_db?schema=public` (no Docker, o compose usa `host.docker.internal:5433`) |
| `GEMINI_API_KEY` | Chave da API do Google Gemini (Google AI Studio) | Sim, para gerar diagramas | - |
| `GEMINI_MODEL` | Modelo Gemini usado pelos agentes | Recomendada | `gemini-1.5-flash` no código, **só quando a variável não existe**: a linha `GEMINI_MODEL=` vazia do `.env.example` resulta em string vazia, então preencha-a ou remova-a |
| `JWT_SECRET` | Segredo de assinatura e validação dos tokens JWT | Sim (na prática) | `default_secret` se vazia ou ausente — nunca use em ambiente compartilhado |
| `PORT` | Porta HTTP da API | Não | `3000` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | Presentes no `.env.example`, mas **não são lidas pelo código atual** | Não | - |

### Web (`apps/web/.env`)
Variáveis `VITE_*` são embutidas no bundle **em tempo de build**.

| Variável | Descrição | Obrigatória | Default |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API usada pelo Axios | Sim | `http://localhost:3000` (em `apps/web/.env` e como build arg no compose) |

### Docker Compose
| Variável | Descrição | Default |
| :--- | :--- | :--- |
| `WEB_PORT` | Porta do host para o frontend | `8080` |
| `VITE_API_URL` | Build arg do serviço `web` | `http://localhost:3000` |

O Postgres do compose usa credenciais fixas de desenvolvimento: usuário `postgres`, senha `password`, banco `diagrams_db`.

---

## 🔒 Segurança & Boas Práticas
- **Autenticação**: JWT Bearer (payload `sub` e `email`, expiração de 24h) validado por um `AuthGuard` global; só login, cadastro e busca por e-mail são públicos.
- **Senhas**: armazenadas com hash bcrypt (custo 10), nunca em texto plano.
- **Autorização por time**: services verificam o papel do usuário no time antes de alterar times, membros, convites, aprovações e diagramas do time.
- **Auditabilidade da IA**: os prompts dos agentes estão em arquivos Markdown versionados no código.
- **Validação da IA**: a resposta final dos agentes passa por um schema Zod (`DiagramResponseSchema`) antes de chegar ao banco; o tipo de diagrama e a extensão/tamanho do arquivo também são validados no upload.
- **Validação de entrada**: os bodies de times, convites, aprovações e inclusão em time são validados com Zod no controller.

### Limitações conhecidas
- **Validação parcial**: login, cadastro, atualização de usuário, edição de diagrama e rotas de membros recebem o body sem validação Zod, e não há filtro para `ZodError`: erros de schema voltam como 500.
- **Conta desativada ainda faz login**: o login não verifica `is_active`.
- **Exclusão definitiva com pedidos de aprovação**: a FK de `Diagram_Approval_Requests` é `RESTRICT`, então excluir da lixeira um diagrama que já teve pedido de aprovação falha.
- **Segredos padrão**: `JWT_SECRET` cai para `default_secret` e o Postgres do compose usa senha fixa.
- **CORS aberto**: `origin: true` com `credentials: true` aceita qualquer origem.
- **Sessão no navegador**: o token fica em `localStorage`, sem refresh token; ao expirar, é preciso entrar de novo.
- **Mermaid com `securityLevel: "loose"`**: o código gerado pela IA é renderizado nesse modo no frontend.
- **Upload divergente**: o frontend aceita `.txt`, `.vtt` e `.srt`, mas a API só aceita `.pdf` e `.md` (400 para os demais).
- **Sem resiliência dedicada para a IA**: não há retry nem circuit breaker; erros reportados pelo agente e respostas fora do schema voltam como 400.
- **Sem testes nem CI**: o Jest está configurado na API, mas não há arquivos de teste nem workflow de CI; a API também não tem arquivo de configuração do ESLint versionado.
- **Dependências não utilizadas**: o `package.json` da API declara `@supabase/supabase-js` e o do web declara pacotes não importados no código (Radix UI, Recharts, styled-components, entre outros); o TanStack Query só fornece o `QueryClientProvider`.

---

## 📊 Tipos de Diagrama Suportados

| Categoria | Tipos |
| :--- | :--- |
| **UML Structural** | CLASS, PACKAGE, OBJECT, COMPONENT, DEPLOYMENT, COMPOSITE_STRUCTURE |
| **UML Behavioral** | ACTIVITY, SEQUENCE, COMMUNICATION, INTERACTION_OVERVIEW, TIMING, USE_CASE, STATE |
| **C4 Model** | C4_CONTEXT, C4_CONTAINER, C4_COMPONENT, C4_CODE |

---

## 🎓 Contexto Acadêmico

Projeto acadêmico desenvolvido para a disciplina **Exploração Digital** da **Universidade Anhembi Morumbi**.

---

## 🤝 Contribuindo
1. Faça um Fork do projeto
2. Crie uma branch para a sua funcionalidade (`git checkout -b feature/nome-da-feature`)
3. Rode `npm run --prefix apps/api build` e `npm run --prefix apps/web build`
4. Faça o commit das suas alterações (`git commit -m 'feat: implementa nova funcionalidade'`)
5. Envie para o repositório remoto (`git push origin feature/nome-da-feature`)
6. Abra um **Pull Request** detalhando as alterações

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais detalhes.

---
Feito com ❤️ por [@matheusnascimentods](https://github.com/matheusnascimentods)
