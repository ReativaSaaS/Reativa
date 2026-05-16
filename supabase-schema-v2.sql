-- =============================================
-- REATIVA - Schema Completo v2
-- Execute no SQL Editor do Supabase
-- =============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  company TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  plan_status TEXT DEFAULT 'inactive' CHECK (plan_status IN ('inactive', 'active', 'cancelled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CLIENTS
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'interessado', 'ativo', 'recorrente', 'inativo', 'perdido')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  source TEXT,
  last_interaction TIMESTAMPTZ,
  days_inactive INTEGER DEFAULT 0,
  response_rate NUMERIC(5,2) DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID,
  content TEXT NOT NULL,
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  channel TEXT DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'sms', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CAMPAIGNS
-- =============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'reativacao' CHECK (type IN ('reativacao', 'promocao', 'followup', 'boasvindas', 'custom')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
  target_status TEXT[],
  target_tags TEXT[],
  target_days_inactive INTEGER,
  message_template TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ALERTS
-- =============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('client_inactive', 'no_response', 'high_interest', 'opportunity', 'campaign_result', 'system')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  suggestion TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed', 'acted')),
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUTOMATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('status_change', 'days_inactive', 'new_client', 'no_response', 'tag_added', 'manual')),
  trigger_config JSONB DEFAULT '{}',
  action_type TEXT NOT NULL CHECK (action_type IN ('send_message', 'change_status', 'add_tag', 'create_alert', 'send_campaign')),
  action_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  executions_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMptZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOG
-- =============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_last_interaction ON clients(last_interaction);
CREATE INDEX IF NOT EXISTS idx_clients_days_inactive ON clients(days_inactive);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients
CREATE POLICY "Users can manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (auth.uid() = user_id);

-- Campaigns
CREATE POLICY "Users can manage own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "Users can manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);

-- Automations
CREATE POLICY "Users can manage own automations" ON automations FOR ALL USING (auth.uid() = user_id);

-- Activity Log
CREATE POLICY "Users can manage own activity" ON activity_log FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate days inactive for all clients
CREATE OR REPLACE FUNCTION calculate_days_inactive()
RETURNS void AS $$
BEGIN
  UPDATE clients
  SET days_inactive = COALESCE(EXTRACT(DAY FROM NOW() - last_interaction)::INTEGER, 0)
  WHERE last_interaction IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Auto-update client status based on inactivity
CREATE OR REPLACE FUNCTION auto_update_client_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.days_inactive > 60 AND NEW.status NOT IN ('perdido', 'inativo') THEN
    NEW.status = 'perdido';
  ELSIF NEW.days_inactive > 30 AND NEW.status NOT IN ('perdido', 'inativo', 'novo') THEN
    NEW.status = 'inativo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate alerts for inactive clients
CREATE OR REPLACE FUNCTION generate_inactive_alerts()
RETURNS void AS $$
DECLARE
  client_rec RECORD;
BEGIN
  FOR client_rec IN
    SELECT c.* FROM clients c
    WHERE c.days_inactive >= 5
    AND c.status NOT IN ('perdido')
    AND NOT EXISTS (
      SELECT 1 FROM alerts a
      WHERE a.client_id = c.id
      AND a.type = 'client_inactive'
      AND a.status = 'unread'
      AND a.created_at > NOW() - INTERVAL '7 days'
    )
  LOOP
    INSERT INTO alerts (user_id, client_id, type, priority, title, description, suggestion)
    VALUES (
      client_rec.user_id,
      client_rec.id,
      'client_inactive',
      CASE
        WHEN client_rec.days_inactive > 30 THEN 'critical'
        WHEN client_rec.days_inactive > 14 THEN 'high'
        ELSE 'medium'
      END,
      'Cliente inativo: ' || client_rec.name,
      client_rec.name || ' está sem interação há ' || client_rec.days_inactive || ' dias.',
      CASE
        WHEN client_rec.days_inactive > 30 THEN 'Enviar mensagem personalizada com oferta especial de retorno.'
        WHEN client_rec.days_inactive > 14 THEN 'Enviar mensagem de reengajamento perguntando se precisam de algo.'
        ELSE 'Enviar mensagem de check-in amigável.'
      END
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update campaign stats
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status = 'pending' THEN
    UPDATE campaigns SET sent_count = sent_count + 1 WHERE id = NEW.campaign_id;
  ELSIF NEW.status = 'delivered' AND OLD.status = 'sent' THEN
    UPDATE campaigns SET delivered_count = delivered_count + 1 WHERE id = NEW.campaign_id;
  ELSIF NEW.status = 'read' AND OLD.status != 'read' THEN
    UPDATE campaigns SET read_count = read_count + 1 WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update client last_interaction on new message
CREATE OR REPLACE FUNCTION update_client_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clients
  SET last_interaction = NEW.created_at,
      total_messages = total_messages + 1,
      days_inactive = 0
  WHERE id = NEW.client_id;

  -- If inbound message, update status
  IF NEW.direction = 'inbound' THEN
    UPDATE clients
    SET status = CASE
      WHEN status IN ('inativo', 'perdido', 'novo') THEN 'interessado'
      ELSE status
    END
    WHERE id = NEW.client_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Log activity
CREATE OR REPLACE FUNCTION log_client_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (user_id, client_id, action, details)
  VALUES (
    NEW.user_id,
    NEW.id,
    TG_ARGV[0],
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- New user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update client status
CREATE TRIGGER auto_client_status BEFORE UPDATE OF days_inactive ON clients FOR EACH ROW EXECUTE FUNCTION auto_update_client_status();

-- Update client on message
CREATE TRIGGER on_message_created AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_client_interaction();

-- Campaign stats
CREATE TRIGGER on_message_status_change AFTER UPDATE OF status ON messages FOR EACH ROW EXECUTE FUNCTION update_campaign_stats();

-- Activity logging
CREATE TRIGGER log_client_insert AFTER INSERT ON clients FOR EACH ROW EXECUTE FUNCTION log_client_activity('client_created');
CREATE TRIGGER log_client_update AFTER UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION log_client_activity('client_updated');

-- =============================================
-- VIEWS
-- =============================================

-- Dashboard metrics view
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status IN ('ativo', 'recorrente')) as active_clients,
  COUNT(*) FILTER (WHERE status = 'inativo') as inactive_clients,
  COUNT(*) FILTER (WHERE status = 'perdido') as lost_clients,
  COUNT(*) FILTER (WHERE status = 'novo') as new_clients,
  COUNT(*) FILTER (WHERE status = 'interessado') as interested_clients,
  COUNT(*) FILTER (WHERE days_inactive > 30) as at_risk_clients,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_this_week,
  ROUND(AVG(response_rate), 1) as avg_response_rate,
  SUM(total_revenue) as total_revenue
FROM clients
GROUP BY user_id;

-- Recent alerts view
CREATE OR REPLACE VIEW recent_alerts AS
SELECT
  a.*,
  c.name as client_name,
  c.phone as client_phone
FROM alerts a
LEFT JOIN clients c ON a.client_id = c.id
WHERE a.status = 'unread'
ORDER BY
  CASE a.priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  a.created_at DESC;
