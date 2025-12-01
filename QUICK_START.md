# 🚀 Início Rápido

## ⚡ Setup em 5 Minutos

### 1. Configure o Supabase

```bash
# Siga as instruções em SETUP_SUPABASE.md
# Resumo: Criar projeto → Executar supabase-schema.sql → Copiar credenciais
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas credenciais do Supabase
```

### 3. Inicie a aplicação

```bash
# Já está instalado! Apenas inicie:
npm run dev
```

### 4. Faça login

- Primeiro, crie um usuário admin via SQL (veja SETUP_SUPABASE.md)
- Ou use os dados de exemplo (`dados-exemplo.sql`)
- Telefone do André: `11987654321` (se usar dados de exemplo)

## 🎯 Fluxo de Uso

1. **Login** → Digite telefone cadastrado
2. **Usuários** → Admin cadastra amigos
3. **Streamings** → Cadastre serviços e defina quem paga
4. **Dashboard** → Veja os saldos automaticamente

## 📱 Instalar como App

1. Acesse via navegador mobile
2. Menu → "Adicionar à tela inicial"
3. Use como app nativo!

## 💡 Exemplo Prático

**Cenário:** Você paga Netflix (R$ 45,90) e divide com 2 amigos.

1. Vá em **Streamings** → Adicionar
2. Nome: `Netflix`
3. Valor: `45.90`
4. Quem paga: `Você`
5. Dividir com: Selecione os amigos
6. Salvar

**Dashboard mostrará:** Cada amigo deve R$ 15,30 para você!

## 🎨 Personalização

- Cores: Edite `src/styles/global.css` (variáveis `--wp-*`)
- Layout: Componentes em `src/components/`
- Lógica: Páginas em `src/pages/`

## 🐛 Problemas Comuns

**Tela branca?**
- Verifique o console (F12)
- Confirme se o .env está configurado

**Não carrega dados?**
- Verifique credenciais Supabase
- Confirme que executou o schema SQL

**Erro de telefone?**
- Use apenas números (11 dígitos)
- Exemplo: 11987654321 (não use formatação)
