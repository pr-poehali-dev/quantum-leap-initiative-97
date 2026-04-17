CREATE TABLE IF NOT EXISTS t_p75850838_quantum_leap_initiat.users (
    id SERIAL PRIMARY KEY,
    verify_method VARCHAR(10) NOT NULL,
    verify_value VARCHAR(255) NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p75850838_quantum_leap_initiat.user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p75850838_quantum_leap_initiat.users(id),
    relationship_status VARCHAR(50),
    name VARCHAR(100),
    age INTEGER,
    gender VARCHAR(50),
    height INTEGER,
    weight INTEGER,
    eye_color VARCHAR(30),
    city VARCHAR(100),
    about_me TEXT,
    photos JSONB DEFAULT '[]',
    everyday_interests JSONB DEFAULT '[]',
    intimate_interests JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p75850838_quantum_leap_initiat.verify_codes (
    id SERIAL PRIMARY KEY,
    verify_value VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '10 minutes'),
    used BOOLEAN DEFAULT FALSE
);
