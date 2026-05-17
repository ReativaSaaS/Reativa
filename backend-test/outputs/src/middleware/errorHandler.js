/**
 * Middleware centralizado de tratamento de erros.
 * Captura qualquer erro não tratado e retorna resposta padronizada.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Erro de validação customizado
  if (err.code === "VALIDATION_ERROR") {
    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // Erro de recurso não encontrado
  if (err.code === "NOT_FOUND") {
    return res.status(404).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Erro de conflito (ex: email duplicado)
  if (err.code === "CONFLICT") {
    return res.status(409).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Erro genérico do servidor
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "Erro interno do servidor"
          : err.message,
    },
  });
}

module.exports = errorHandler;
