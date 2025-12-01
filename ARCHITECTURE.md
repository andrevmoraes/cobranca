> Conteúdo consolidado em `README.md`.

Este arquivo existe apenas por compatibilidade histórica. Todas as informações relevantes foram unificadas e reorganizadas em `README.md`.

Você pode remover este arquivo do repositório se desejar.
cobranca/
├── public/
│   ├── icon-192.svg          # Ícone PWA 192x192
│   ├── icon-512.svg          # Ícone PWA 512x512
│   ├── manifest.json         # Configuração PWA
│   └── sw.js                 # Service Worker (cache offline)
│
├── src/
│   ├── components/
│   │   └── BottomNav.jsx     # Navegação inferior (Windows Phone style)
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx   # Context de autenticação
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx     # Dashboard com saldos
│   │   ├── Login.jsx         # Tela de login
│   │   ├── Streamings.jsx    # CRUD de streamings
│   │   └── Users.jsx         # Gestão de usuários (admin)
│   │
│   ├── services/
│   │   └── supabase.js       # Cliente Supabase
│   │
│   ├── styles/
│   │   ├── global.css        # Reset + variáveis globais
│   │   ├── tiles.css         # Tiles estilo Windows Phone
│   │   ├── buttons.css       # Estilos de botões
│   │   ├── forms.css         # Estilos de formulários
│   │   └── navigation.css    # Navegação bottom bar
│   │
│   ├── App.jsx               # Componente principal + roteamento
│   └── main.jsx              # Entry point + Service Worker
│
├── .env.example              # Template de variáveis de ambiente
├── dados-exemplo.sql         # Dados de teste
├── supabase-schema.sql       # Schema do banco
├── SETUP_SUPABASE.md         # Guia de configuração Supabase
├── QUICK_START.md            # Guia de início rápido
└── README.md                 # Documentação principal
```

## 🎨 Sistema de Design

### Cores (Windows Phone)
- **Primary**: `#00aff0` (Azul WP)
- **Secondary**: `#00aba9` (Teal)
- **Accent**: `#ff8c00` (Laranja)
- **Success**: `#00a300` (Verde)
- **Danger**: `#e51400` (Vermelho)
- **Purple/Pink/Lime**: Cores adicionais para tiles

### Tipografia
- **Font**: Segoe UI (fallback: system-ui)
- **Weights**: Light (300), Regular (400), Semibold (600), Bold (700)

### Layout
- **Tiles/Cards**: Flat design, sem sombras fortes
- **Espaçamento**: 4px, 8px, 16px, 24px, 32px
- **Border Radius**: Mínimo (0-2px)

## 🔄 Fluxo de Dados

### Autenticação
1. Usuário insere telefone
2. `AuthContext` valida no Supabase
3. Dados salvos no localStorage
4. App renderiza páginas autenticadas

### Dashboard
1. Carrega divisões do usuário
2. Carrega streamings pagos pelo usuário
3. Calcula saldos por pessoa
4. Renderiza tiles coloridos

### Streamings
1. Lista todos os streamings
2. Modal para criar novo
3. Seleção de pagador
4. Checkboxes para divisão
5. Salva no Supabase

### Usuários (Admin)
1. Verifica se é admin
2. Lista todos os usuários
3. Modal para criar novo
4. Formatação de telefone

## 🗄️ Estrutura do Banco

### users
```sql
id: UUID (PK)
nome: VARCHAR
telefone: VARCHAR (unique)
is_admin: BOOLEAN
created_at: TIMESTAMP
```

### streamings
```sql
id: UUID (PK)
nome: VARCHAR
valor_total: DECIMAL
dia_cobranca: INTEGER
pagador_id: UUID (FK → users)
criado_por: UUID (FK → users)
created_at: TIMESTAMP
```

### divisoes
```sql
id: UUID (PK)
streaming_id: UUID (FK → streamings)
user_id: UUID (FK → users)
valor_personalizado: DECIMAL (nullable)
created_at: TIMESTAMP
```

## 🔐 Segurança

- **RLS (Row Level Security)**: Habilitado
- **Políticas**: Leitura/escrita liberada (app interno)
- **Auth**: Sem senha, apenas validação de telefone cadastrado
- **Admin**: Apenas admins gerenciam usuários

## 📱 PWA Features

- **Offline**: Service Worker cacheia assets
- **Instalável**: Manifest.json configurado
- **Responsivo**: Mobile-first design
- **Ícones**: SVG escaláveis

## 🚀 Performance

- **Vite**: Build otimizado
- **React**: Virtual DOM eficiente
- **Supabase**: Queries otimizadas com joins
- **Índices**: DB indexado por telefone, pagador, streaming, user

## 🎯 Próximas Melhorias

- [ ] Histórico de pagamentos
- [ ] Marcar pagamentos como realizados
- [ ] Notificações push
- [ ] Valores personalizados na divisão
- [ ] Categorias além de streaming
- [ ] Exportar relatórios PDF/CSV
- [ ] Dark/Light mode toggle
- [ ] Gráficos de gastos
