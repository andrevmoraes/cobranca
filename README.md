## Cobrança — Streamings (PWA)

Aplicação PWA para gerenciar cobranças de serviços de streaming compartilhados entre amigos. Permite cadastrar serviços, definir quem paga, dividir valores (igual ou personalizado) e visualizar saldos por usuário.

**Objetivo:** facilitar o controle de custos compartilhados de assinaturas e prover uma interface leve, offline-capable e instalável.

---

## Funcionalidades principais

- Autenticação por número de telefone (login sem senha)
- Gestão de usuários (criação/edição por admin)
- Cadastro e edição de streamings (nome, valor, dia de cobrança, pagador)
- Divisão de custos: divisão igual ou valores personalizados por participante
- Dashboard com cálculo automático de saldos entre usuários
- Design inspirado no Windows Phone (tiles, palette vibrante)
- PWA: service worker, manifest e instalação em dispositivos

---

## Tecnologias

- React + Vite
- Supabase (PostgreSQL + Auth)
- PWA (Service Worker + Manifest)
- CSS puro (estrutura de estilos em `src/styles/`)

---

## Estrutura do projeto (resumo)

```
cobranca/
├── public/                 # assets públicos, manifest, service worker
├── src/
│   ├── components/         # componentes reutilizáveis (BottomNav, Alert...)
│   ├── contexts/           # AuthContext
│   ├── pages/              # páginas (Dashboard, Login, Streamings, Users)
│   ├── services/           # integração com Supabase
│   └── styles/             # css: global, forms, buttons, tiles, navigation
├── dados-exemplo.sql       # dados de exemplo para popular o DB
├── supabase-schema.sql     # schema do banco (tables, indices, RLS)
├── SETUP_SUPABASE.md       # passo-a-passo para configurar Supabase
├── QUICK_START.md          # instruções rápidas de setup e uso
└── README.md               # este arquivo
```

---

## Banco de dados (visão técnica)

Tabelas principais e campos (resumo do `supabase-schema.sql`):

- `users`
   - `id` UUID (PK)
   - `nome` VARCHAR
   - `telefone` VARCHAR (único)
   - `is_admin` BOOLEAN
   - `created_at` TIMESTAMP

- `streamings`
   - `id` UUID (PK)
   - `nome` VARCHAR
   - `valor_total` DECIMAL
   - `dia_cobranca` INTEGER
   - `pagador_id` UUID (FK → users)
   - `criado_por` UUID (FK → users)
   - `created_at` TIMESTAMP

- `divisoes`
   - `id` UUID (PK)
   - `streaming_id` UUID (FK → streamings)
   - `user_id` UUID (FK → users)
   - `valor_personalizado` DECIMAL (nullable; null = divisão igual)
   - `created_at` TIMESTAMP

Índices recomendados já incluídos no schema: índices por `telefone`, `pagador_id`, `streaming_id`.

---

## Arquitetura e fluxo de dados

- Autenticação: `AuthContext` valida o telefone junto ao Supabase e persiste estado no `localStorage`.
- Dashboard: carrega divisões e streamings do usuário, calcula saldos por pessoa e exibe em tiles.
- Streamings: lista, criação via modal, seleção de pagador, seleção de participantes e divisão automática ou personalizada.
- Usuários: área restrita a admins para listar/criar/editar usuários.

RLS (Row Level Security) está habilitado no schema; políticas no projeto atual permitem leitura/escrita típicas para app interno — ajustar para produção.

---

## Design e tema

- Paleta principal inspirada no Windows Phone: `#00aff0` (primary), `#00aba9` (secondary), `#ff8c00` (accent), `#00a300` (success), `#e51400` (danger).
- Tipografia: Segoe UI (fallback: system-ui)
- Layout: tiles flat, espaçamento consistente (4/8/16/24/32), bordas mínimas.

Arquivos de estilo: `src/styles/global.css`, `tiles.css`, `buttons.css`, `forms.css`, `navigation.css`.

---

## Configuração (Supabase) — resumo

1. Criar projeto em https://supabase.com
2. Executar o conteúdo de `supabase-schema.sql` no SQL Editor (cria tabelas, índices e políticas)
3. Copiar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para um arquivo `.env` (use `.env.example` como modelo)

Exemplo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

4. Criar o primeiro usuário admin (exemplo SQL):

```sql
INSERT INTO users (nome, telefone, is_admin)
VALUES ('Seu Nome', '11999999999', true);
```

Notas:
- Telefones devem estar em formato numérico sem formatação (11 dígitos, ex: `11987654321`).
- Em ambiente de produção, revise as políticas RLS e chaves do Supabase.

---

## Início rápido (desenvolvimento)

Instale dependências e inicie o servidor de desenvolvimento:

```powershell
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador. Faça login com o telefone cadastrado no banco.

Para popular dados de exemplo use `dados-exemplo.sql` via SQL Editor do Supabase.

---

## PWA & Deploy

- Service Worker em `public/sw.js` fornece caching básico para o modo offline.
- `public/manifest.json` configurado para instalação em dispositivos móveis.
- Build para produção com Vite: `npm run build` (ver `package.json`).

---

## Segurança

- Autenticação: login por telefone (sem senha). Admins controlam criação de usuários.
- RLS habilitado (ajustar políticas para produção).
- Não exponha chaves anon em repositórios públicos; use variáveis de ambiente no deploy.

---

## Operação e tarefas futuras

Prioridade média / backlog identificado:

- Histórico de pagamentos e marcação de pagamentos realizados
- Notificações push para cobranças
- Valores personalizados mais flexíveis na divisão
- Exportação de relatórios (CSV/PDF)
- Suporte a categorias além de streaming
- Dark/Light mode toggle

---

## Desenvolvimento colaborativo

- Estrutura limpa de componentes em `src/components/`
- Contexto de autenticação em `src/contexts/AuthContext.jsx`
- Serviços e integrações em `src/services/supabase.js`

Contribuições são bem-vindas: abra issues descrevendo o escopo e envie PRs com mudanças pequenas e bem documentadas.

---

## Referências internas

- Arquivos principais: `supabase-schema.sql`, `dados-exemplo.sql`, `SETUP_SUPABASE.md`, `QUICK_START.md`.
- Páginas principais: `src/pages/Dashboard.jsx`, `src/pages/Login.jsx`, `src/pages/Streamings.jsx`, `src/pages/Users.jsx`.

---

**Atualização do README:** se novos arquivos `.md` forem adicionados e alterarem significativamente o contexto (novas políticas de segurança, mudanças no schema, ou novos fluxos), atualize este README para refletir tais mudanças.

