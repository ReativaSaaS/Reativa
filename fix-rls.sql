-- =============================================
-- FIX RLS - Reativar segurança por usuário
-- Execute no SQL Editor do Supabase
-- =============================================

-- Reabilitar RLS em todas as tabelas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can manage own clients" ON clients;
DROP POLICY IF EXISTS "Users can manage own messages" ON messages;
DROP POLICY IF EXISTS "Users can manage own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can manage own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can manage own automations" ON automations;
DROP POLICY IF EXISTS "Users can manage own activity" ON activity_log;

-- Criar políticas corretas (cada usuário vê só seus dados)
CREATE POLICY "Users can manage own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts" ON alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own automations" ON automations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own activity" ON activity_log
  FOR ALL USING (auth.uid() = user_id);
