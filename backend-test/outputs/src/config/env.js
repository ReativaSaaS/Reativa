require("dotenv").config();

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validação: variáveis obrigatórias
const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
for (const key of required) {
  if (!env[key]) {
    console.error(`[ERRO] Variável de ambiente obrigatória não definida: ${key}`);
    process.exit(1);
  }
}

module.exports = env;
