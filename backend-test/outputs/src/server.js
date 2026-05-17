const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// =============================================
// Middleware de segurança
// =============================================
app.use(helmet());
app.use(cors());

// Rate limiting global: máximo 100 requisições por IP a cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Muitas requisições. Tente novamente em 15 minutos.",
    },
  },
});
app.use(limiter);

// =============================================
// Middleware de parsing
// =============================================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// =============================================
// Health check
// =============================================
app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// =============================================
// Rotas da API
// =============================================
app.use("/users", userRoutes);

// =============================================
// 404 - Rota não encontrada
// =============================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Rota não encontrada",
    },
  });
});

// =============================================
// Error handler centralizado
// =============================================
app.use(errorHandler);

// =============================================
// Inicia o servidor
// =============================================
app.listen(env.PORT, () => {
  console.log(`[INFO] Servidor rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
  console.log(`[INFO] Health check: http://localhost:${env.PORT}/health`);
  console.log(`[INFO] API de usuários: http://localhost:${env.PORT}/users`);
});
