-- SQL para criar a tabela operational_commands no Supabase
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS operational_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_type TEXT NOT NULL,
    payload JSONB,
    issued_by UUID NOT NULL REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_operational_commands_issued_by ON operational_commands(issued_by);
CREATE INDEX IF NOT EXISTS idx_operational_commands_created_at ON operational_commands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_operational_commands_status ON operational_commands(status);

-- Habilitar RLS (Row Level Security)
ALTER TABLE operational_commands ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam todos os comandos
CREATE POLICY "Users can view all operational commands" ON operational_commands
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir que apenas operators e admins criem comandos
CREATE POLICY "Operators and admins can create commands" ON operational_commands
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM "User"
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );

-- Política para permitir que operators e admins atualizem comandos
CREATE POLICY "Operators and admins can update commands" ON operational_commands
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM "User"
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );