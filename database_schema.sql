-- ==============================================================================
-- ROTA NOVA — SCHEMA DE BANCO DE DADOS RELACIONAL (SQL)
-- Compatível com: PostgreSQL, MySQL, Supabase, SQLite, RDS
-- Projeto: Rota Nova Mobility Platform
-- Versão: 1.0.0
-- ==============================================================================

-- 1. TABELA DE USUÁRIOS (Clientes / Passageiros e Motoristas)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'cliente', -- 'cliente' | 'motorista' | 'admin'
    password_hash VARCHAR(255),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. TABELA DE PERFIS DE MOTORISTAS
CREATE TABLE IF NOT EXISTS driver_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    car_model VARCHAR(128) NOT NULL,
    car_plate VARCHAR(32) NOT NULL,
    cnh VARCHAR(64) NOT NULL,
    interview_passed BOOLEAN DEFAULT FALSE,
    interview_score INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    acceptance_rate DECIMAL(5, 2) DEFAULT 100.00,
    cancellation_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_rides INTEGER DEFAULT 0,
    hours_online DECIMAL(8, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_driver_profiles_online ON driver_profiles(is_online);

-- 3. TABELA DE LOCAIS FAVORITOS (Passageiros)
CREATE TABLE IF NOT EXISTS saved_locations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL, -- 'Casa', 'Trabalho', etc.
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_locations_user ON saved_locations(user_id);

-- 4. TABELA DE CORRIDAS (Rides / Viagens)
CREATE TABLE IF NOT EXISTS rides (
    id VARCHAR(64) PRIMARY KEY,
    ride_code VARCHAR(32) UNIQUE NOT NULL, -- Ex: 'ROT-9041'
    client_id VARCHAR(64) NOT NULL REFERENCES users(id),
    driver_id VARCHAR(64) REFERENCES driver_profiles(id),
    origin_address TEXT NOT NULL,
    origin_lat DECIMAL(10, 8) NOT NULL,
    origin_lng DECIMAL(11, 8) NOT NULL,
    destination_address TEXT NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'via_go', -- 'via_go' | 'via_plus' | 'via_eco' | 'via_delas' | 'via_black' | 'via_prime' | 'via_box' | 'via_pet'
    category_name VARCHAR(64) NOT NULL DEFAULT 'VIA GO',
    price DECIMAL(10, 2) NOT NULL,
    distance_km DECIMAL(6, 2),
    duration_minutes INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'searching', -- 'searching' | 'driver_en_route' | 'in_transit' | 'completed' | 'cancelled'
    payment_method VARCHAR(32) NOT NULL DEFAULT 'pix', -- 'pix' | 'cartao' | 'dinheiro'
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
    exception_type VARCHAR(64), -- 'pane_mecanica' | 'emergencia_seguranca'
    exception_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_rides_client ON rides(client_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_created ON rides(created_at DESC);

-- 5. TABELA DE AVALIAÇÕES DE CORRIDAS
CREATE TABLE IF NOT EXISTS ride_ratings (
    id VARCHAR(64) PRIMARY KEY,
    ride_id VARCHAR(64) NOT NULL UNIQUE REFERENCES rides(id) ON DELETE CASCADE,
    rater_id VARCHAR(64) NOT NULL REFERENCES users(id),
    rated_id VARCHAR(64) NOT NULL REFERENCES users(id),
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE LANÇAMENTOS FINANCEIROS DO MOTORISTA (Livro Razão / Ledger)
CREATE TABLE IF NOT EXISTS driver_financial_ledger (
    id VARCHAR(64) PRIMARY KEY,
    driver_id VARCHAR(64) NOT NULL REFERENCES driver_profiles(id) ON DELETE CASCADE,
    ride_id VARCHAR(64) REFERENCES rides(id) ON DELETE SET NULL,
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee_percent DECIMAL(5, 2) DEFAULT 10.00,
    platform_fee_amount DECIMAL(10, 2) NOT NULL, -- 10% Retenção Rota Nova
    fuel_estimate_amount DECIMAL(10, 2) DEFAULT 0.00, -- 20% Estimativa Combustível
    net_amount DECIMAL(10, 2) NOT NULL, -- Lucro Líquido no Bolso
    status VARCHAR(32) DEFAULT 'credited', -- 'pending' | 'credited' | 'withdrawn'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_driver ON driver_financial_ledger(driver_id);

-- 7. TABELA DE DENÚNCIAS E REGRAS DE CONDUTA
CREATE TABLE IF NOT EXISTS conduct_reports (
    id VARCHAR(64) PRIMARY KEY,
    reporter_id VARCHAR(64) NOT NULL REFERENCES users(id),
    reported_user_id VARCHAR(64) REFERENCES users(id),
    ride_id VARCHAR(64) REFERENCES rides(id),
    violation_type VARCHAR(64) NOT NULL, -- 'recusa_bairro' | 'cobrança_indevida' | 'desrespeito' | 'veiculo_inadequado'
    description TEXT NOT NULL,
    evidence_url VARCHAR(500),
    status VARCHAR(32) DEFAULT 'under_review', -- 'under_review' | 'penalized' | 'dismissed'
    penalty_applied VARCHAR(64), -- 'advertencia' | 'suspensao_7d' | 'banimento'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DADOS INICIAIS (SEED) PARA TESTE
-- ==============================================================================

INSERT INTO users (id, name, email, phone, role) VALUES 
('usr_juliana', 'Juliana Mendes', 'juliana@rotanova.com.br', '(61) 99876-5432', 'cliente'),
('usr_roberto', 'Roberto Barbosa', 'roberto@rotanova.com.br', '(61) 98765-4321', 'motorista')
ON CONFLICT (id) DO NOTHING;

INSERT INTO driver_profiles (id, user_id, car_model, car_plate, cnh, interview_passed, interview_score, is_online, rating, total_rides) VALUES
('drv_roberto', 'usr_roberto', 'Toyota Etios Sedan 1.5', 'ABC-5E67', '09876543210', TRUE, 100, TRUE, 4.98, 58)
ON CONFLICT (id) DO NOTHING;

INSERT INTO saved_locations (id, user_id, name, address, latitude, longitude) VALUES
('loc_1', 'usr_juliana', 'Casa', 'Sol Nascente, Trecho 3, Chácara 28 (Estrada de Chão) — DF', -15.8235, -48.1130),
('loc_2', 'usr_juliana', 'Trabalho', 'Eixo Monumental, Bloco A — Brasília, DF', -15.7934, -47.8884)
ON CONFLICT (id) DO NOTHING;
