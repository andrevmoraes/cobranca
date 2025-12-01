-- Dados de exemplo para testar a aplicação
-- Execute este script APÓS executar o supabase-schema.sql

-- Limpar dados existentes (cuidado em produção!)
DELETE FROM divisoes;
DELETE FROM streamings;
DELETE FROM users;

-- Inserir usuários de exemplo
INSERT INTO users (id, nome, telefone, is_admin) VALUES
  ('11111111-1111-1111-1111-111111111111', 'André', '11987654321', true),
  ('22222222-2222-2222-2222-222222222222', 'Amanda', '11976543210', false),
  ('33333333-3333-3333-3333-333333333333', 'Bruno', '11965432109', false),
  ('44444444-4444-4444-4444-444444444444', 'Carla', '11954321098', false);

-- Inserir streamings
-- Netflix pago por André, dividido com Amanda e Bruno
INSERT INTO streamings (id, nome, valor_total, dia_cobranca, pagador_id, criado_por) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Netflix', 45.90, 15, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');

INSERT INTO divisoes (streaming_id, user_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333');

-- YouTube Premium pago por Amanda, dividido com André
INSERT INTO streamings (id, nome, valor_total, dia_cobranca, pagador_id, criado_por) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'YouTube Premium', 20.90, 10, '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111');

INSERT INTO divisoes (streaming_id, user_id) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111');

-- Disney+ pago por André, dividido com todos
INSERT INTO streamings (id, nome, valor_total, dia_cobranca, pagador_id, criado_por) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Disney+', 33.90, 20, '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');

INSERT INTO divisoes (streaming_id, user_id) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444');

-- Spotify pago por Bruno, dividido com André e Carla
INSERT INTO streamings (id, nome, valor_total, dia_cobranca, pagador_id, criado_por) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Spotify', 21.90, 5, '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');

INSERT INTO divisoes (streaming_id, user_id) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444');

-- Resultado esperado para André:
-- Paga: Netflix (45.90/3 = 15.30 cada para Amanda e Bruno) + Disney+ (33.90/4 = 8.48 cada para 3 pessoas)
-- Recebe: 15.30 (Amanda) + 15.30 (Bruno) + 8.48 (Amanda) + 8.48 (Bruno) + 8.48 (Carla) = 56.04
--
-- Deve: YouTube Premium (20.90/2 = 10.45 para Amanda) + Spotify (21.90/3 = 7.30 para Bruno)
-- Total deve: 17.75
--
-- Saldo André: 56.04 - 17.75 = +38.29 (recebe)
