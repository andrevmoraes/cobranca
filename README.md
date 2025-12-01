# Cobrança - Streamings

PWA para gerenciar cobranças de streamings compartilhados entre amigos.

## 🎯 Funcionalidades

- **Autenticação simples** por número de telefone
- **Gestão de usuários** (admin cadastra amigos)
- **Cadastro de streamings** com pagador definido
- **Divisão de custos** (igual ou personalizada)
- **Dashboard** com saldo entre usuários
- **Design Windows Phone** - tiles, cores vibrantes, tipografia clean

## 🚀 Tecnologias

- **React** + Vite
- **Supabase** (PostgreSQL + Auth)
- **PWA** (Service Worker + Manifest)
- **CSS puro** com tema Windows Phone

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o script `supabase-schema.sql` no SQL Editor
   - Copie `.env.example` para `.env` e adicione suas credenciais:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📊 Estrutura do Banco de Dados

### users
- `id` - UUID (PK)
- `nome` - Nome do usuário
- `telefone` - Número de telefone (único)
- `is_admin` - Se é administrador

### streamings
- `id` - UUID (PK)
- `nome` - Nome do streaming (Netflix, Disney+, etc)
- `valor_total` - Valor mensal total
- `dia_cobranca` - Dia do mês da cobrança
- `pagador_id` - Quem paga a conta (FK users)

### divisoes
- `id` - UUID (PK)
- `streaming_id` - Streaming (FK)
- `user_id` - Usuário (FK)
- `valor_personalizado` - Valor específico (null = divisão igual)

## 🎨 Design

Inspirado no Windows Phone:
- Tiles/cards flat
- Paleta de cores vibrantes
- Tipografia Segoe UI
- Animações sutis
- Layout responsivo

## 📱 PWA

O app funciona offline e pode ser instalado no smartphone como app nativo.

## 🔐 Autenticação

Login simplificado por telefone sem SMS. O admin cadastra os amigos e cada um loga com seu número.

## 💰 Como Funciona

1. Admin cadastra amigos
2. Qualquer usuário cadastra um streaming definindo quem paga
3. Adiciona pessoas que dividem o streaming
4. Dashboard calcula automaticamente os saldos
5. Mostra quanto cada pessoa deve/recebe

## 📝 Próximas Features

- Histórico de pagamentos
- Notificações de cobrança
- Categorias além de streaming
- Exportar relatórios
- Marcar pagamentos como realizados


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
