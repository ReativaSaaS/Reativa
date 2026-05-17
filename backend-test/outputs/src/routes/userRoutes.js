const { Router } = require("express");
const {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  validateCreateUser,
  validateUpdateUser,
  validateUUID,
} = require("../middleware/validate");

const router = Router();

// POST   /users       - Cria um novo usuário
router.post("/", validateCreateUser, createUser);

// GET    /users       - Lista todos os usuários (com paginação)
router.get("/", listUsers);

// GET    /users/:id   - Busca um usuário por ID
router.get("/:id", validateUUID, getUserById);

// PUT    /users/:id   - Atualiza um usuário
router.put("/:id", validateUUID, validateUpdateUser, updateUser);

// DELETE /users/:id   - Deleta um usuário
router.delete("/:id", validateUUID, deleteUser);

module.exports = router;
