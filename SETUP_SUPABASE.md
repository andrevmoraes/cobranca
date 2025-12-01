# Configuração do Supabase

## Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha um nome, senha do banco e região
5. Aguarde a criação do projeto

## Passo 2: Executar Script SQL

1. No menu lateral, clique em "SQL Editor"
2. Clique em "+ New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar

Isso criará:
- Tabela `users` (usuários)
- Tabela `streamings` (serviços de streaming)
- Tabela `divisoes` (divisão de custos)
- Índices para performance
- Políticas de segurança (RLS)

## Passo 3: Configurar Variáveis de Ambiente

1. No Supabase, vá em "Settings" > "API"
2. Copie a "Project URL" 
3. Copie a "anon public" key
4. No projeto, crie um arquivo `.env` na raiz (copie de `.env.example`)
5. Cole as credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

## Passo 4: Criar Primeiro Usuário Admin

No SQL Editor do Supabase, execute:

```sql
INSERT INTO users (nome, telefone, is_admin)
VALUES ('Seu Nome', '11999999999', true);
```

Substitua:
- `'Seu Nome'` pelo seu nome
- `'11999999999'` pelo seu telefone (11 dígitos sem formatação)

## Passo 5: Testar a Aplicação

1. No terminal, execute: `npm run dev`
2. Acesse `http://localhost:5173`
3. Faça login com o telefone cadastrado
4. Pronto! Agora você pode:
   - Cadastrar amigos (menu Usuários)
   - Adicionar streamings (menu Streamings)
   - Ver saldos (Dashboard)

## Observações Importantes

- **Telefone**: Use apenas números (DDD + 9 dígitos). Ex: 11987654321
- **Admin**: Apenas usuários com `is_admin = true` podem gerenciar outros usuários
- **Segurança**: As políticas RLS estão configuradas para permitir leitura/escrita para todos (app interno). Para produção, ajuste conforme necessário.

## Troubleshooting

### Erro: "Failed to fetch"
- Verifique se as credenciais do `.env` estão corretas
- Confirme que o projeto Supabase está ativo

### Erro: "User não encontrado"
- Certifique-se de que o usuário foi criado no banco
- Verifique se o telefone está sem formatação (só números)

### Não consigo criar streaming
- Verifique se há usuários cadastrados
- Confirme que você está logado
