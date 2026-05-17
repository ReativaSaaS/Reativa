-- =============================================
-- Schema: Tabela de Usuários
-- Projeto: API REST de Cadastro de Usuários
-- Banco: PostgreSQL (Supabase)
-- =============================================

-- Habilita extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Remove tabela se existir (cuidado em produção!)
-- DROP TABLE IF EXISTS users;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice único no email para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Índice para busca por nome (busca parcial)
CREATE INDEX IF NOT EXISTS idx_users_name ON users (name);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at antes de cada UPDATE
DROP TRIGGER IF EXISTS set_updated_at ON users;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- Obrigatório no Supabase para tabelas expostas
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: permite leitura pública (anon) — ajuste conforme necessidade
CREATE POLICY "Permitir leitura pública de usuários"
    ON users
    FOR SELECT
    USING (true);

-- Política: permite inserção pública — em produção, restrinja a authenticated
CREATE POLICY "Permitir inserção de usuários"
    ON users
    FOR INSERT
    WITH CHECK (true);

-- Política: permite atualização pública — em produção, restrinja ao próprio usuário
CREATE POLICY "Permitir atualização de usuários"
    ON users
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política: permite deleção pública — em produção, restrinja ao próprio usuário
CREATE POLICY "Permitir deleção de usuários"
    ON users
    FOR DELETE
    USING (true);

-- Concede permissões às roles do Supabase
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
