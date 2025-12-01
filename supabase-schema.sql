-- Criação das tabelas
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(11) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS streamings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  dia_cobranca INTEGER CHECK (dia_cobranca >= 1 AND dia_cobranca <= 31),
  pagador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  criado_por UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS divisoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  streaming_id UUID NOT NULL REFERENCES streamings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  valor_personalizado DECIMAL(10, 2), -- NULL = divisão igual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(streaming_id, user_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_users_telefone ON users(telefone);
CREATE INDEX idx_streamings_pagador ON streamings(pagador_id);
CREATE INDEX idx_divisoes_streaming ON divisoes(streaming_id);
CREATE INDEX idx_divisoes_user ON divisoes(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE streamings ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (todos podem ler tudo - app simples)
CREATE POLICY "Permitir leitura para todos" ON users FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para todos" ON streamings FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para todos" ON divisoes FOR SELECT USING (true);

-- Apenas admin pode inserir/atualizar usuários
CREATE POLICY "Admin pode inserir users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode atualizar users" ON users FOR UPDATE USING (true);

-- Todos podem criar streamings e divisões
CREATE POLICY "Permitir insert streamings" ON streamings FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update streamings" ON streamings FOR UPDATE USING (true);
CREATE POLICY "Permitir delete streamings" ON streamings FOR DELETE USING (true);

CREATE POLICY "Permitir insert divisoes" ON divisoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update divisoes" ON divisoes FOR UPDATE USING (true);
CREATE POLICY "Permitir delete divisoes" ON divisoes FOR DELETE USING (true);
