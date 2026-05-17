const bcrypt = require("bcrypt");
const supabase = require("../config/database");

const TABLE = "users";
const SALT_ROUNDS = 10;

/**
 * Remove o campo password do objeto de resposta.
 */
function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

/**
 * POST /users
 * Cria um novo usuário.
 */
async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Verifica se o email já existe
    const { data: existing, error: findError } = await supabase
      .from(TABLE)
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const err = new Error("Já existe um usuário cadastrado com este email");
      err.code = "CONFLICT";
      throw err;
    }

    // Hashea a senha
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ name, email, password: hashedPassword })
      .select("id, name, email, created_at, updated_at")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: sanitizeUser(data),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users
 * Lista todos os usuários com paginação.
 */
async function listUsers(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Busca os usuários
    const { data, error, count } = await supabase
      .from(TABLE)
      .select("id, name, email, created_at, updated_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      data: data.map(sanitizeUser),
      meta: { page, limit, total: count || data.length },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:id
 * Busca um usuário pelo ID.
 */
async function getUserById(req, res, next) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, name, email, created_at, updated_at")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error("Usuário não encontrado");
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({
      success: true,
      data: sanitizeUser(data),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /users/:id
 * Atualiza um usuário existente.
 */
async function updateUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      // Verifica se o novo email já está em uso por outro usuário
      const { data: existing, error: findError } = await supabase
        .from(TABLE)
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (findError) throw findError;

      if (existing && existing.id !== req.params.id) {
        const err = new Error("Já existe outro usuário cadastrado com este email");
        err.code = "CONFLICT";
        throw err;
      }

      updates.email = email;
    }
    if (password) {
      updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(updates)
      .eq("id", req.params.id)
      .select("id, name, email, created_at, updated_at")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error("Usuário não encontrado");
      err.code = "NOT_FOUND";
      throw err;
    }

    res.json({
      success: true,
      data: sanitizeUser(data),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /users/:id
 * Deleta um usuário pelo ID.
 */
async function deleteUser(req, res, next) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", req.params.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error("Usuário não encontrado");
      err.code = "NOT_FOUND";
      throw err;
    }

    res.status(200).json({
      success: true,
      data: { message: "Usuário deletado com sucesso" },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
