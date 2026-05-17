/**
 * Middleware de validação de input para criação e atualização de usuários.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida os dados de criação de usuário.
 */
function validateCreateUser(req, res, next) {
  const errors = [];
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push({ field: "name", message: "Nome é obrigatório e deve ter pelo menos 2 caracteres" });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Email inválido" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push({ field: "password", message: "Senha é obrigatória e deve ter pelo menos 6 caracteres" });
  }

  if (errors.length > 0) {
    const err = new Error("Dados de entrada inválidos");
    err.code = "VALIDATION_ERROR";
    err.details = errors;
    return next(err);
  }

  // Sanitiza os dados
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
}

/**
 * Valida os dados de atualização de usuário (todos opcionais, mas pelo menos um obrigatório).
 */
function validateUpdateUser(req, res, next) {
  const errors = [];
  const { name, email, password } = req.body || {};

  if (!name && !email && !password) {
    errors.push({ field: "body", message: "Informe ao menos um campo para atualizar (name, email ou password)" });
  }

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    errors.push({ field: "name", message: "Nome deve ter pelo menos 2 caracteres" });
  }

  if (email !== undefined && (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()))) {
    errors.push({ field: "email", message: "Email inválido" });
  }

  if (password !== undefined && (typeof password !== "string" || password.length < 6)) {
    errors.push({ field: "password", message: "Senha deve ter pelo menos 6 caracteres" });
  }

  if (errors.length > 0) {
    const err = new Error("Dados de entrada inválidos");
    err.code = "VALIDATION_ERROR";
    err.details = errors;
    return next(err);
  }

  // Sanitiza os dados presentes
  if (name) req.body.name = name.trim();
  if (email) req.body.email = email.trim().toLowerCase();

  next();
}

/**
 * Valida o parâmetro UUID no path.
 */
function validateUUID(req, res, next) {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(req.params.id)) {
    const err = new Error("ID inválido: deve ser um UUID válido");
    err.code = "VALIDATION_ERROR";
    err.details = [{ field: "id", message: "Formato UUID esperado" }];
    return next(err);
  }
  next();
}

module.exports = { validateCreateUser, validateUpdateUser, validateUUID };
